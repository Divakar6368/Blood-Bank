const Validate = require("../Utils/Validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Model/user");
const redisClient = require("../config/redis");
const geoip = require("geoip-lite");

const getLocationFromReq = (req) => {
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (ip && ip.includes(",")) ip = ip.split(",")[0].trim();
  
  if (!ip || ip === "::1" || ip === "127.0.0.1" || ip.startsWith("::ffff:127.")) {
    return "delhi";
  }

  const geo = geoip.lookup(ip);
  return geo && geo.city ? geo.city.toLowerCase() : "delhi";
};

const registeruser = async (req, res) => {
  try {
    Validate(req.body);
    const { Name, emailId, Password } = req.body;
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }
    const detectedLocation = getLocationFromReq(req);
    req.body.Password = await bcrypt.hash(Password, 8);
    req.body.role = "user";
    req.body.Location = req.body.Location || detectedLocation;

    const user = await User.create(req.body);
    const token = jwt.sign(
      { _id: user._id, emailId: emailId },
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 }
    );
    const reply = {
      Name: user.Name,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
      Bookings:user.Bookings,
      Location: user.Location,
    };
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.cookie("location", user.Location, { maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.status(201).json({
      user: reply,
      message: "Register Successfully",
    });
  } catch (error) {
    res.status(400).send("ERROR" + error);
  }
};

const loginuser = async (req, res) => {
  try {
    const { emailId, Password } = req.body;
    if (!emailId) throw new Error("Invalid Credentials");
    if (!Password) throw new Error("Invalid Credentials");
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const allow = await bcrypt.compare(Password, user.Password);
    if (!allow) throw new Error("Invalid Credentials");

    const detectedLocation = getLocationFromReq(req);
    if (detectedLocation && user.Location !== detectedLocation) {
      user.Location = detectedLocation;
      await user.save();
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
      expiresIn: 60 * 60,
    });
    const reply = {
      Name: user.Name,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
      Bookings:user.Bookings,
      Location: user.Location,
    };
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.cookie("location", user.Location, { maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.status(200).json({
      user: reply,
      message: "Login Successfully",
    });
  } catch (error) {
    res.status(401).send("Error: " + error);
  }
};

const logoutuser = async (req, res) => {
  try {
    const { token } = req.cookies;
    const payload = jwt.decode(token);
    if (!token) throw new Error("Invalid User");
    await redisClient.set(`token:${token}`, "Blocked");
    await redisClient.expireAt(`token:${token}`, payload.exp);
    res.cookie(`token`, null, { expires: new Date(Date.now()) });
    res.cookie("location", null, { expires: new Date(Date.now()) });
    res.status(200).send("Logged Out Succesfully");
  } catch (error) {
    res.status(503).send("Error: " + error);
  }
};

const BeAdmin = async (req, res) => {
  try {
    Validate(req.body);
    const { Name, emailId, Password } = req.body;
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }
    const detectedLocation = getLocationFromReq(req);
    const hashedPassword = await bcrypt.hash(Password, 8);
    const user = await User.create({
      ...req.body,
      Password: hashedPassword,
      role: "admin",
      Location: req.body.Location || detectedLocation,
    });
    const reply = {
      Name: user.Name,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
      Location: user.Location,
    };
    res.status(201).json({
      user: reply,
      message: "Register Successfully",
    });
  } catch (error) {
    res.status(400).send("ERROR" + error);
  }
};

module.exports = { registeruser, loginuser, logoutuser, BeAdmin };
