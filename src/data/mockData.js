export const REGIONS = [
  { id: 'north', name: 'ภาคเหนือ', color: '#818cf8' },
  { id: 'northeast', name: 'ภาคตะวันออกเฉียงเหนือ', color: '#34d399' },
  { id: 'central', name: 'ภาคกลาง', color: '#fbbf24' },
  { id: 'east', name: 'ภาคตะวันออก', color: '#38bdf8' },
  { id: 'west', name: 'ภาคตะวันตก', color: '#f87171' },
  { id: 'south', name: 'ภาคใต้', color: '#c084fc' },
];

export const PROVINCES_DATA = [
  { name: 'กรุงเทพมหานคร', region: 'central', lat: 13.7563, lng: 100.5018, visited: 189, notVisited: 22, pending: 8, vitalsign: 477, cgm: 10680 },
  { name: 'สกลนคร', region: 'northeast', lat: 17.1545, lng: 104.1348, visited: 132, notVisited: 15, pending: 3, vitalsign: 311, cgm: 5769 },
  { name: 'อำนาจเจริญ', region: 'northeast', lat: 15.8585, lng: 104.6289, visited: 22, notVisited: 5, pending: 1, vitalsign: 50, cgm: 0 },
  { name: 'สมุทรปราการ', region: 'central', lat: 13.5991, lng: 100.5998, visited: 18, notVisited: 3, pending: 0, vitalsign: 35, cgm: 4306 },
  { name: 'พระนครศรีอยุธยา', region: 'central', lat: 14.3532, lng: 100.5685, visited: 12, notVisited: 2, pending: 0, vitalsign: 50, cgm: 0 },
  { name: 'เชียงใหม่', region: 'north', lat: 18.7883, lng: 98.9853, visited: 45, notVisited: 8, pending: 2, vitalsign: 89, cgm: 1200 },
  { name: 'ขอนแก่น', region: 'northeast', lat: 16.4322, lng: 102.8236, visited: 38, notVisited: 6, pending: 1, vitalsign: 72, cgm: 890 },
  { name: 'สุราษฎร์ธานี', region: 'south', lat: 9.1382, lng: 99.3217, visited: 25, notVisited: 4, pending: 1, vitalsign: 48, cgm: 560 },
  { name: 'นครราชสีมา', region: 'northeast', lat: 14.9799, lng: 102.0978, visited: 30, notVisited: 5, pending: 2, vitalsign: 65, cgm: 780 },
  { name: 'ชลบุรี', region: 'east', lat: 13.3611, lng: 100.9847, visited: 20, notVisited: 3, pending: 1, vitalsign: 42, cgm: 450 },
  { name: 'ภูเก็ต', region: 'south', lat: 7.8804, lng: 98.3923, visited: 15, notVisited: 2, pending: 0, vitalsign: 28, cgm: 320 },
  { name: 'เชียงราย', region: 'north', lat: 19.9105, lng: 99.8406, visited: 28, notVisited: 4, pending: 1, vitalsign: 55, cgm: 680 },
];

export const DASHBOARD_STATS = {
  totalPatients: 283,
  totalVisits: 397,
  totalVitalSigns: 193,
  abnormalVitalSigns: 188,
  hospitalsActive: 14,
  totalHospitals: 14,
  growthPatients: 277.3,
  growthVisits: 285.4,
  growthVitalSigns: 328.9,
  growthAbnormal: 337.2,
};

