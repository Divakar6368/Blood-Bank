const admin=require('../Model/Admindata')
const Sample=require('../Model/sampleavailable')

const setstoredata = async (req, res) => {
    try {
        const userId = req.user?._id || req.result?._id || req.result?._conditions?._id || req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found in request" });
        }

        const { StoreName, StoreLocation, description, openAt, closeAt } = req.body;

        const store = await admin.findOneAndUpdate(
            { userId },
            { StoreName, StoreLocation, description, openAt, closeAt, userId },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );

        return res.status(200).json({
            message: "Store data saved successfully",
            data: store
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const storeinfo = async (req, res) => {
    try {
        const userId = req.user?._id || req.result?._id || req.result?._conditions?._id || req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found in request" });
        }

        const store = await admin.findOne({ userId }).populate('AvailableSamples pending');

        if (!store) {
            return res.status(404).json({ message: "Store profile not found for this admin" });
        }

        return res.status(200).json({ data: store });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


const setsample = async (req, res) => {
    try {
        const { id } = req.params; // storeId 
        const { BloodGroup, Price, Avilability, TotalStock, Discount } = req.body;

        const store = await admin.findById(id);
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }
        const sampleDoc = await Sample.create({
            storeId: id,
            BloodGroup,
            Price,
            Avilability,
            TotalStock,
            Discount
        });

        await admin.findByIdAndUpdate(id, {
            $addToSet: { AvailableSamples: sampleDoc._id }
        });

        return res.status(201).json({
            message: "Sample added successfully",
            data: sampleDoc
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Sample for this blood group already exists in this store" });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updatesample = async (req, res) => {
    try {
        const { id } = req.params; // sample 
        const { BloodGroup, Price, Avilability, TotalStock, Discount } = req.body;

        const updatedSample = await Sample.findByIdAndUpdate(
            id,
            { BloodGroup, Price, Avilability, TotalStock, Discount },
            { new: true, runValidators: true }
        );

        if (!updatedSample) {
            return res.status(404).json({ message: "Sample not found" });
        }

        return res.status(200).json({
            message: "Sample updated successfully",
            data: updatedSample
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getsampleinfo = async (req, res) => {
    try {
        const { id } = req.params; // sampleId 

        const singleSample = await Sample.findById(id);
        if (singleSample) {
            return res.status(200).json({ data: singleSample });
        }

        // If not, fetch all samples belonging to this storeId
        const storeSamples = await Sample.find({ storeId: id });
        if (storeSamples.length > 0) {
            return res.status(200).json({ data: storeSamples });
        }

        return res.status(404).json({ message: "No samples found" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports={setstoredata,storeinfo,setsample,updatesample}