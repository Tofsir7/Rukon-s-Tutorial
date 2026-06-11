const Exam = require('../models/Exam');
const Result = require('../models/Result');
const Student = require('../models/Student');
const { calculateGrade } = require('../utils/helpers');

exports.getExams = async (req, res, next) => {
  try {
    const { batchId } = req.query;
    const filter = batchId ? { batchId } : {};
    const exams = await Exam.find(filter).populate('batchId').sort({ examDate: -1 });
    res.json({ success: true, data: exams });
  } catch (error) {
    next(error);
  }
};

exports.createExam = async (req, res, next) => {
  try {
    const exam = await Exam.create(req.body);
    const populated = await Exam.findById(exam._id).populate('batchId');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

exports.updateExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('batchId');
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    res.json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
};

exports.deleteExam = async (req, res, next) => {
  try {
    await Result.deleteMany({ examId: req.params.id });
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    res.json({ success: true, message: 'Exam deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getExamResults = async (req, res, next) => {
  try {
    const results = await Result.find({ examId: req.params.examId })
      .populate('studentId')
      .populate({ path: 'examId', populate: { path: 'batchId' } });
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

exports.saveResults = async (req, res, next) => {
  try {
    const { examId, results } = req.body;
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

    const saved = [];
    for (const item of results) {
      const percentage = Math.round((item.marks / exam.totalMarks) * 100);
      const grade = calculateGrade(percentage);
      const result = await Result.findOneAndUpdate(
        { examId, studentId: item.studentId },
        { marks: item.marks, percentage, grade, remarks: item.remarks || '' },
        { new: true, upsert: true, runValidators: true }
      );
      saved.push(result);
    }

    const populated = await Result.find({ examId }).populate('studentId');
    res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

exports.getStudentResults = async (req, res, next) => {
  try {
    let studentId = req.params.studentId;

    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id });
      if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
      studentId = student._id;
    }

    const results = await Result.find({ studentId })
      .populate({ path: 'examId', populate: { path: 'batchId' } })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};