export const USAGE_CHART_DATA = {
  daily: [
    { label: '18 มี.ค.', vitalsign: 45, visit: 12 },
    { label: '19 มี.ค.', vitalsign: 62, visit: 18 },
    { label: '20 มี.ค.', vitalsign: 55, visit: 22 },
    { label: '21 มี.ค.', vitalsign: 78, visit: 15 },
    { label: '22 มี.ค.', vitalsign: 48, visit: 20 },
  ],
  weekly: [
    { label: 'สัปดาห์ 1', vitalsign: 180, visit: 65 },
    { label: 'สัปดาห์ 2', vitalsign: 220, visit: 82 },
    { label: 'สัปดาห์ 3', vitalsign: 195, visit: 75 },
    { label: 'สัปดาห์ 4', vitalsign: 250, visit: 90 },
  ],
  monthly: [
    { label: 'ม.ค.', vitalsign: 53, visit: 80 },
    { label: 'ก.พ.', vitalsign: 350, visit: 280 },
    { label: 'มี.ค.', vitalsign: 520, visit: 350 },
  ],
};

export const HOSPITAL_COMPARISON = [
  { name: 'รพ.ทดสอบ BMS', visited: 189, notVisited: 22, pending: 8, short: 'รพ.ทดสอบ BMS' },
  { name: 'รพ.สกลนคร', visited: 132, notVisited: 15, pending: 3, short: 'รพ.สกลนคร' },
  { name: 'รพ.ลาดปลิวหลวง', visited: 7, notVisited: 2, pending: 0, short: 'รพ.ลาดปลิวหลวง' },
  { name: 'รพ.บางไทร', visited: 20, notVisited: 3, pending: 0, short: 'รพ.บางไทร' },
  { name: 'รพ.คลองอ่ำนาจ', visited: 21, notVisited: 2, pending: 0, short: 'รพ.คลองอ่ำนาจ' },
  { name: 'รพ.สมเด็จพระยุพรา...', visited: 8, notVisited: 6, pending: 0, short: 'รพ.สมเด็จฯ' },
];

export const DISEASE_GROUPS = [
  { name: 'ความดันโลหิตสูง', count: 97, percentage: 24.4, color: '#818cf8' },
  { name: 'เบาหวาน', count: 37, percentage: 9.3, color: '#f472b6' },
  { name: 'IMC Stroke', count: 19, percentage: 4.8, color: '#34d399' },
  { name: 'ผู้สูงอายุ/ผู้พิการติดบ้าน/ติดเตียง', count: 15, percentage: 3.8, color: '#fbbf24' },
  { name: 'โรคหลอดเลือดสมอง (Stroke)', count: 12, percentage: 3.0, color: '#fb923c' },
  { name: 'เทสเคส', count: 12, percentage: 3.0, color: '#a78bfa' },
  { name: 'โรคเบาหวาน', count: 10, percentage: 2.5, color: '#f87171' },
  { name: 'โรคความดันโลหิตสูง', count: 10, percentage: 2.5, color: '#38bdf8' },
  { name: 'อื่นๆ', count: 70, percentage: 17.6, color: '#94a3b8' },
];

export const CRITICAL_CASES = [
  { id: 1, name: 'นางมงลักษณ์มานะพล', condition: 'BP Diastolic: 36.8', hospital: 'โรงพยาบาลสกลนคร', severity: 'critical', time: '2 นาที' },
  { id: 2, name: 'นางมงลักษณ์มานะพล', condition: 'BP Systolic: 0', hospital: 'โรงพยาบาลสกลนคร', severity: 'critical', time: '2 นาที' },
  { id: 3, name: 'น.ส.ธาตุทอง สีดา', condition: 'BP Diastolic: 36.8', hospital: 'โรงพยาบาลสกลนคร', severity: 'critical', time: '2 นาที' },
  { id: 4, name: 'น.ส.ธาตุทอง สีดา', condition: 'BP Systolic: 0', hospital: 'โรงพยาบาลสกลนคร', severity: 'critical', time: '2 นาที' },
];

