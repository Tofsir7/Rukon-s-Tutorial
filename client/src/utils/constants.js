export const SITE = {
  name: "Rukon's Tutorial",
  tagline: 'Your Path to Academic Excellence',
  address: 'Sarachar Road, Katiadi Purbapara, Beside Hiralal Sahar Field, Katiadi, Kishoreganj',
  phone: '01341703221',
  email: 'rukonahmed734@gamil.com',
  facebook: 'https://www.facebook.com/RukonsTutorial',
  mapLink: 'https://maps.app.goo.gl/7LPTV886gPWFkpY17?g_st=aw',
  hours: '7:00 AM - 9:00 PM',
  about:
    "Rukon's Tutorial is a popular online and offline coaching center based in Katiadi, Kishoreganj, Bangladesh. It serves as a comprehensive academic learning hub specializing in science and mathematics.",
  mission: 'Not just teaching! Our main goal is to educate and make an ideal person for the country',
  targetAudience: 'Students from Class 8 to 12, specifically focusing on board exam preparation for JSC, SSC, and HSC candidates.',
};

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'bkash', label: 'bKash' },
  { value: 'nagad', label: 'Nagad' },
  { value: 'rocket', label: 'Rocket' },
  { value: 'bank', label: 'Bank' },
  { value: 'other', label: 'Other' },
];

export const MATERIAL_TYPES = [
  { value: 'pdf', label: 'PDF' },
  { value: 'note', label: 'Note' },
  { value: 'assignment', label: 'Assignment' },
  { value: 'recorded_class', label: 'Recorded Class' },
  { value: 'model_test', label: 'Model Test' },
];

export const NOTICE_TARGETS = [
  { value: 'public', label: 'Public Website' },
  { value: 'all', label: 'All Students' },
  { value: 'batch', label: 'Specific Batch' },
];

export const formatCurrency = (amount) => `৳${Number(amount || 0).toLocaleString('en-BD')}`;

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' });

export const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    paid: 'bg-green-100 text-green-800',
    partial: 'bg-yellow-100 text-yellow-800',
    due: 'bg-red-100 text-red-800',
    present: 'bg-green-100 text-green-800',
    absent: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    reviewed: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    not_paid: 'bg-red-100 text-red-800',
    payment_submitted: 'bg-blue-100 text-blue-800',
    published: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getGradeColor = (grade) => {
  if (['A+', 'A'].includes(grade)) return 'text-green-600';
  if (['A-', 'B'].includes(grade)) return 'text-blue-600';
  if (grade === 'C') return 'text-yellow-600';
  return 'text-red-600';
};
