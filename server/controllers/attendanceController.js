const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

exports.getAttendance = async (req, res, next) => {
  try {
    const { batchId, date } = req.query;
    if (!batchId || !date) {
      return res.status(400).json({ success: false, message: 'batchId and date are required' });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({ batchId, date: attendanceDate }).populate('records.studentId');

    if (!attendance) {
      const students = await Student.find({ batchId, status: 'active' });
      attendance = {
        batchId,
        date: attendanceDate,
        records: students.map((s) => ({ studentId: s, status: 'present' })),
      };
    }

    res.json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

exports.saveAttendance = async (req, res, next) => {
  try {
    const { batchId, date, records } = req.body;
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOneAndUpdate(
      { batchId, date: attendanceDate },
      { batchId, date: attendanceDate, records },
      { new: true, upsert: true, runValidators: true }
    ).populate('records.studentId');

    res.json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

exports.getAttendanceHistory = async (req, res, next) => {
  try {
    const { batchId } = req.query;
    const filter = batchId ? { batchId } : {};
    const history = await Attendance.find(filter).populate('batchId').sort({ date: -1 }).limit(100);
    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

exports.getStudentAttendance = async (req, res, next) => {
  try {
    let studentId = req.params.studentId;

    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id });
      if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
      studentId = student._id;
    }

    const attendances = await Attendance.find({ 'records.studentId': studentId }).sort({ date: -1 });

    const records = [];
    let present = 0;
    let total = 0;

    attendances.forEach((att) => {
      const record = att.records.find((r) => r.studentId.toString() === studentId.toString());
      if (record) {
        records.push({ date: att.date, status: record.status, batchId: att.batchId });
        total++;
        if (record.status === 'present') present++;
      }
    });

    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    res.json({
      success: true,
      data: { records, summary: { present, absent: total - present, total, percentage } },
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudentAttendancePercentage = async (req, res, next) => {
  try {
    const { batchId } = req.query;
    const students = await Student.find(batchId ? { batchId, status: 'active' } : { status: 'active' });
    const attendances = await Attendance.find(batchId ? { batchId } : {});

    const data = students.map((student) => {
      let present = 0;
      let total = 0;
      attendances.forEach((att) => {
        const record = att.records.find((r) => r.studentId.toString() === student._id.toString());
        if (record) {
          total++;
          if (record.status === 'present') present++;
        }
      });
      return {
        student,
        present,
        absent: total - present,
        total,
        percentage: total > 0 ? Math.round((present / total) * 100) : 0,
      };
    });

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