export const CGM_PATIENTS = [
  { id: 1, name: 'นันทชัย แก้วนิ่น', initial: 'น', color: '#818cf8', avg: 147, readings: 30960, status: 'warning', gmi: 6.8, cv: 32, tirInRange: 62, tirAbove: 28, tirBelow: 10, hypoEvents: 3, hyperEvents: 12 },
  { id: 2, name: 'ปริญญา ลพสถิตย์', initial: 'ป', color: '#f59e0b', avg: 150, readings: 8470, status: 'warning', gmi: 6.9, cv: 38, tirInRange: 55, tirAbove: 35, tirBelow: 10, hypoEvents: 5, hyperEvents: 18 },
  { id: 3, name: 'พชรพงศ์ ธีนวงค์', initial: 'พ', color: '#22c55e', avg: 129, readings: 6229, status: 'normal', gmi: 6.2, cv: 28, tirInRange: 78, tirAbove: 15, tirBelow: 7, hypoEvents: 2, hyperEvents: 5 },
  { id: 4, name: 'ศรุดา เดชาภิกรณ์รู้', initial: 'ศ', color: '#f472b6', avg: 87, readings: 5586, status: 'normal', gmi: 5.4, cv: 22, tirInRange: 92, tirAbove: 3, tirBelow: 5, hypoEvents: 1, hyperEvents: 1 },
  { id: 5, name: 'น.ส.อัจฉรา พรหมณ์เสนะ', initial: 'อ', color: '#818cf8', avg: 107, readings: 5532, status: 'normal', gmi: 5.8, cv: 25, tirInRange: 85, tirAbove: 8, tirBelow: 7, hypoEvents: 2, hyperEvents: 3 },
];

export const CGM_GLUCOSE_TREND = [
  { time: '00:00', avg: 125, min: 95, max: 165 },
  { time: '02:00', avg: 118, min: 88, max: 155 },
  { time: '04:00', avg: 110, min: 82, max: 145 },
  { time: '06:00', avg: 105, min: 78, max: 140 },
  { time: '08:00', avg: 145, min: 105, max: 195 },
  { time: '10:00', avg: 160, min: 115, max: 210 },
  { time: '12:00', avg: 155, min: 110, max: 205 },
  { time: '14:00', avg: 138, min: 100, max: 180 },
  { time: '16:00', avg: 130, min: 92, max: 170 },
  { time: '18:00', avg: 150, min: 108, max: 198 },
  { time: '20:00', avg: 142, min: 102, max: 185 },
  { time: '22:00', avg: 132, min: 95, max: 172 },
];

export const FEATURE_USAGE = [
  { hospital: 'โรงพยาบาลทดสอบ BMS', vitalsign: 477, visit: 189, appointment: 41, assessment: 2, cgm: 0 },
  { hospital: 'โรงพยาบาลสกลนคร', vitalsign: 311, visit: 132, appointment: 3, assessment: 0, cgm: 0 },
  { hospital: '11252', vitalsign: 0, visit: 0, appointment: 186, assessment: 0, cgm: 0 },
  { hospital: '11334', vitalsign: 0, visit: 0, appointment: 53, assessment: 0, cgm: 0 },
  { hospital: 'โรงพยาบาลลาดปลิวหลวง', vitalsign: 45, visit: 7, appointment: 0, assessment: 0, cgm: 0 },
  { hospital: 'โรงพยาบาลบางไทร', vitalsign: 27, visit: 20, appointment: 0, assessment: 0, cgm: 0 },
  { hospital: 'โรงพยาบาลคลองอ่ำนาจ', vitalsign: 20, visit: 21, appointment: 2, assessment: 0, cgm: 0 },
  { hospital: '10779', vitalsign: 32, visit: 2, appointment: 0, assessment: 0, cgm: 0 },
];

