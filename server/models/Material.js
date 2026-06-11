const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['pdf', 'note', 'assignment', 'recorded_class', 'model_test'], required: true },
    subject: { type: String, required: true },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    url: { type: String, required: true },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Material', materialSchema);
