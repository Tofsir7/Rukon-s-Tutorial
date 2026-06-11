const Payment = require('../models/Payment');
const Student = require('../models/Student');
const { calculatePaymentStatus } = require('../utils/helpers');

exports.getPayments = async (req, res, next) => {
  try {
    const { month, batchId, status, studentId } = req.query;
    const filter = {};
    if (month) filter.month = month;
    if (status) filter.status = status;
    if (studentId) filter.studentId = studentId;

    let payments = await Payment.find(filter)
      .populate('studentId')
      .populate('batchId')
      .sort({ paymentDate: -1 });

    if (batchId) {
      payments = payments.filter((p) => p.batchId && p.batchId._id.toString() === batchId);
    }

    res.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    next(error);
  }
};

exports.getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('studentId').populate('batchId');
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

exports.createPayment = async (req, res, next) => {
  try {
    const { studentId, batchId, month, payableAmount, paidAmount, paymentMethod, note, paymentDate } = req.body;
    const { dueAmount, status } = calculatePaymentStatus(Number(payableAmount), Number(paidAmount));

    const payment = await Payment.create({
      studentId,
      batchId,
      month,
      payableAmount,
      paidAmount,
      dueAmount,
      status,
      paymentMethod: paymentMethod || 'cash',
      note,
      paymentDate: paymentDate || Date.now(),
    });

    const populated = await Payment.findById(payment._id).populate('studentId').populate('batchId');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

exports.updatePayment = async (req, res, next) => {
  try {
    const { payableAmount, paidAmount, paymentMethod, note, paymentDate, month } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    const payable = payableAmount !== undefined ? Number(payableAmount) : payment.payableAmount;
    const paid = paidAmount !== undefined ? Number(paidAmount) : payment.paidAmount;
    const { dueAmount, status } = calculatePaymentStatus(payable, paid);

    const updated = await Payment.findByIdAndUpdate(
      req.params.id,
      { payableAmount: payable, paidAmount: paid, dueAmount, status, paymentMethod, note, paymentDate, month },
      { new: true, runValidators: true }
    )
      .populate('studentId')
      .populate('batchId');

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deletePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, message: 'Payment deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getDueList = async (req, res, next) => {
  try {
    const payments = await Payment.find({ status: { $in: ['due', 'partial'] } })
      .populate('studentId')
      .populate('batchId')
      .sort({ month: -1 });
    res.json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

exports.getMyPayments = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const payments = await Payment.find({ studentId: student._id })
      .populate('batchId')
      .sort({ month: -1 });

    const totalDue = payments.reduce((sum, p) => sum + p.dueAmount, 0);
    const totalPaid = payments.reduce((sum, p) => sum + p.paidAmount, 0);

    res.json({ success: true, data: payments, summary: { totalDue, totalPaid } });
  } catch (error) {
    next(error);
  }
};

exports.getPaymentStats = async (req, res, next) => {
  try {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const monthlyPayments = await Payment.find({ month: currentMonth });
    const monthlyCollected = monthlyPayments.reduce((sum, p) => sum + p.paidAmount, 0);

    const duePayments = await Payment.find({ status: { $in: ['due', 'partial'] } });
    const totalDue = duePayments.reduce((sum, p) => sum + p.dueAmount, 0);

    res.json({ success: true, data: { monthlyCollected, totalDue, currentMonth } });
  } catch (error) {
    next(error);
  }
};