export const VITALSIGN_PATIENTS = [
  { id: 1, name: 'นางมงลักษณ์ มานะพล', age: 76, gender: 'หญิง', lastDate: '20/03/2569', status: 'normal' },
  { id: 2, name: 'น.ส.ธาตุทอง สีดา', age: 65, gender: 'หญิง', lastDate: '20/03/2569', status: 'abnormal' },
  { id: 3, name: 'น.ส.สุพัชราพร บุญยันธนากุล', age: 26, gender: 'หญิง', lastDate: '20/03/2569', status: 'abnormal' },
  { id: 4, name: 'นางอารณ์ คำศรี', age: 80, gender: 'หญิง', lastDate: '19/03/2569', status: 'abnormal' },
  { id: 5, name: 'นายศักดิ์ดา บุญเลิศ', age: 75, gender: 'ชาย', lastDate: '19/03/2569', status: 'normal' },
  { id: 6, name: 'นายบุญมี ปิระนันท์', age: 46, gender: 'ชาย', lastDate: '19/03/2569', status: 'abnormal' },
  { id: 7, name: 'นางสมคิด นนท์ไพรวัลย์', age: 80, gender: 'หญิง', lastDate: '19/03/2569', status: 'normal' },
  { id: 8, name: 'คุณbms developer', age: null, gender: null, lastDate: '18/03/2569', status: 'abnormal' },
  { id: 9, name: 'พลฯทหารอากาศSigma_OW ทดสอบระบบ', age: 23, gender: 'ชาย', lastDate: '18/03/2569', status: 'abnormal' },
  { id: 10, name: 'นายชนะพล เกษมทรง', age: 20, gender: 'ชาย', lastDate: '18/03/2569', status: 'abnormal' },
];

export const ABNORMAL_CASES = [
  { id: 1, name: 'น.ส.ธาตุทอง สีดา', age: 65, condition: 'ความดันโลหิต', value: '150/77', unit: 'mmHg', tag: 'ความดันโลหิตสูง', lat: 13.72, lng: 100.52 },
  { id: 2, name: 'นายบุญมี ปิระนันท์', age: 46, condition: 'อัตราการเต้นหัวใจ', value: '103', unit: 'bpm', tag: 'หัวใจเต้นเร็ว', lat: 13.68, lng: 100.55 },
  { id: 3, name: 'นายบุญมี ปิระนันท์', age: 46, condition: 'ความดันโลหิต', value: '124/94', unit: 'mmHg', tag: 'ความดันโลหิตสูง', lat: 13.68, lng: 100.55 },
  { id: 4, name: 'พลฯทหารอากาศSigma_OW ทดสอบระบบ', age: 23, condition: 'อุณหภูมิ', value: '38.00', unit: '°C', tag: 'มีไข้', lat: 13.75, lng: 100.48 },
];

export const HOME_VISIT_STATS = {
  total: 397,
  notVisited: 39,
  visited: 264,
  pending: 94,
};

