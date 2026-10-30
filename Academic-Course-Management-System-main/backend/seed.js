const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/Course');

const makeCourse = (code, title, sem, credits, hours, emoji, diff, funny, branch, dept, program) => ({
  courseCode: code, courseTitle: title, semester: sem,
  program: program || `B.Tech ${dept || 'Computer Science'}`,
  department: dept || 'Computer Science & Engineering',
  branch: branch || 'CS',
  credits, hours, emoji, difficulty: diff, funny_description: funny,
  courseObjectives: [
    `Understand foundational concepts of ${title}.`,
    `Apply techniques of ${title} to real-world problems.`,
    `Evaluate and design solutions using ${title}.`
  ],
  courseOutcomes: [
    { coId: 'CO1', description: `Recall and explain key concepts of ${title}.`, bloomLevel: 'Remember' },
    { coId: 'CO2', description: `Apply core methods of ${title} in problem-solving.`, bloomLevel: 'Apply' },
    { coId: 'CO3', description: `Analyze and evaluate ${title} scenarios.`, bloomLevel: 'Analyze' },
    { coId: 'CO4', description: `Design solutions integrating ${title} principles.`, bloomLevel: 'Create' }
  ],
  coPoMapping: [
    { coId: 'CO1', mappings: { PO1:3,PO2:2,PO3:1,PO4:0,PO5:0,PO6:0,PO7:0,PO8:0,PO9:0,PO10:0,PO11:0,PO12:1,PSO1:2,PSO2:1 } },
    { coId: 'CO2', mappings: { PO1:2,PO2:3,PO3:2,PO4:1,PO5:0,PO6:0,PO7:0,PO8:0,PO9:0,PO10:0,PO11:0,PO12:1,PSO1:3,PSO2:2 } },
    { coId: 'CO3', mappings: { PO1:2,PO2:2,PO3:3,PO4:2,PO5:1,PO6:0,PO7:0,PO8:0,PO9:0,PO10:0,PO11:1,PO12:2,PSO1:2,PSO2:3 } },
    { coId: 'CO4', mappings: { PO1:1,PO2:2,PO3:3,PO4:3,PO5:2,PO6:1,PO7:0,PO8:0,PO9:1,PO10:1,PO11:2,PO12:2,PSO1:2,PSO2:3 } }
  ],
  units: [
    { title: `Introduction to ${title}`, hours: Math.ceil(hours*0.2), content: ['Basic Concepts','History & Evolution','Core Principles','Terminology'] },
    { title: 'Core Techniques', hours: Math.ceil(hours*0.25), content: ['Fundamental Methods','Implementation Strategies','Algorithms','Tools'] },
    { title: 'Advanced Topics', hours: Math.ceil(hours*0.25), content: ['Advanced Concepts','Case Studies','Performance Analysis','Optimization'] },
    { title: 'Applications & Projects', hours: Math.ceil(hours*0.15), content: ['Real-World Applications','Mini Projects','Problem Solving'] },
    { title: 'Emerging Trends', hours: Math.ceil(hours*0.15), content: ['Current Research','Industry Practices','Future Directions'] }
  ],
  lessonPlan: [
    { weekNo:1, lectureNo:'L1-L2', topics:`Introduction to ${title}`, cosMapped:['CO1'], teachingMethod:'Lecture', durationHours:2 },
    { weekNo:2, lectureNo:'L3-L4', topics:'Core Concepts & Fundamentals', cosMapped:['CO1','CO2'], teachingMethod:'Lecture + Demo', durationHours:2 },
    { weekNo:3, lectureNo:'L5-L6', topics:'Implementation Techniques', cosMapped:['CO2'], teachingMethod:'Lab Session', durationHours:3 },
    { weekNo:4, lectureNo:'L7-L8', topics:'Problem Solving Workshop', cosMapped:['CO2','CO3'], teachingMethod:'Workshop', durationHours:2 },
    { weekNo:5, lectureNo:'L9', topics:'CIE 1 Revision', cosMapped:['CO1','CO2'], teachingMethod:'Revision', durationHours:1 },
    { weekNo:6, lectureNo:'L10-L11', topics:'Advanced Topics Part I', cosMapped:['CO3'], teachingMethod:'Lecture', durationHours:2 },
    { weekNo:7, lectureNo:'L12-L13', topics:'Advanced Topics Part II', cosMapped:['CO3','CO4'], teachingMethod:'Flipped Classroom', durationHours:2 },
    { weekNo:8, lectureNo:'L14-L15', topics:'Design & Build Lab', cosMapped:['CO4'], teachingMethod:'Lab Session', durationHours:3 },
  ],
  textbooks: [
    { title: `Fundamentals of ${title}`, author: 'John D. Smith', publisher: 'Pearson Education', year: '2022' },
  ],
  references: [
    { title: `Advanced ${title}`, author: 'Jane M. Lee', publisher: 'Wiley', year: '2020' },
  ],
  assessment: [
    { type: 'CIE 1', marks: 20, description: '1st Continuous Internal Evaluation' },
    { type: 'CIE 2', marks: 20, description: '2nd Continuous Internal Evaluation' },
    { type: 'SEE', marks: 60, description: 'Semester End Examination' }
  ],
  attainmentTargets: '80% of students scoring > 60%',
  gradingScheme: '91 and above: O; 81-90: A+; 71-80: A; 61-70: B+; 51-60: B; 40-50: C; below 40: D'
});

