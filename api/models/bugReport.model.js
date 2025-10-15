// models/bugReport.model.js
import mongoose from "mongoose";

const bugReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    issue: {
        type: String,
        required: true
    },
    bugType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        required: false
    }],
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'resolved'],
        default: 'pending'
    },
    resolutionNotes: {
        type: String
    }
}, { timestamps: true });

const BugReport = mongoose.model('BugReport', bugReportSchema);
export default BugReport;