export const HOME_VISIT_PATIENTS = [
  { id: 1, name: 'สำรวม ตั้งประเสริฐสกุล', age: 78, gender: 'หญิง', disease: 'โรคหลอดเลือดสมอง (Stroke)', regDate: '20 มี.ค. 2569', registrar: 'กก.ฐิตีมา วิมมะญาณ', hospital: 'โรงพยาบาลบางไทร', status: 'pending' },
  { id: 2, name: 'เล็ก ทดสอบ1', age: 24, gender: 'หญิง', disease: 'ความดันโลหิตสูง', regDate: '20 มี.ค. 2569', registrar: 'พัสสน แซ่โจง doc. name', hospital: 'โรงพยาบาลทดสอบ BMS', status: 'pending' },
  { id: 3, name: 'ฐาถูร ทดสอบ', age: 36, gender: 'ชาย', disease: 'COPD กำเริบเฉียบพลัน', regDate: '20 มี.ค. 2569', registrar: 'พัสสน แซ่โจง doc. name', hospital: 'โรงพยาบาลทดสอบ BMS', status: 'pending' },
  { id: 4, name: 'เล็ก ทดสอบ1', age: 24, gender: 'หญิง', disease: 'ความดันโลหิตสูง', regDate: '20 มี.ค. 2569', registrar: 'พัสสน แซ่โจง doc. name', hospital: 'โรงพยาบาลทดสอบ BMS', status: 'pending' },
  { id: 5, name: 'Sigma_OW ทดสอบระบบ', age: 23, gender: 'ชาย', disease: 'ความดันโลหิตสูง', regDate: '19 มี.ค. 2569', registrar: 'ธนัช กลุ่มณยวิจณ์', hospital: 'โรงพยาบาลทดสอบ BMS', status: 'pending' },
  { id: 6, name: 'สมชัย หงษ์ทอง', age: 68, gender: 'ชาย', disease: 'แผลกดทับ (Pressure Ulcer)', regDate: '19 มี.ค. 2569', registrar: 'น.ส.นิศรา แสงอรุณ', hospital: 'โรงพยาบาลกระทุ่มแบน', status: 'visited' },
  { id: 7, name: 'ธาตุทอง สีดา', age: 65, gender: 'หญิง', disease: 'IMC Stroke', regDate: '19 มี.ค. 2569', registrar: 'น.ส.วราทิพย์ บุญรักษา', hospital: 'โรงพยาบาลสกลนคร', status: 'visited' },
  { id: 8, name: 'ประทัย แดงฐูม', age: 73, gender: 'หญิง', disease: 'IMC Stroke', regDate: '19 มี.ค. 2569', registrar: 'น.ส.วราทิพย์ บุญรักษา', hospital: 'โรงพยาบาลสกลนคร', status: 'visited' },
  { id: 9, name: 'อารณ์ คำศรี', age: 80, gender: 'หญิง', disease: 'ผู้สูงอายุ/ผู้พิการติดบ้าน/ติดเตียง', regDate: '19 มี.ค. 2569', registrar: 'น.ส.วราทิพย์ บุญรักษา', hospital: 'โรงพยาบาลสกลนคร', status: 'visited' },
];

