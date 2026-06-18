const Notice = require('../models/Notice');
const Student = require('../models/Student');

const sanitizeNoticePayload = (body) => ({
  title: body.title,
  description: body.description,
  targetType: body.targetType,
  batchId: body.targetType === 'batch' ? body.batchId : null,
  status: body.status,
  noticeImageUrl: String(body.noticeImageUrl || body.imageUrl || '').trim(),
});

exports.getNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find().populate('batchId').sort({ createdAt: -1 });
    res.json({ success: true, data: notices });
  } catch (error) {
    next(error);
  }
};

exports.getPublicNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find({ targetType: 'public', status: 'published' }).sort({ createdAt: -1 });
    res.json({ success: true, data: notices });
  } catch (error) {
    next(error);
  }
};

exports.getMyNotices = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const notices = await Notice.find({
      status: 'published',
      $or: [{ targetType: 'all' }, { targetType: 'batch', batchId: student.batchId }],
    })
      .populate('batchId')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: notices });
  } catch (error) {
    next(error);
  }
};

exports.createNotice = async (req, res, next) => {
  try {
    const notice = await Notice.create(sanitizeNoticePayload(req.body));
    const populated = await Notice.findById(notice._id).populate('batchId');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

exports.updateNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, sanitizeNoticePayload(req.body), { new: true, runValidators: true }).populate('batchId');
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    res.json({ success: true, data: notice });
  } catch (error) {
    next(error);
  }
};

exports.deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    res.json({ success: true, message: 'Notice deleted' });
  } catch (error) {
    next(error);
  }
};
