const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    marks: { type: Number, required: true },
    percentage: { type: Number, required: true },
    grade: { type: String, required: true },
    remarks: { type: String, default: '' },
  },
  { timestamps: true }
);

resultSchema.index({ examId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Result', resultSchema);