export const PATIENT_DETAIL = {
  hn: '0017612',
  name: 'สำรวม ตั้งประเสริฐสกุล',
  age: 78,
  gender: 'หญิง',
  dob: '-',
  bloodType: '-',
  phone: '-',
  allergies: '-',
  conditions: '-',
  address: '-',
  emergencyContact: '-',
  avatar: null,
  vitalsign: {
    bloodPressure: { systolic: 150, diastolic: 77, status: 'abnormal' },
    oxygenSaturation: { value: null, status: 'normal' },
    temperature: { value: null, status: 'normal' },
    bloodSugar: { value: null, status: 'normal' },
    heartRate: { value: null, status: 'normal' },
    weight: { value: null },
    height: { value: null },
    waist: { value: null },
  },
  vitalsignHistory: [
    { date: '20/03/69', bp: '150/77', o2: '-', temp: '-', sugar: '-', hr: '-' },
    { date: '19/03/69', bp: '148/75', o2: '98%', temp: '36.5', sugar: '110', hr: '72' },
    { date: '18/03/69', bp: '145/80', o2: '97%', temp: '36.8', sugar: '105', hr: '75' },
    { date: '17/03/69', bp: '155/82', o2: '96%', temp: '36.4', sugar: '115', hr: '78' },
    { date: '16/03/69', bp: '142/78', o2: '98%', temp: '36.6', sugar: '108', hr: '70' },
    { date: '15/03/69', bp: '152/80', o2: '97%', temp: '36.7', sugar: '112', hr: '74' },
    { date: '14/03/69', bp: '148/79', o2: '98%', temp: '36.5', sugar: '106', hr: '72' },
  ],
  vitalsignTrend: [
    { day: '14/03', systolic: 148, diastolic: 79, hr: 72, temp: 36.5, o2: 98 },
    { day: '15/03', systolic: 152, diastolic: 80, hr: 74, temp: 36.7, o2: 97 },
    { day: '16/03', systolic: 142, diastolic: 78, hr: 70, temp: 36.6, o2: 98 },
    { day: '17/03', systolic: 155, diastolic: 82, hr: 78, temp: 36.4, o2: 96 },
    { day: '18/03', systolic: 145, diastolic: 80, hr: 75, temp: 36.8, o2: 97 },
    { day: '19/03', systolic: 148, diastolic: 75, hr: 72, temp: 36.5, o2: 98 },
    { day: '20/03', systolic: 150, diastolic: 77, hr: null, temp: null, o2: null },
  ],
  homeVisits: [
    {
      id: 1,
      date: '20 มีนาคม 2569 - 09:00 น.',
      type: 'เยี่ยมฉุกเฉิน',
      visitor: 'กก.ฐิตีมา วิมมะญาณ',
      hn: '0017612',
      objectives: 'ประเมินการเคลื่อนไหวและภาวะติดเตียง,แนะนำกายภาพพื้นฐาน,ประเมินภาวะซึมเศร้า และแนะนำคลายเครียด',
      medicalInfo: 'Transient cerebral ischaemic attack (TIA) + ความดันสูง (HT) + ไขมันในเลือดสูง (DLP) หญิง 78 ปี',
      reason: 'ติดตามอาการเพื่อป้องกัน ecurrent stroke',
      healthProblems: '',
      socialData: { members: null, income: null, welfare: null, mentalHealth: null, environment: null },
      screening: { bp: '150/77', o2: '-', temp: '-', sugar: '-', hr: '-', weight: '-', height: '-', waist: '-' },
      notes: { visit: 'ผู้ป่วย', symptoms: '-', nursing: '-', advice: '-', evaluation: '-' },
      assessments: [{ name: 'แบบประเมินการควบคุมโรคหืด', done: true }],
    },
  ],
  assessments: [
    { id: 1, name: 'แบบประเมินการควบคุมโรคหืด', date: '10 สิงหาคม 2568', assessor: 'นายทดลอง ทดสอบ', status: 'done', score: 25, summary: 'ควบคุมโรคหืดสมบูรณ์ใน 4 ส. ที่ผ่านมา' },
    { id: 2, name: 'แบบประเกณฑ์การให้คะแนนภาวะหายใจลำบาก', date: '10 สิงหาคม 2568', assessor: 'นายทดลอง ทดสอบ', status: 'done', score: null, summary: null },
    { id: 3, name: 'แบบประเมิน Barthel Index score', date: '10 กรกฎาคม 2568', assessor: 'นายทดลอง ทดสอบ', status: 'done', score: null, summary: null },
    { id: 4, name: 'แบบประเมินกิจวัตรประจำวัน ADL', date: '10 กรกฎาคม 2568', assessor: 'นายทดลอง ทดสอบ', status: 'done', score: null, summary: null },
    { id: 5, name: 'แบบคัดกรองภาวะเสี่ยงสำหรับผู้ที่มีอายุ 35 ปีขึ้นไป', date: '10 กรกฎาคม 2568', assessor: '-', status: 'not_done', score: null, summary: null },
  ],
  medications: [
    {
      vn: '00000000',
      serviceDate: '1 มกราคม 2568',
      sentDate: '1 มกราคม 2568',
      sender: 'เจ้าหน้าที่ทดลอง ทดสอบ',
      drugs: [
        { name: 'magnesium oxide 140 mg', dosage: 'รับประทานครั้งละ 1 เม็ด', total: 10, schedule: ['เช้า', 'กลางวัน', 'เย็น', 'ก่อนนอน'] },
        { name: 'SALBUTAMOL 2 mg.', dosage: 'รับประทานครั้งละ 1 ซีซี', total: 7, schedule: ['เช้า', 'กลางวัน', 'เย็น'] },
        { name: 'PERPHENAZINE 8 mg.', dosage: 'รับประทานครั้งละ 1 เม็ด', total: 5, schedule: ['เช้า', 'เย็น'] },
      ],
    },
  ],
  medicationTracking: {
    '2568-01-01': {
      'magnesium oxide 140 mg': { morning: true, noon: true, evening: false, night: true },
      'SALBUTAMOL 2 mg.': { morning: true, noon: false, evening: true, night: null },
    },
    '2568-01-02': {
      'magnesium oxide 140 mg': { morning: false, noon: false, evening: false, night: false },
      'SALBUTAMOL 2 mg.': { morning: false, noon: false, evening: false, night: null },
    },
  },
};

