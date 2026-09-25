const Health = require("../Model/Health");
const User = require("../Model/user");
const setmedicalinfo = async (req, res) => {
  try {
    const userId =
      req.user?._id ||
      req.result?._id ||
      req.result?._conditions?._id ||
      req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID not found in request" });
    }

    const { BloodGroup, Age, Anydisease } = req.body;

     const healthDoc = await Health.findOneAndUpdate(
      { userId },
      {
        $set: {
          userId,
          BloodGroup,
          Age: Number(Age),
          Anydisease: Anydisease || "None",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );
   await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          MedicalInfo: healthDoc._id,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      message: "Medical info saved successfully",
      data: healthDoc,
    });
  } catch (error) {
    res.status(501).send(error.message);
  }
};

const getmedicalinfo = async (req, res) => {
  try {
    const userId =   req.user?._id ||
      req.result?._id ||
      req.result?._conditions?._id ||
      req.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID not found in request" });
    }
    const user = await User.findById(userId).populate({
      path: "MedicalInfo",
      select: "BloodGroup Age Anydisease",
    });
    if (!user) {
      return res.status(404).json({ message: "User account not found" });
    }
    return res.status(200).json({
      data: user.MedicalInfo || null,
    });
  } catch (error) {
    res.status(500).send("Error: " + error);
  }
};

module.exports = { setmedicalinfo, getmedicalinfo };
