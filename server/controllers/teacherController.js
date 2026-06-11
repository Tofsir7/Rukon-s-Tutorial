const Teacher = require('../models/Teacher');

exports.getTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find({ status: 'active' }).sort({ order: 1 });
    res.json({ success: true, data: teachers });
  } catch (error) {
    next(error);
  }
};

exports.getAllTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find().sort({ order: 1 });
    res.json({ success: true, data: teachers });
  } catch (error) {
    next(error);
  }
};

exports.createTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.create(req.body);
    res.status(201).json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
};

exports.updateTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });
    res.json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
};

exports.deleteTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });
    res.json({ success: true, message: 'Teacher deleted' });
  } catch (error) {
    next(error);
  }
};
