const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, default: 'System' },
    userRole: { type: String, default: 'system' },
    action: { 
        type: String, 
        enum: ['LOGIN', 'REGISTER', 'SUBMIT_APPLICATION', 'VIEW_DECISION', 'CONTEST', 'RE_EVALUATE', 'DELETE_CASE', 'VIEW_ANALYTICS'],
        required: true 
    },
    caseId: { type: String },
    details: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