/* ═══════════════════════════════════════════
   HOSPITAL-LEVEL DATA (มุมมองโรงพยาบาล)
   ═══════════════════════════════════════════ */
export const HOSPITAL_INFO = {
  name: 'โรงพยาบาลสกลนคร',
  code: '10670',
  province: 'สกลนคร',
  region: 'northeast',
  lat: 17.1545,
  lng: 104.1348,
};

export const HOSPITAL_STATS = {
  totalPatients: 132,
  totalVisits: 132,
  totalVitalSigns: 311,
  abnormalVitalSigns: 28,
  growthPatients: 15.2,
  growthVisits: 22.8,
  growthVitalSigns: 18.5,
  growthAbnormal: -5.3,
};

export const HOSPITAL_USAGE_CHART = {
  daily: [
    { label: '18 มี.ค.', vitalsign: 28, visit: 8 },
    { label: '19 มี.ค.', vitalsign: 35, visit: 12 },
    { label: '20 มี.ค.', vitalsign: 22, visit: 15 },
    { label: '21 มี.ค.', vitalsign: 40, visit: 10 },
    { label: '22 มี.ค.', vitalsign: 30, visit: 14 },
  ],
  weekly: [
    { label: 'สัปดาห์ 1', vitalsign: 85, visit: 32 },
    { label: 'สัปดาห์ 2', vitalsign: 102, visit: 40 },
    { label: 'สัปดาห์ 3', vitalsign: 78, visit: 35 },
    { label: 'สัปดาห์ 4', vitalsign: 115, visit: 48 },
  ],
  monthly: [
    { label: 'ม.ค.', vitalsign: 220, visit: 95 },
    { label: 'ก.พ.', vitalsign: 280, visit: 110 },
    { label: 'มี.ค.', vitalsign: 311, visit: 132 },
  ],
};

export const HOSPITAL_DISEASE_GROUPS = [
  { name: 'ความดันโลหิตสูง', count: 38, percentage: 28.8, color: '#818cf8' },
  { name: 'IMC Stroke', count: 22, percentage: 16.7, color: '#34d399' },
  { name: 'เบาหวาน', count: 18, percentage: 13.6, color: '#f472b6' },
  { name: 'ผู้สูงอายุ/ติดบ้าน/ติดเตียง', count: 15, percentage: 11.4, color: '#fbbf24' },
  { name: 'โรคหลอดเลือดสมอง', count: 12, percentage: 9.1, color: '#fb923c' },
  { name: 'COPD', count: 8, percentage: 6.1, color: '#a78bfa' },
  { name: 'อื่นๆ', count: 19, percentage: 14.4, color: '#94a3b8' },
];

export const HOSPITAL_CRITICAL_CASES = [
  { id: 1, name: 'น.ส.ธาตุทอง สีดา', condition: 'BP Diastolic: 36.8', hospital: 'โรงพยาบาลสกลนคร', severity: 'critical', time: '2 นาที' },
  { id: 2, name: 'นายประทัย แดงฐูม', condition: 'HR: 115 bpm', hospital: 'โรงพยาบาลสกลนคร', severity: 'critical', time: '5 นาที' },
  { id: 3, name: 'นางอารณ์ คำศรี', condition: 'Temp: 38.5°C', hospital: 'โรงพยาบาลสกลนคร', severity: 'warning', time: '12 นาที' },
];