const subjects = [
  // ═══════════════════════════════════════
  // CS — Computer Science & Engineering
  // ═══════════════════════════════════════
  // Sem 1
  makeCourse('UE24MA101','Mathematics I',1,4,60,'📐','Hard','Numbers attacking from all directions.','CS','Computer Science & Engineering'),
  makeCourse('UE24PH101','Engineering Physics',1,4,60,'⚡','Medium','Schrodinger grades: passed and failed until checked.','CS','Computer Science & Engineering'),
  makeCourse('UE24CS101','Programming in C',1,4,60,'💻','Easy','Segmentation fault (core dumped).','CS','Computer Science & Engineering'),
  makeCourse('UE24ME101','Engineering Graphics',1,3,45,'✏️','Nightmare','Draw circles until graduation.','CS','Computer Science & Engineering'),
  // Sem 2
  makeCourse('UE24MA102','Mathematics II',2,4,60,'🧮','Hard','Return of the numbers.','CS','Computer Science & Engineering'),
  makeCourse('UE24CS102','Data Structures',2,4,60,'🌳','Nightmare','Linked lists linked to depression.','CS','Computer Science & Engineering'),
  makeCourse('UE24EC101','Digital Electronics',2,3,45,'🔌','Medium','0s and 1s ruling your life.','CS','Computer Science & Engineering'),
  makeCourse('UE24CV101','Environmental Studies',2,2,30,'🌍','Easy','The only chill subject.','CS','Computer Science & Engineering'),
  // Sem 3
  makeCourse('UE24CS201','Computer Organization',3,4,60,'🏗️','Medium','Inside the machine chaos.','CS','Computer Science & Engineering'),
  makeCourse('UE24CS202','OOPs with Java',3,4,60,'☕','Medium','Write once, debug everywhere.','CS','Computer Science & Engineering'),
  makeCourse('UE24CS203','Operating Systems',3,4,60,'🖥️','Hard','The reason your laptop screams.','CS','Computer Science & Engineering'),
  makeCourse('UE24CS204','Software Engineering',3,3,45,'📝','Easy','Planning things you will never build.','CS','Computer Science & Engineering'),
  // Sem 4
  makeCourse('UE24CS2404','Unstructured Data & NoSQL',4,4,60,'🍃','Easy','Tables were too mainstream.','CS','Computer Science & Engineering'),
  makeCourse('UE24CS205','Database Management Systems',4,4,60,'🗄️','Medium','Joins easier than relationships.','CS','Computer Science & Engineering'),
  makeCourse('UE24CS206','Computer Networks',4,4,60,'🌐','Medium','Ping me maybe.','CS','Computer Science & Engineering'),
  makeCourse('UE24CS207','Design & Analysis of Algorithms',4,4,60,'⏱️','Nightmare','O(n²) tears per lecture.','CS','Computer Science & Engineering'),
  // Sem 5
  makeCourse('UE24CS301','Artificial Intelligence',5,4,60,'🤖','Hard','Teaching machines to replace us.','CS','Computer Science & Engineering'),
  makeCourse('UE24CS302','Machine Learning',5,4,60,'📊','Hard','Statistics with extra steps.','CS','Computer Science & Engineering'),
  makeCourse('UE24CS303','Compiler Design',5,4,60,'⚙️','Nightmare','Errors you never knew existed.','CS','Computer Science & Engineering'),
  makeCourse('UE24CS304','Cloud Computing',5,3,45,'☁️','Medium','Somebody else\'s computer problems.','CS','Computer Science & Engineering'),
  // Sem 6
  makeCourse('UE24CS306','Big Data Analytics',6,4,60,'📈','Hard','So much data, so little understanding.','CS','Computer Science & Engineering'),
  makeCourse('UE24CS307','Deep Learning',6,4,60,'🧠','Nightmare','Black box of confusion.','CS','Computer Science & Engineering'),
  makeCourse('UE24CS308','Internet of Things',6,3,45,'📱','Medium','Everything online including toothbrush.','CS','Computer Science & Engineering'),
  // Sem 7
  makeCourse('UE24CS401','Major Project Phase 1',7,6,90,'🏗️','Medium','Ctrl+C from GitHub Phase 1.','CS','Computer Science & Engineering'),
  makeCourse('UE24CS402','Internship',7,2,30,'💼','Easy','Free labor with certificate.','CS','Computer Science & Engineering'),
  // Sem 8
  makeCourse('UE24CS406','Major Project Phase 2',8,8,120,'🚀','Hard','Ctrl+C from GitHub Phase 2.','CS','Computer Science & Engineering'),
  makeCourse('UE24CS407','Seminar',8,2,30,'🗣️','Medium','Pretend to know your research.','CS','Computer Science & Engineering'),

  // ═══════════════════════════════════════
  // IS — Information Science & Engineering
  // ═══════════════════════════════════════
  makeCourse('UE24IS101','Programming in Python',1,4,60,'🐍','Easy','Indentation is the real enemy.','IS','Information Science & Engineering'),
  makeCourse('UE24IS102','Discrete Mathematics',1,4,60,'🔢','Hard','Logic gates to existential crisis.','IS','Information Science & Engineering'),
  makeCourse('UE24IS201','Data Structures with Python',2,4,60,'🌳','Hard','Recursion: see Recursion.','IS','Information Science & Engineering'),
  makeCourse('UE24IS202','Digital System Design',2,3,45,'💡','Medium','Flip-flops that dont wear.','IS','Information Science & Engineering'),
  makeCourse('UE24IS301','Database Systems',3,4,60,'🗄️','Medium','SELECT * FROM happiness WHERE found=0.','IS','Information Science & Engineering'),
  makeCourse('UE24IS302','Web Technologies',3,4,60,'🕸️','Easy','CSS: it works on my machine.','IS','Information Science & Engineering'),
  makeCourse('UE24IS303','Computer Networks',3,4,60,'🌐','Medium','Packet loss like my motivation.','IS','Information Science & Engineering'),
  makeCourse('UE24IS304','Operating Systems',3,4,60,'🖥️','Hard','Deadlocks in code and life.','IS','Information Science & Engineering'),
  makeCourse('UE24IS401','Software Testing',4,4,60,'🧪','Medium','Finding bugs is the easy part.','IS','Information Science & Engineering'),
  makeCourse('UE24IS402','Cloud Computing',4,3,45,'☁️','Medium','Pay per confusion.','IS','Information Science & Engineering'),
  makeCourse('UE24IS403','Data Mining',4,4,60,'⛏️','Hard','Digging for patterns in chaos.','IS','Information Science & Engineering'),
  makeCourse('UE24IS501','Machine Learning',5,4,60,'📊','Hard','Gradient descent into madness.','IS','Information Science & Engineering'),
  makeCourse('UE24IS502','Information Security',5,4,60,'🔐','Medium','Hack the planet, ethically.','IS','Information Science & Engineering'),
  makeCourse('UE24IS503','Big Data Analytics',5,3,45,'📈','Hard','MapReduce your stress.','IS','Information Science & Engineering'),
  makeCourse('UE24IS601','Natural Language Processing',6,4,60,'🗣️','Hard','Teaching computers sarcasm.','IS','Information Science & Engineering'),
  makeCourse('UE24IS602','DevOps Engineering',6,3,45,'♾️','Medium','CI/CD your sleep schedule.','IS','Information Science & Engineering'),
  makeCourse('UE24IS701','Major Project Phase 1',7,6,90,'🏗️','Medium','Stack Overflow driven development.','IS','Information Science & Engineering'),
  makeCourse('UE24IS801','Major Project Phase 2',8,8,120,'🚀','Hard','Demo day survival guide.','IS','Information Science & Engineering'),

  // ═══════════════════════════════════════
  // EC — Electronics & Communication Engg
  // ═══════════════════════════════════════
  makeCourse('UE24EC111','Circuit Theory',1,4,60,'⚡','Hard','KVL, KCL, and tears.','EC','Electronics & Communication Engineering'),
  makeCourse('UE24EC112','Electronic Devices',1,4,60,'🔌','Medium','Diodes deciding your fate.','EC','Electronics & Communication Engineering'),
  makeCourse('UE24EC211','Analog Electronics',2,4,60,'📻','Hard','Op-Amps have more gain than you.','EC','Electronics & Communication Engineering'),
  makeCourse('UE24EC212','Signals & Systems',2,4,60,'📡','Nightmare','Fourier transforms your happiness.','EC','Electronics & Communication Engineering'),
  makeCourse('UE24EC311','Digital Signal Processing',3,4,60,'📊','Hard','Sampling your patience.','EC','Electronics & Communication Engineering'),
  makeCourse('UE24EC312','Microprocessors',3,4,60,'🔧','Medium','Assembly language, assemble your life.','EC','Electronics & Communication Engineering'),
  makeCourse('UE24EC313','Electromagnetic Theory',3,4,60,'🧲','Nightmare','Maxwell equations maximizing pain.','EC','Electronics & Communication Engineering'),
  makeCourse('UE24EC314','Communication Systems',3,3,45,'📶','Medium','Modulation of your grades.','EC','Electronics & Communication Engineering'),
  makeCourse('UE24EC411','VLSI Design',4,4,60,'🔬','Hard','Nano-scale problems, macro-scale stress.','EC','Electronics & Communication Engineering'),
  makeCourse('UE24EC412','Control Systems',4,4,60,'🎛️','Hard','Feedback loop of confusion.','EC','Electronics & Communication Engineering'),
  makeCourse('UE24EC413','Antenna & Wave Propagation',4,3,45,'📡','Medium','Radiation patterns like exam patterns.','EC','Electronics & Communication Engineering'),
  makeCourse('UE24EC511','Embedded Systems',5,4,60,'🤖','Medium','Arduino is just the beginning.','EC','Electronics & Communication Engineering'),
  makeCourse('UE24EC512','Optical Communication',5,3,45,'💡','Medium','Light-speed learning required.','EC','Electronics & Communication Engineering'),
  makeCourse('UE24EC513','Digital Communication',5,4,60,'📱','Hard','Bit errors in life too.','EC','Electronics & Communication Engineering'),
  makeCourse('UE24EC611','Wireless Communication',6,4,60,'📶','Medium','No signal, no problem.','EC','Electronics & Communication Engineering'),
  makeCourse('UE24EC612','IoT & Sensor Networks',6,3,45,'📱','Easy','Sensors sensing your stress.','EC','Electronics & Communication Engineering'),
  makeCourse('UE24EC701','Major Project Phase 1',7,6,90,'🏗️','Medium','Soldering your dreams together.','EC','Electronics & Communication Engineering'),
  makeCourse('UE24EC801','Major Project Phase 2',8,8,120,'🚀','Hard','Final PCB of your degree.','EC','Electronics & Communication Engineering'),

  // ═══════════════════════════════════════
  // EEE — Electrical & Electronics Engg
  // ═══════════════════════════════════════
  makeCourse('UE24EE111','Electrical Circuit Analysis',1,4,60,'⚡','Hard','Current problems require current solutions.','EEE','Electrical & Electronics Engineering'),
  makeCourse('UE24EE112','Engineering Mathematics',1,4,60,'📐','Hard','Laplace wont transform your grades.','EEE','Electrical & Electronics Engineering'),
  makeCourse('UE24EE211','Electrical Machines I',2,4,60,'⚙️','Hard','Motors running but you are not.','EEE','Electrical & Electronics Engineering'),
  makeCourse('UE24EE212','Network Analysis',2,4,60,'🔌','Medium','Mesh analysis of your problems.','EEE','Electrical & Electronics Engineering'),
  makeCourse('UE24EE311','Power Systems I',3,4,60,'🏭','Hard','Generating more stress than power.','EEE','Electrical & Electronics Engineering'),
  makeCourse('UE24EE312','Electrical Machines II',3,4,60,'⚙️','Hard','Transformers: more than meets the eye.','EEE','Electrical & Electronics Engineering'),
  makeCourse('UE24EE313','Analog Electronics',3,3,45,'📻','Medium','BJT or FET, both are threats.','EEE','Electrical & Electronics Engineering'),
  makeCourse('UE24EE314','Measurements & Instrumentation',3,3,45,'📏','Medium','Measuring your dropping GPA.','EEE','Electrical & Electronics Engineering'),
  makeCourse('UE24EE411','Power Electronics',4,4,60,'⚡','Hard','Switching between hope and despair.','EEE','Electrical & Electronics Engineering'),
  makeCourse('UE24EE412','Control Systems',4,4,60,'🎛️','Nightmare','Unstable like your semester.','EEE','Electrical & Electronics Engineering'),
  makeCourse('UE24EE413','Digital Signal Processing',4,3,45,'📊','Medium','Filtering out your free time.','EEE','Electrical & Electronics Engineering'),
  makeCourse('UE24EE511','Power Systems II',5,4,60,'🏭','Hard','Load flow like workload flow.','EEE','Electrical & Electronics Engineering'),
  makeCourse('UE24EE512','Renewable Energy Systems',5,3,45,'☀️','Medium','Solar powered procrastination.','EEE','Electrical & Electronics Engineering'),
  makeCourse('UE24EE513','Microcontrollers',5,4,60,'🔧','Medium','Programming hardware nightmares.','EEE','Electrical & Electronics Engineering'),
  makeCourse('UE24EE611','High Voltage Engineering',6,4,60,'⚡','Nightmare','Shocking content guaranteed.','EEE','Electrical & Electronics Engineering'),
  makeCourse('UE24EE612','Electric Drives',6,3,45,'🚗','Medium','Driving you crazy since sem 6.','EEE','Electrical & Electronics Engineering'),
  makeCourse('UE24EE701','Major Project Phase 1',7,6,90,'🏗️','Medium','Wiring your dreams together.','EEE','Electrical & Electronics Engineering'),
  makeCourse('UE24EE801','Major Project Phase 2',8,8,120,'🚀','Hard','Final circuit of your degree.','EEE','Electrical & Electronics Engineering'),
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await Course.deleteMany({});
    const result = await Course.insertMany(subjects);
    console.log(`Seeded ${result.length} courses across CS, IS, EC, EEE branches!`);
    process.exit();
  })
  .catch(err => { console.error(err); process.exit(1); });
