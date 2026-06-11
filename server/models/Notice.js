const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    targetType: { type: String, enum: ['public', 'all', 'batch'], required: true },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', default: null },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notice', noticeSchema);
