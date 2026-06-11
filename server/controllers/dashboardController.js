const Student = require('../models/Student');
const Batch = require('../models/Batch');
const Notice = require('../models/Notice');
const Admission = require('../models/Admission');
const Payment = require('../models/Payment');
const Attendance = require('../models/Attendance');
const { calculatePaymentStatus } = require('../utils/helpers');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments({ status: 'active' });
    const totalBatches = await Batch.countDocuments({ status: 'active' });
    const totalNotices = await Notice.countDocuments({ status: 'published' });

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthlyPayments = await Payment.find({ month: currentMonth });
    const monthlyCollected = monthlyPayments.reduce((sum, p) => sum + p.paidAmount, 0);

    const duePayments = await Payment.find({ status: { $in: ['due', 'partial'] } });
    const totalDue = duePayments.reduce((sum, p) => sum + p.dueAmount, 0);

    const recentAdmissions = await Admission.find().sort({ createdAt: -1 }).limit(5);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNames[today.getDay()];

    const activeBatches = await Batch.find({ status: 'active' });
    const todaysClasses = activeBatches.filter((b) =>
      b.schedule.toLowerCase().includes(todayName.toLowerCase().slice(0, 3))
    );

    res.json({
      success: true,
      data: {
        totalStudents,
        totalBatches,
        totalNotices,
        monthlyCollected,
        totalDue,
        currentMonth,
        recentAdmissions,
        todaysClasses,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudentDashboard = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id }).populate('batchId');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const Notice = require('../models/Notice');
    const Material = require('../models/Material');
    const Payment = require('../models/Payment');
    const Attendance = require('../models/Attendance');

    const notices = await Notice.find({
      status: 'published',
      $or: [{ targetType: 'all' }, { targetType: 'batch', batchId: student.batchId }],
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const materials = student.batchId
      ? await Material.find({ batchId: student.batchId }).sort({ createdAt: -1 }).limit(5)
      : [];

    const payments = await Payment.find({ studentId: student._id }).sort({ month: -1 }).limit(3);
    const totalDue = payments.reduce((sum, p) => sum + p.dueAmount, 0);

    const attendances = await Attendance.find({ 'records.studentId': student._id });
    let present = 0;
    let total = 0;
    attendances.forEach((att) => {
      const record = att.records.find((r) => r.studentId.toString() === student._id.toString());
      if (record) {
        total++;
        if (record.status === 'present') present++;
      }
    });

    res.json({
      success: true,
      data: {
        student,
        notices,
        materials,
        payments,
        attendanceSummary: {
          present,
          absent: total - present,
          total,
          percentage: total > 0 ? Math.round((present / total) * 100) : 0,
        },
        totalDue,
      },
    });
  } catch (error) {
    next(error);
  }
};
