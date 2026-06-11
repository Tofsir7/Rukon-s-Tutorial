const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    guardianPhone: { type: String, required: true },
    classLevel: { type: String, required: true },
    schoolCollege: { type: String, default: '' },
    address: { type: String, default: '' },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', default: null },
    admissionDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
