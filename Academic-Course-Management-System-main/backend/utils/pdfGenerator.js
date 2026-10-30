/**
 * @file pdfGenerator.js
 * @description Highly formatted academic PDF compiler using PDFKit.
 * Uses exact coordinate alignment and manual pagination thresholds to ensure 
 * professional alignment, avoiding blank pages and squashed headers.
 */

const PDFDocument = require('pdfkit');

// --- Visual Color Palette conforming to University Handbook standards ---
const C = {
  navy:   '#1a3557', // Primary heading and background element color
  blue:   '#2563eb', // Subheadings
  accent: '#0ea5e9', // Accents/Decorations
  dark:   '#1e293b', // General body text
  mid:    '#64748b', // Secondary notes & pagination text
  line:   '#cbd5e1', // Borders and dividers
  bg:     '#f0f4f8', // Table header stripes or background panels
  white:  '#ffffff',
};

// --- A4 Dimension Definitions ---
const PW = 595.28;  // Page Width
const PH = 841.89;  // Page Height
const ML = 50;      // Left Margin
const MR = 50;      // Right Margin
const IW = PW - ML - MR; // Inside Width
const TOP = 55;     // Content start Y (leaves room for header band)
const BOT = PH - 45;// Content maximum Y threshold (leaves room for footer band)

