// models/digitalAdvertisement.model.js
import mongoose from "mongoose";

const digitalAdvertisementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    groupName: {
        type: String,
        required: true
    },
    groupIntro: {
        type: String,
        required: true
    },
    groupLink: {
        type: String,
        required: true
    },
    whatsapp: {
        type: String
    },
    image: {  // Changed from images[] to image (single)
        type: String,
        required: false
    },
    verifiedContact: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    rejectionReason: {
        type: String
    },
    postingDate: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const DigitalAdvertisement = mongoose.model('DigitalAdvertisement', digitalAdvertisementSchema);
export default DigitalAdvertisement;