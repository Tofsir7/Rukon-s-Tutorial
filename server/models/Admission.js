const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema(
  {
    applicantUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', default: null },
    courseName: { type: String, default: '' },
    batchName: { type: String, default: '' },
    studentName: { type: String, required: true },
    studentPhone: { type: String, required: true },
    guardianPhone: { type: String, default: '' },
    classLevel: { type: String, default: '' },
    schoolCollege: { type: String, default: '' },
    interestedBatch: { type: String, default: '' },
    address: { type: String, default: '' },
    message: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'reviewed', 'approved', 'rejected'], default: 'pending' },
    paymentStatus: {
      type: String,
      enum: ['not_paid', 'payment_submitted', 'paid', 'due', 'rejected'],
      default: 'not_paid',
    },
    paymentOption: { type: String, enum: ['pay_now', 'pay_later'], default: 'pay_later' },
    paymentMethod: { type: String, default: '' },
    paymentProvider: { type: String, enum: ['', 'bkash', 'nagad', 'rocket', 'bank', 'cash', 'other'], default: '' },
    centerAccountNumber: { type: String, default: '' },
    senderAccountNumber: { type: String, default: '' },
    transactionId: { type: String, default: '' },
    payableAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 },
    paymentDate: { type: Date, default: null },
    paymentNote: { type: String, default: '' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    approvedAt: { type: Date, default: null },
    linkedStudentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null },
    rejectedReason: { type: String, default: '' },
  },
  { timestamps: true }
);

admissionSchema.index({ applicantUserId: 1, batchId: 1, status: 1 });
admissionSchema.index({ studentName: 'text', studentPhone: 'text', transactionId: 'text', batchName: 'text', courseName: 'text' });

module.exports = mongoose.model('Admission', admissionSchema);
