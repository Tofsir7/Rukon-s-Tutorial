const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    admissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admission', default: null },
    month: { type: String, required: true },
    payableAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true, default: 0 },
    dueAmount: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['paid', 'partial', 'due'], required: true },
    paymentMethod: { type: String, enum: ['cash', 'bkash', 'nagad', 'rocket', 'bank', 'other'], default: 'cash' },
    senderAccountNumber: { type: String, default: '' },
    centerAccountNumber: { type: String, default: '' },
    transactionId: { type: String, default: '' },
    note: { type: String, default: '' },
    paymentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
