const mongoose = require('mongoose');
const Booking=require('../Model/Bookingdata')
const Sample = require('../Model/sampleavailable');
const User = require('../Model/user');
const admin = require('../Model/Admindata');

const createBooking  = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user?._id || req.result?._id || req.result?._conditions?._id || req.userId;
        if (!userId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({ message: "Unauthorized: User ID not found" });
        }

        const { sampleId, storeId, quantity } = req.body;

        if (!sampleId || !storeId || !quantity) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "sampleId, storeId, and quantity are required" });
        }

        const parsedQty = Number(quantity);
        if (!Number.isInteger(parsedQty) || parsedQty < 1 || parsedQty > 3) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Quantity must be an integer between 1 and 3" });
        }

        // 1. Check stock & decrement atomically
        const sampleDoc = await Sample.findOneAndUpdate(
            { 
                _id: sampleId, 
                storeId: storeId, 
                TotalStock: { $gte: parsedQty }, 
                Avilability: true 
            },
            { $inc: { TotalStock: -parsedQty } },
            { new: true, session }
        );

        if (!sampleDoc) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ 
                message: "Stock unavailable or requested quantity exceeds available units" 
            });
        }

        // Auto-mark unavailable if stock runs out
        if (sampleDoc.TotalStock === 0) {
            await Sample.findByIdAndUpdate(sampleId, { Avilability: false }, { session });
        }

        // 2. Create Booking  document
        const [newBooking] = await Booking .create(
            [
                {
                    userId: userId,
                    adminId: storeId,
                    sampleId: sampleId,
                    quantity: parsedQty
                }
            ],
            { session }
        );

        // 3. Link Booking  to User model
        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { Bookings: newBooking._id } },
            { session }
        );

        // 4. Calculate total revenue & update Admin store
        const priceAfterDiscount = sampleDoc.Discount > 0
            ? sampleDoc.Price - (sampleDoc.Price * sampleDoc.Discount) / 100
            : sampleDoc.Price;
        const totalCost = priceAfterDiscount * parsedQty;

        await admin.findByIdAndUpdate(
            storeId,
            {
                $addToSet: { pending: newBooking ._id },
                $inc: { 
                    totalsale: parsedQty, 
                    totalearning: totalCost 
                }
            },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            message: "Booking  successfully created",
            booking: newBooking,
            remainingStock: sampleDoc.TotalStock
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Booking  transaction failed", error: error.message });
    }
};

const getUserBooking = async (req, res) => {
    try {
        const userId = req.user?._id || req.result?._id || req.result?._conditions?._id || req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" });
        }

        const userData = await User.findById(userId).populate({
            path: 'Bookings',
            options: { sort: { createdAt: -1 } }
        });

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ data: userData.Bookings});
    } catch (error) {
        return res.status(500).json({ message: "Error fetching Booking s", error: error.message });
    }
};

module.exports = { createBooking , getUserBooking };