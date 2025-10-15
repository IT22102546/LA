import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: [
            'Land Sale',
            'House Sale',
            'Vacancies',
            'Baby Staff',
            'Business Ads',
            'Rent',
            'Service',
            'Courses',
            'Vehicles',
            'Electronics',
            'Clothes',
            'Other',
            'Health & Beauty',
            'Shop Sale',
            'Food & Events'
        ]
    },
    heading: {
        type: String,
        required: true,
        maxlength: 100
    },
    details: {
        type: String,
        required: true
    },
    phone1: {
        type: String,
        required: true
    },
    phone2: {
        type: String
    },
    whatsapp: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    district: {
        type: String,
       
    },
    images: [{
        type: String,
        required: false
    }],
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

const Advertisement = mongoose.model('Advertisement', advertisementSchema);
export default Advertisement;