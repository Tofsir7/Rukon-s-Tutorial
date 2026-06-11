const Material = require('../models/Material');
const Student = require('../models/Student');

exports.getMaterials = async (req, res, next) => {
  try {
    const { batchId, type } = req.query;
    const filter = {};
    if (batchId) filter.batchId = batchId;
    if (type) filter.type = type;

    const materials = await Material.find(filter).populate('batchId').sort({ createdAt: -1 });
    res.json({ success: true, data: materials });
  } catch (error) {
    next(error);
  }
};

exports.getMyMaterials = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    if (!student.batchId) return res.json({ success: true, data: [] });

    const materials = await Material.find({ batchId: student.batchId }).populate('batchId').sort({ createdAt: -1 });
    res.json({ success: true, data: materials });
  } catch (error) {
    next(error);
  }
};

exports.createMaterial = async (req, res, next) => {
  try {
    const material = await Material.create(req.body);
    const populated = await Material.findById(material._id).populate('batchId');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

exports.updateMaterial = async (req, res, next) => {
  try {
    const material = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('batchId');
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });
    res.json({ success: true, data: material });
  } catch (error) {
    next(error);
  }
};

exports.deleteMaterial = async (req, res, next) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });
    res.json({ success: true, message: 'Material deleted' });
  } catch (error) {
    next(error);
  }
};
