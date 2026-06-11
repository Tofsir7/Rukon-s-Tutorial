const Student = require('../models/Student');
const User = require('../models/User');
const { generateStudentId } = require('../utils/helpers');

exports.getStudents = async (req, res, next) => {
  try {
    const { search, batchId, classLevel, status } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    if (batchId) filter.batchId = batchId;
    if (classLevel) filter.classLevel = classLevel;
    if (status) filter.status = status;

    const students = await Student.find(filter).populate('batchId').sort({ createdAt: -1 });
    res.json({ success: true, count: students.length, data: students });
  } catch (error) {
    next(error);
  }
};

exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('batchId');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

exports.createStudent = async (req, res, next) => {
  try {
    const { name, email, password, phone, guardianPhone, classLevel, schoolCollege, address, batchId, admissionDate, status } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'student',
      status: status || 'active',
    });

    const studentId = await generateStudentId(Student);

    const student = await Student.create({
      studentId,
      userId: user._id,
      name,
      phone,
      guardianPhone,
      classLevel,
      schoolCollege,
      address,
      batchId: batchId || null,
      admissionDate: admissionDate || Date.now(),
      status: status || 'active',
    });

    const populated = await Student.findById(student._id).populate('batchId');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    let student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const { name, email, password, phone, guardianPhone, classLevel, schoolCollege, address, batchId, admissionDate, status } = req.body;

    if (email) {
      const existingUser = await User.findOne({ email: email.toLowerCase(), _id: { $ne: student.userId } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      const userUpdate = { name: name || student.name, email: email.toLowerCase(), status: status || undefined };
      if (password) userUpdate.password = password;
      await User.findByIdAndUpdate(student.userId, userUpdate);
    } else if (name || status) {
      await User.findByIdAndUpdate(student.userId, { name, status });
    }

    student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, phone, guardianPhone, classLevel, schoolCollege, address, batchId, admissionDate, status },
      { new: true, runValidators: true }
    ).populate('batchId');

    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    await User.findByIdAndDelete(student.userId);
    await Student.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Student deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id }).populate('batchId');
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};