exports.generateCoursePdf = (course, res) => {

  // --- Layout State Variables ---
  let y = TOP;
  let pageNum = 0;
  const code = course.courseCode || '';
  const ctitle = (course.courseTitle || '').substring(0, 60);

  // --- Document Initialization ---
  const doc = new PDFDocument({ size: 'A4', autoFirstPage: false, margin: 0 });
  doc.info.Title = course.courseTitle;
  doc.info.Author = 'Academic Course Repository';

  // --- Bind Express HTTP response streams ---
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${code}_Syllabus.pdf"`);
  doc.pipe(res);

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE-BY-PAGE RENDERING UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Generates a new clean page with consistent running header and footer blocks
   */
  function addPage() {
    doc.addPage({ size: 'A4', margin: 0 });
    pageNum++;
    y = TOP;

    // Running Header Bar
    doc.rect(0, 0, PW, 38).fill(C.navy);
    doc.fillColor(C.white).fontSize(8).font('Helvetica-Bold')
       .text(code, ML, 14, { lineBreak: false });
    doc.fillColor(C.white).fontSize(8).font('Helvetica')
       .text(ctitle, ML, 14, { width: IW, align: 'right', lineBreak: false });

    // Running Footer Bar
    doc.rect(0, PH - 38, PW, 38).fill(C.bg);
    doc.moveTo(ML, PH - 38).lineTo(PW - MR, PH - 38)
       .strokeColor(C.line).lineWidth(0.5).stroke();
    doc.fillColor(C.mid).fontSize(8).font('Helvetica')
       .text('B.Tech Computer Science & Engineering', ML, PH - 24, { lineBreak: false });
    doc.fillColor(C.mid).fontSize(8).font('Helvetica')
       .text(`Page ${pageNum}`, ML, PH - 24, { width: IW, align: 'right', lineBreak: false });

    y = TOP;
  }

  /**
   * Paginates automatically if the cursor is near the bottom threshold
   * @param {number} h - Needed vertical space height in points
   */
  function needSpace(h) {
    if (y + h > BOT) addPage();
  }

  function gap(n = 8) { y += n; }

  /**
   * Draws a simple horizontal dividing rule
   */
  function hline(color = C.line, lw = 0.5) {
    doc.moveTo(ML, y).lineTo(PW - MR, y).strokeColor(color).lineWidth(lw).stroke();
    y += 4;
  }

  /**
   * Renders a primary section header with line divider
   */
  function secTitle(text) {
    needSpace(28);
    doc.fillColor(C.navy).fontSize(12).font('Helvetica-Bold')
       .text(text, ML, y, { width: IW, lineBreak: false });
    y += 16;
    hline(C.navy, 1);
    gap(6);
  }

  /**
   * Renders a secondary sub-section header
   */
  function subTitle(text) {
    needSpace(20);
    doc.fillColor(C.blue).fontSize(10).font('Helvetica-Bold')
       .text(text, ML, y, { width: IW, lineBreak: false });
    y += 14;
    gap(4);
  }

  function bodyLine(text) {
    needSpace(14);
    doc.fillColor(C.dark).fontSize(10).font('Helvetica')
       .text(text, ML, y, { width: IW, lineBreak: false });
    y += 14;
  }

  /**
   * Paragraph block estimator that calculates spacing and avoids broken text
   */
  function bodyPara(text, indent = 0) {
    const chars = String(text).length;
    const lines = Math.ceil(chars / 80) || 1;
    const h = lines * 14;
    needSpace(h + 4);
    doc.fillColor(C.dark).fontSize(10).font('Helvetica')
       .text(String(text), ML + indent, y, { width: IW - indent });
    y = doc.y + 4;
  }

  /**
   * Multi-column table helper featuring cell auto-wrapping and zebra striping
   */
  function table(headers, rows, colWidths) {
    const rowH = 20;
    const totalW = colWidths.reduce((a, b) => a + b, 0);

    // Render Table Header Row
    needSpace(rowH + 5);
    doc.rect(ML, y, totalW, rowH).fill(C.navy);
    let cx = ML;
    headers.forEach((h, i) => {
      doc.fillColor(C.white).fontSize(8).font('Helvetica-Bold')
         .text(String(h), cx + 4, y + 6, { width: colWidths[i] - 8, lineBreak: false, ellipsis: true });
      cx += colWidths[i];
    });
    y += rowH;

    // Render Table Data Rows
    rows.forEach((row, ri) => {
      needSpace(rowH + 2);
      const bg = ri % 2 === 0 ? C.white : C.bg;
      doc.rect(ML, y, totalW, rowH).fill(bg);
      doc.rect(ML, y, totalW, rowH).strokeColor(C.line).lineWidth(0.3).stroke();
      cx = ML;
      row.forEach((cell, ci) => {
        doc.fillColor(C.dark).fontSize(8).font('Helvetica')
           .text(String(cell ?? '—'), cx + 4, y + 6, { width: colWidths[ci] - 8, lineBreak: false, ellipsis: true });
        cx += colWidths[ci];
      });
      y += rowH;
    });
    gap(10);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 1: COVER PAGE
  // ═══════════════════════════════════════════════════════════════════════════
  doc.addPage({ size: 'A4', margin: 0 });
  pageNum++;

  // Full-page dark accent background
  doc.rect(0, 0, PW, PH).fill(C.navy);
  doc.rect(0, 0, PW, 8).fill(C.accent);
  doc.save().opacity(0.06).circle(PW - 60, 120, 130).fill(C.white).restore();
  doc.save().opacity(0.04).circle(60, PH - 80, 150).fill(C.white).restore();

  // University Header
  doc.fillColor(C.accent).fontSize(11).font('Helvetica-Bold')
     .text('UNIVERSITY — ACADEMIC COURSE SYLLABUS', 0, 70, { width: PW, align: 'center', lineBreak: false });

  doc.moveTo(PW / 2 - 100, 94).lineTo(PW / 2 + 100, 94)
     .strokeColor(C.accent).lineWidth(1.5).stroke();

  // Large Course Details
  doc.fillColor(C.accent).fontSize(18).font('Helvetica-Bold')
     .text(code, 0, 112, { width: PW, align: 'center', lineBreak: false });

  doc.fillColor(C.white).fontSize(22).font('Helvetica-Bold')
     .text(course.courseTitle || '', ML * 2, 148, { width: PW - ML * 4, align: 'center' });

  // Center Metadata Container Box
  const bx = ML + 60, by = 310, bw = IW - 120, bh = 180;
  doc.save().opacity(0.1).rect(bx, by, bw, bh).fill(C.white).restore();
  doc.rect(bx, by, bw, bh).strokeColor(C.accent).lineWidth(1).stroke();

  const meta = [
    ['Program',    course.program || 'B.Tech Computer Science'],
    ['Department', course.department || 'Computer Science & Engineering'],
    ['Semester',   `Semester ${course.semester}`],
    ['Credits',    `${course.credits}  |  ${course.hours} Hours`],
    ['Difficulty', course.difficulty || 'Medium'],
    ['Assessment', (course.assessment || []).map(a => `${a.type}(${a.marks})`).join('  +  ') || 'CIE + SEE'],
  ];
  meta.forEach(([lbl, val], i) => {
    const ry = by + 18 + i * 25;
    doc.fillColor(C.accent).fontSize(9).font('Helvetica-Bold')
       .text(lbl + ':', bx + 14, ry, { width: 90, lineBreak: false });
    doc.fillColor(C.white).fontSize(9).font('Helvetica')
       .text(val, bx + 108, ry, { width: bw - 120, lineBreak: false });
  });

  // Cover Page Bottom Labels
  doc.fillColor(C.mid).fontSize(8).font('Helvetica')
     .text('Generated by Academic Course Repository System', 0, PH - 50, { width: PW, align: 'center', lineBreak: false });
  doc.fillColor(C.mid).fontSize(8)
     .text(new Date().toLocaleDateString('en-IN', { dateStyle: 'long' }), 0, PH - 36, { width: PW, align: 'center', lineBreak: false });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 2: TABLE OF CONTENTS
  // ═══════════════════════════════════════════════════════════════════════════
  addPage();

  doc.fillColor(C.navy).fontSize(18).font('Helvetica-Bold')
     .text('Table of Contents', ML, y, { width: IW, align: 'center', lineBreak: false });
  y += 22; hline(C.navy, 1); gap(12);

  const tocItems = [
    ['1.', 'Course Overview'],
    ['2.', 'Course Objectives'],
    ['3.', 'Course Outcomes (COs)'],
    ['4.', 'CO-PO Mapping'],
    ['5.', 'Syllabus – Unit-wise Content'],
    ['6.', 'Lesson Plan'],
    ['7.', 'Textbooks & References'],
    ['8.', 'Assessment Scheme'],
    ['9.', 'Grading & Attainment Targets'],
  ];

  tocItems.forEach(([num, label]) => {
    doc.fillColor(C.navy).fontSize(10).font('Helvetica-Bold')
       .text(num, ML, y, { width: 28, lineBreak: false });
    doc.fillColor(C.dark).fontSize(10).font('Helvetica')
       .text(label, ML + 28, y, { width: IW - 28, lineBreak: false });
    y += 22;
    doc.moveTo(ML, y - 4).lineTo(PW - MR, y - 4)
       .strokeColor(C.line).dash(1, { space: 4 }).lineWidth(0.4).stroke().undash();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 3: COURSE OVERVIEW, OBJECTIVES & COs
  // ═══════════════════════════════════════════════════════════════════════════
  addPage();

  secTitle('1.  Course Overview');
  table(
    ['Field', 'Details'],
    [
      ['Course Code', code],
      ['Course Title', course.courseTitle || ''],
      ['Program', course.program || ''],
      ['Department', course.department || 'Computer Science & Engineering'],
      ['Semester', `Semester ${course.semester}`],
      ['Credits', String(course.credits || '')],
      ['Total Hours', String(course.hours || '')],
      ['Difficulty', course.difficulty || 'Medium'],
    ],
    [150, IW - 150]
  );

  secTitle('2.  Course Objectives');
  (course.courseObjectives || []).forEach((obj, i) => {
    bodyPara(`${i + 1}.  ${obj}`, 10);
  });
  gap(8);

  secTitle('3.  Course Outcomes (COs)');
  if ((course.courseOutcomes || []).length) {
    table(
      ['CO ID', 'Description', "Bloom's Level"],
      (course.courseOutcomes || []).map(co => [co.coId, co.description, co.bloomLevel]),
      [55, IW - 130, 75]
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 4: CO-PO MATRIX MAPPING
  // ═══════════════════════════════════════════════════════════════════════════
  addPage();

  secTitle('4.  CO-PO Mapping');
  bodyPara('Mapping Scale:  3 = High  |  2 = Medium  |  1 = Low  |  — = Not Mapped');
  gap(8);

  if ((course.coPoMapping || []).length) {
    const poKeys = ['PO1','PO2','PO3','PO4','PO5','PO6','PO7','PO8','PO9','PO10','PO11','PO12','PSO1','PSO2'];
    const cw = Math.floor((IW - 36) / poKeys.length);
    table(
      ['CO', ...poKeys],
      (course.coPoMapping || []).map(m => [
        m.coId || '',
        ...poKeys.map(k => (m.mappings?.[k] > 0) ? String(m.mappings[k]) : '—')
      ]),
      [36, ...poKeys.map(() => cw)]
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 5: SYLLABUS UNITS
  // ═══════════════════════════════════════════════════════════════════════════
  addPage();
  secTitle('5.  Syllabus – Unit-wise Content');

  (course.units || []).forEach((unit, idx) => {
    needSpace(50);
    subTitle(`Unit ${idx + 1}:  ${unit.title}  (${unit.hours || 0} Hours)`);
    table(
      ['#', 'Topic'],
      (unit.content || []).map((c, i) => [String(i + 1), c]),
      [30, IW - 30]
    );
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 6: LESSON PLAN TABLE
  // ═══════════════════════════════════════════════════════════════════════════
  addPage();
  secTitle('6.  Lesson Plan');

  if ((course.lessonPlan || []).length) {
    table(
      ['Week', 'Lecture', 'Topics Covered', 'COs', 'Method', 'Hrs'],
      (course.lessonPlan || []).map(lp => [
        String(lp.weekNo || ''),
        String(lp.lectureNo || ''),
        String(lp.topics || ''),
        (lp.cosMapped || []).join(', '),
        String(lp.teachingMethod || ''),
        String(lp.durationHours || ''),
      ]),
      [32, 48, IW - 220, 60, 55, 25]
    );
  } else {
    bodyLine('No lesson plan has been configured for this course yet.');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 7: TEXTBOOKS, REFERENCE BOOKS & ASSESSMENT SCHEMES
  // ═══════════════════════════════════════════════════════════════════════════
  addPage();
  secTitle('7.  Textbooks & References');

  subTitle('7.1  Textbooks');
  if ((course.textbooks || []).length) {
    table(
      ['#', 'Title', 'Author(s)', 'Publisher', 'Year'],
      (course.textbooks || []).map((b, i) => [String(i + 1), b.title || '', b.author || '', b.publisher || '', b.year || '']),
      [22, IW - 202, 90, 60, 30]
    );
  } else { bodyLine('No textbooks listed.'); }

  gap(6);
  subTitle('7.2  Reference Books');
  if ((course.references || []).length) {
    table(
      ['#', 'Title', 'Author(s)', 'Publisher', 'Year'],
      (course.references || []).map((b, i) => [String(i + 1), b.title || '', b.author || '', b.publisher || '', b.year || '']),
      [22, IW - 202, 90, 60, 30]
    );
  } else { bodyLine('No reference books listed.'); }

  gap(8);
  secTitle('8.  Assessment Scheme');

  subTitle('8.1  Assessment Weight Distribution');
  const w = course.assessmentWeights || { quiz: 15, test: 25, assignment: 20, see: 40, total: 100 };
  const coDist = course.assessmentCoDistribution || [
    { coId: 'CO1', quiz: 10, test: 0, assignment: 0, see: 8, totalMarks: 18 },
    { coId: 'CO2', quiz: 5, test: 9, assignment: 0, see: 12, totalMarks: 26 },
    { coId: 'CO3', quiz: 0, test: 8, assignment: 0, see: 10, totalMarks: 18 },
    { coId: 'CO4', quiz: 0, test: 8, assignment: 0, see: 6, totalMarks: 14 },
    { coId: 'CO5', quiz: 0, test: 0, assignment: 10, see: 4, totalMarks: 14 },
    { coId: 'CO6', quiz: 0, test: 0, assignment: 10, see: 0, totalMarks: 10 }
  ];
  table(
    ['Weights/COs', 'Quiz', 'Test', 'Assignment', 'SEE', 'Total'],
    [
      ['Weights', String(w.quiz), String(w.test), String(w.assignment), String(w.see), String(w.total)],
      ...coDist.map(co => [co.coId, String(co.quiz||''), String(co.test||''), String(co.assignment||''), String(co.see||''), String(co.totalMarks||'')])
    ],
    [90, 80, 80, 85, 80, 80]
  );

  subTitle('8.2  Schedule of Assessment');
  const schList = course.assessmentSchedule || [
    { assessmentType: 'Quiz-1', date: '5th week', marks: 5, cos: 'CO1', duration: '30 min' },
    { assessmentType: 'Quiz-2', date: '10th week', marks: 5, cos: 'CO2', duration: '30 min' },
    { assessmentType: 'Quiz-3', date: '15th week', marks: 5, cos: 'CO1', duration: '30 min' },
    { assessmentType: 'Test-1', date: '5th week', marks: 10, cos: 'CO2, CO3, CO4', duration: '60 min' },
    { assessmentType: 'Test-2', date: '10th week', marks: 10, cos: 'CO2, CO3, CO4', duration: '60 min' },
    { assessmentType: 'Test-3', date: '15th week', marks: 5, cos: 'CO2, CO3, CO4', duration: '60 min' },
    { assessmentType: 'Assignment-1', date: '7th week', marks: 10, cos: 'CO5, CO6', duration: '6 weeks' },
    { assessmentType: 'Assignment-2', date: '14th week', marks: 10, cos: 'CO5, CO6', duration: '6 weeks' },
    { assessmentType: 'SEE', date: '18th week', marks: 40, cos: 'CO1 - CO5', duration: '3 hours' }
  ];
  table(
    ['Assessment Type', 'Dates', 'Marks', 'COs', 'Duration'],
    schList.map(s => [s.assessmentType || '', s.date || '', String(s.marks || ''), s.cos || '', s.duration || '']),
    [100, 85, 55, 130, 125]
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 8: GRADING TARGETS & ATTAINMENTS
  // ═══════════════════════════════════════════════════════════════════════════
  addPage();
  secTitle('9.  Grading Scheme & Attainment Targets');

  subTitle('9.1  Grading Criterion');
  bodyPara(course.gradingScheme || '91 and above: O (outstanding); 81-90: A+ (Excellent); 71-80: A (Very Good); 61-70: B+ (Good); 51-60: B (Above Average); 40-50: C (Average); below 40: D (Not satisfactory). If one scores D grade, required to re-register.');
  gap(8);

  subTitle('9.2  Attainment Targets');
  bodyPara(course.attainmentTargets || '80% of students scoring > 60%');
  gap(12);

  subTitle('9.3  CO-PO Attainment Summary');
  if ((course.courseOutcomes || []).length) {
    table(
      ['CO', "Bloom's Level", 'Assessment Method', 'Target Attainment'],
      (course.courseOutcomes || []).map(co => [co.coId, co.bloomLevel, 'CIE + SEE', '≥ 60%']),
      [45, 90, 140, IW - 275]
    );
  }

  // --- Decorative End Container Box ---
  needSpace(70);
  gap(16);
  doc.rect(ML, y, IW, 50).fill(C.bg);
  doc.rect(ML, y, IW, 50).strokeColor(C.line).lineWidth(0.5).stroke();
  doc.fillColor(C.navy).fontSize(10).font('Helvetica-Bold')
     .text('— End of Course Syllabus Document —', ML, y + 12, { width: IW, align: 'center', lineBreak: false });
  doc.fillColor(C.mid).fontSize(8).font('Helvetica')
     .text(`Generated: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}`, ML, y + 30, { width: IW, align: 'center', lineBreak: false });

  doc.end();
};
