const mongoose = require("mongoose");

const deliveryAddressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    addresses: [
        {
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            country: { type: String, required: true },
            isDefault: { type: Boolean, default: false }
        }
    ]
}, { timestamps: true });

const DeliveryAddress = mongoose.model("DeliveryAddress", deliveryAddressSchema);

module.exports = DeliveryAddress;