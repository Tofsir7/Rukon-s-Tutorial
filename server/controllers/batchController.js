const Batch = require('../models/Batch');
const Student = require('../models/Student');

const VALID_PAYMENT_PROVIDERS = ['bkash', 'rocket', 'nagad', 'bank'];

const normalizePaymentAccounts = (accounts = []) =>
  accounts
    .filter((account) => account && account.accountNumber)
    .map((account) => ({
      provider: String(account.provider || '').toLowerCase(),
      accountNumber: String(account.accountNumber || '').trim(),
      accountName: String(account.accountName || '').trim(),
      isActive: account.isActive !== false,
    }));

const validatePaymentAccounts = (accounts = []) => {
  const invalid = accounts.find((account) => !VALID_PAYMENT_PROVIDERS.includes(account.provider));
  if (invalid) return `${invalid.provider || 'Selected payment provider'} is not allowed`;
  return '';
};

exports.getBatches = async (req, res, next) => {
  try {
    const { status, classLevel } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (classLevel) filter.classLevel = classLevel;

    const batches = await Batch.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: batches.length, data: batches });
  } catch (error) {
    next(error);
  }
};

exports.getPublicBatches = async (req, res, next) => {
  try {
    const batches = await Batch.find({ status: 'active' }).sort({ classLevel: 1, name: 1 });
    res.json({ success: true, data: batches });
  } catch (error) {
    next(error);
  }
};

exports.getBatch = async (req, res, next) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
    res.json({ success: true, data: batch });
  } catch (error) {
    next(error);
  }
};

exports.createBatch = async (req, res, next) => {
  try {
    const paymentAccounts = normalizePaymentAccounts(req.body.paymentAccounts);
    const validationError = validatePaymentAccounts(paymentAccounts);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

    const batch = await Batch.create({ ...req.body, paymentAccounts });
    res.status(201).json({ success: true, data: batch });
  } catch (error) {
    next(error);
  }
};

exports.updateBatch = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (Object.prototype.hasOwnProperty.call(payload, 'paymentAccounts')) {
      payload.paymentAccounts = normalizePaymentAccounts(payload.paymentAccounts);
      const validationError = validatePaymentAccounts(payload.paymentAccounts);
      if (validationError) return res.status(400).json({ success: false, message: validationError });
    }

    const batch = await Batch.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
    res.json({ success: true, data: batch });
  } catch (error) {
    next(error);
  }
};

exports.deleteBatch = async (req, res, next) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
    res.json({ success: true, message: 'Batch deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getBatchStudents = async (req, res, next) => {
  try {
    const students = await Student.find({ batchId: req.params.id }).sort({ name: 1 });
    res.json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};