export const HOSPITAL_PATIENTS_MAP = [
  { name: 'น.ส.ธาตุทอง สีดา', lat: 17.18, lng: 104.12, status: 'visited', disease: 'IMC Stroke' },
  { name: 'นายประทัย แดงฐูม', lat: 17.15, lng: 104.15, status: 'pending', disease: 'ความดันโลหิตสูง' },
  { name: 'นางอารณ์ คำศรี', lat: 17.12, lng: 104.10, status: 'visited', disease: 'ผู้สูงอายุ/ติดบ้าน' },
  { name: 'นายสมชัย หงษ์ทอง', lat: 17.20, lng: 104.08, status: 'notVisited', disease: 'แผลกดทับ' },
  { name: 'นางสาวมณี แก้วใส', lat: 17.10, lng: 104.18, status: 'visited', disease: 'เบาหวาน' },
  { name: 'นายวิชัย ดีงาม', lat: 17.22, lng: 104.14, status: 'visited', disease: 'ความดันโลหิตสูง' },
  { name: 'นางบัวทอง สุขสันต์', lat: 17.08, lng: 104.06, status: 'pending', disease: 'COPD' },
  { name: 'นายธนา พิมพ์ดี', lat: 17.16, lng: 104.20, status: 'visited', disease: 'IMC Stroke' },
  { name: 'นางแสงเดือน รุ่งเรือง', lat: 17.25, lng: 104.12, status: 'notVisited', disease: 'เบาหวาน' },
  { name: 'นายสุรเดช บุญมี', lat: 17.14, lng: 104.05, status: 'visited', disease: 'ความดันโลหิตสูง' },
];

/* ═══ VITAL SIGN ANALYTICS ═══ */
export const VS_BY_TYPE = [
  { type: 'ความดันโลหิต', icon: '💓', total: 193, normal: 158, abnormal: 35, color: '#D63031' },
  { type: 'ชีพจร', icon: '💗', total: 180, normal: 168, abnormal: 12, color: '#6C5CE7' },
  { type: 'อุณหภูมิ', icon: '🌡️', total: 175, normal: 170, abnormal: 5, color: '#E17055' },
  { type: 'ออกซิเจน', icon: '🫁', total: 165, normal: 160, abnormal: 5, color: '#0984E3' },
  { type: 'น้ำตาล', icon: '🩸', total: 120, normal: 102, abnormal: 18, color: '#00B894' },
];

export const VS_DAILY_TREND = [
  { date: '17 มี.ค.', total: 32, abnormal: 5 },
  { date: '18 มี.ค.', total: 45, abnormal: 8 },
  { date: '19 มี.ค.', total: 38, abnormal: 4 },
  { date: '20 มี.ค.', total: 52, abnormal: 12 },
  { date: '21 มี.ค.', total: 28, abnormal: 3 },
  { date: '22 มี.ค.', total: 48, abnormal: 7 },
  { date: '23 มี.ค.', total: 41, abnormal: 6 },
];

export const VS_SEVERITY = {
  critical: 8,
  warning: 20,
  normal: 165,
};

export const HOSPITAL_ABNORMAL_CASES = [
  { id: 1, name: 'น.ส.ธาตุทอง สีดา', age: 65, condition: 'ความดันโลหิต', value: '150/77', unit: 'mmHg', tag: 'ความดันโลหิตสูง', lat: 17.18, lng: 104.12 },
  { id: 2, name: 'นายประทัย แดงฐูม', age: 73, condition: 'อัตราการเต้นหัวใจ', value: '115', unit: 'bpm', tag: 'หัวใจเต้นเร็ว', lat: 17.15, lng: 104.15 },
  { id: 3, name: 'นางแสงเดือน รุ่งเรือง', age: 68, condition: 'อุณหภูมิ', value: '38.5', unit: '°C', tag: 'มีไข้', lat: 17.25, lng: 104.12 },
];
