const calculateGrade = (percentage) => {
  if (percentage >= 80) return 'A+';
  if (percentage >= 70) return 'A';
  if (percentage >= 60) return 'A-';
  if (percentage >= 50) return 'B';
  if (percentage >= 40) return 'C';
  if (percentage >= 33) return 'D';
  return 'F';
};

const calculatePaymentStatus = (payableAmount, paidAmount) => {
  const dueAmount = Math.max(0, payableAmount - paidAmount);
  let status = 'due';
  if (paidAmount >= payableAmount) status = 'paid';
  else if (paidAmount > 0) status = 'partial';
  return { dueAmount, status };
};

const generateStudentId = async (Student) => {
  const year = new Date().getFullYear().toString().slice(-2);
  const count = await Student.countDocuments();
  return `RT${year}${String(count + 1).padStart(4, '0')}`;
};

module.exports = { calculateGrade, calculatePaymentStatus, generateStudentId };
