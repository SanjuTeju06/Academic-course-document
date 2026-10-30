/**
 * @file AddCourse.jsx
 * @description Admin multi-step registration wizard for adding and editing courses in Light Theme.
 * Supports pre-loading full existing records if an optional `id` parameter is specified.
 * Features 6 steps:
 * 1. Basic Info (Code, Title, Semester, Program, Difficulty tags)
 * 2. Course Objectives & Bloom-based Outcomes (COs)
 * 3. Matrix CO-PO/PSO weight scores (0 to 3)
 * 4. Assigned Literature (Textbooks & References)
 * 5. Assessment Distribution (CIE & SEE allocation)
 * 6. Lesson Plan (Lectures, topics covered, teaching methods)
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

// Friendly step titles for progress bar indicators
const STEPS = ['Basic Info', 'Objectives & COs', 'CO-PO Mapping', 'Books', 'Assessment', 'Lesson Plan'];

// Preconfigured skeleton mapping out the standard schema constraints
const defaultForm = {
  courseCode: '', courseTitle: '', semester: 1, program: 'B.Tech Computer Science',
  department: 'Computer Science & Engineering', branch: 'CS', credits: 4, hours: 60,
  difficulty: 'Medium', emoji: '📚', funny_description: '',
  courseObjectives: ['', '', ''],
  courseOutcomes: [{ coId: 'CO1', description: '', bloomLevel: 'Understand' }],
  coPoMapping: [{ coId: 'CO1', mappings: { PO1:0,PO2:0,PO3:0,PO4:0,PO5:0,PO6:0,PO7:0,PO8:0,PO9:0,PO10:0,PO11:0,PO12:0,PSO1:0,PSO2:0 } }],
  textbooks: [{ title:'', author:'', publisher:'', year:'' }],
  references: [{ title:'', author:'', publisher:'', year:'' }],
  assessment: [{ type:'CIE', marks:50, description:'Continuous Internal Evaluation' },{ type:'SEE', marks:50, description:'Semester End Examination' }],
  assessmentWeights: { quiz: 15, test: 25, assignment: 20, see: 40, total: 100 },
  assessmentCoDistribution: [
    { coId: 'CO1', quiz: 10, test: 0, assignment: 0, see: 8, totalMarks: 18 },
    { coId: 'CO2', quiz: 5, test: 9, assignment: 0, see: 12, totalMarks: 26 },
    { coId: 'CO3', quiz: 0, test: 8, assignment: 0, see: 10, totalMarks: 18 },
    { coId: 'CO4', quiz: 0, test: 8, assignment: 0, see: 6, totalMarks: 14 },
    { coId: 'CO5', quiz: 0, test: 0, assignment: 10, see: 4, totalMarks: 14 },
    { coId: 'CO6', quiz: 0, test: 0, assignment: 10, see: 0, totalMarks: 10 }
  ],
  assessmentSchedule: [
    { assessmentType: 'Quiz-1', date: '5th week', marks: 5, cos: 'CO1', duration: '30 min' },
    { assessmentType: 'Quiz-2', date: '10th week', marks: 5, cos: 'CO2', duration: '30 min' },
    { assessmentType: 'Quiz-3', date: '15th week', marks: 5, cos: 'CO1', duration: '30 min' },
    { assessmentType: 'Test-1', date: '5th week', marks: 10, cos: 'CO2, CO3, CO4', duration: '60 min' },
    { assessmentType: 'Test-2', date: '10th week', marks: 10, cos: 'CO2, CO3, CO4', duration: '60 min' },
    { assessmentType: 'Test-3', date: '15th week', marks: 5, cos: 'CO2, CO3, CO4', duration: '60 min' },
    { assessmentType: 'Assignment-1', date: '7th week', marks: 10, cos: 'CO5, CO6', duration: '6 weeks' },
    { assessmentType: 'Assignment-2', date: '14th week', marks: 10, cos: 'CO5, CO6', duration: '6 weeks' },
    { assessmentType: 'SEE', date: '18th week', marks: 40, cos: 'CO1 - CO5', duration: '3 hours' }
  ],
  attainmentTargets: '80% of students scoring > 60%',
  gradingScheme: '91 and above: O (outstanding); 81-90: A+ (Excellent); 71-80: A (Very Good); 61-70: B+ (Good); 51-60: B (Above Average); 40-50: C (Average); below 40: D (Not satisfactory). If one scores D grade, required to re-register.',
  lessonPlan: [],
};

// Recognized Bloom's Cognitive Levels
const bloomLevels = ['Remember','Understand','Apply','Analyze','Evaluate','Create'];

// Full matrix columns list for Program Outcomes & Program Specific Outcomes
const POs = ['PO1','PO2','PO3','PO4','PO5','PO6','PO7','PO8','PO9','PO10','PO11','PO12','PSO1','PSO2'];

// Shared CSS class template for inputs across form grids adapted for Light Theme
const fieldCls = "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";

export default function AddCourse() {
  const { id } = useParams(); // Preload target ID if editing
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load course details on mount if editing
  useEffect(() => {
    if (id) {
      setLoading(true);
      const loadCourse = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/courses/${id}`);
          setForm(res.data);
        } catch (err) {
          console.error('Error preloading course for edit:', err);
          alert('Failed to load course details for editing.');
        } finally {
          setLoading(false);
        }
      };
      loadCourse();
    }
  }, [id]);

  // Simple state update proxy
  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  // ─── Step 0: Basic Info Page Component ───
  const Step0 = () => (
    <div className="grid grid-cols-2 gap-4">
      {[['courseCode','Course Code'],['courseTitle','Course Title'],['program','Program'],['department','Department']].map(([k,l])=>(
        <div key={k} className={k==='courseTitle'||k==='department'?'col-span-2':''}>
          <label className="block text-xs font-semibold text-slate-500 mb-1">{l}</label>
          <input className={fieldCls} value={form[k] || ''} onChange={e=>set(k,e.target.value)} placeholder={l} />
        </div>
      ))}
      <div><label className="block text-xs font-semibold text-slate-500 mb-1">Semester</label>
        <select className={fieldCls} value={form.semester} onChange={e=>set('semester',+e.target.value)}>
          {[1,2,3,4,5,6,7,8].map(s=><option key={s} value={s}>Semester {s}</option>)}
        </select>
      </div>
      <div><label className="block text-xs font-semibold text-slate-500 mb-1">Branch</label>
        <select className={fieldCls} value={form.branch || 'CS'} onChange={e=>set('branch',e.target.value)}>
          {[['CS','Computer Science'],['IS','Information Science'],['EC','Electronics & Communication'],['EEE','Electrical & Electronics'],['ME','Mechanical'],['CV','Civil']].map(([k,l])=><option key={k} value={k}>{k} — {l}</option>)}
        </select>
      </div>
      <div><label className="block text-xs font-semibold text-slate-500 mb-1">Credits</label>
        <input type="number" className={fieldCls} value={form.credits || 0} onChange={e=>set('credits',+e.target.value)} />
      </div>
      <div><label className="block text-xs font-semibold text-slate-500 mb-1">Total Hours</label>
        <input type="number" className={fieldCls} value={form.hours || 0} onChange={e=>set('hours',+e.target.value)} />
      </div>
      <div><label className="block text-xs font-semibold text-slate-500 mb-1">Difficulty</label>
        <select className={fieldCls} value={form.difficulty || 'Medium'} onChange={e=>set('difficulty',e.target.value)}>
          {['Easy','Medium','Hard','Nightmare'].map(d=><option key={d}>{d}</option>)}
        </select>
      </div>
      <div><label className="block text-xs font-semibold text-slate-500 mb-1">Emoji</label>
        <input className={fieldCls} value={form.emoji || '📚'} onChange={e=>set('emoji',e.target.value)} />
      </div>
      <div className="col-span-2"><label className="block text-xs font-semibold text-slate-500 mb-1">Funny Description</label>
        <input className={fieldCls} value={form.funny_description || ''} onChange={e=>set('funny_description',e.target.value)} placeholder="e.g. Tables were too mainstream." />
      </div>
    </div>
  );

  // ─── Step 1: Objectives & COs Form Grid ───
  const Step1 = () => (
    <div className="space-y-6">
      {/* Course Objectives list */}
      <div>
        <h3 className="text-sm font-bold text-primary mb-3">Course Objectives</h3>
        {(form.courseObjectives || []).map((obj,i)=>(
          <div key={i} className="flex gap-2 mb-2">
            <span className="text-slate-400 text-sm mt-2">{i+1}.</span>
            <input className={fieldCls} value={obj} onChange={e=>{ const a=[...form.courseObjectives]; a[i]=e.target.value; set('courseObjectives',a); }} placeholder={`Objective ${i+1}`} />
            <button onClick={()=>set('courseObjectives',form.courseObjectives.filter((_,j)=>j!==i))} className="text-red-500 hover:text-red-600 px-2">✕</button>
          </div>
        ))}
        <button onClick={()=>set('courseObjectives',_prev => [...(form.courseObjectives || []), ''])} className="text-xs text-primary hover:text-primary-dark border border-primary/30 px-3 py-1 rounded-lg mt-1 font-bold">+ Add Objective</button>
      </div>

      {/* Course Outcomes (CO) dynamic array */}
      <div>
        <h3 className="text-sm font-bold text-secondary mb-3">Course Outcomes (COs)</h3>
        {(form.courseOutcomes || []).map((co,i)=>(
          <div key={i} className="grid grid-cols-12 gap-2 mb-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="col-span-2"><label className="text-xs text-slate-500 font-semibold">CO ID</label>
              <input className={fieldCls+" mt-1"} value={co.coId || ''} onChange={e=>{ const a=[...form.courseOutcomes]; a[i]={...a[i],coId:e.target.value}; set('courseOutcomes',a); }} />
            </div>
            <div className="col-span-7"><label className="text-xs text-slate-500 font-semibold">Description</label>
              <input className={fieldCls+" mt-1"} value={co.description || ''} onChange={e=>{ const a=[...form.courseOutcomes]; a[i]={...a[i],description:e.target.value}; set('courseOutcomes',a); }} placeholder="CO description..." />
            </div>
            <div className="col-span-2"><label className="text-xs text-slate-500 font-semibold">Bloom's</label>
              <select className={fieldCls+" mt-1"} value={co.bloomLevel || 'Understand'} onChange={e=>{ const a=[...form.courseOutcomes]; a[i]={...a[i],bloomLevel:e.target.value}; set('courseOutcomes',a); }}>
                {bloomLevels.map(b=><option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="col-span-1 flex items-end pb-1 justify-center">
              <button onClick={()=>set('courseOutcomes',form.courseOutcomes.filter((_,j)=>j!==i))} className="text-red-500 hover:text-red-600">✕</button>
            </div>
          </div>
        ))}
        <button onClick={()=>{
          const n=(form.courseOutcomes || []).length+1;
          set('courseOutcomes',_prev => [...(form.courseOutcomes || []), { coId:`CO${n}`, description:'', bloomLevel:'Understand' }]);
          set('coPoMapping',_prev => [...(form.coPoMapping || []), { coId:`CO${n}`, mappings:{PO1:0,PO2:0,PO3:0,PO4:0,PO5:0,PO6:0,PO7:0,PO8:0,PO9:0,PO10:0,PO11:0,PO12:0,PSO1:0,PSO2:0} }]);
        }} className="text-xs text-secondary hover:text-secondary-dark border border-secondary/30 px-3 py-1 rounded-lg font-bold">+ Add CO</button>
      </div>
    </div>
  );

  // ─── Step 2: CO-PO Matrix Weight Entry ───
  const Step2 = () => (
    <div className="overflow-x-auto">
      <p className="text-xs text-slate-500 mb-3 font-semibold">Scale: 3 = High, 2 = Medium, 1 = Low, 0 = Not Mapped</p>
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-2 text-left text-slate-700 border border-slate-200 w-12">CO</th>
            {POs.map(po=><th key={po} className="p-2 text-center text-slate-700 border border-slate-200 w-10">{po}</th>)}
          </tr>
        </thead>
        <tbody>
          {(form.coPoMapping || []).map((row,i)=>(
            <tr key={i} className={i%2===0?'bg-white':'bg-slate-50'}>
              <td className="p-2 font-bold text-primary border border-slate-200">{row.coId}</td>
              {POs.map(po=>(
                <td key={po} className="p-1 border border-slate-200">
                  <select className="w-full bg-transparent text-slate-800 text-center focus:outline-none font-bold" value={row.mappings?.[po]||0}
                    onChange={e=>{ const a=[...form.coPoMapping]; a[i]={...a[i],mappings:{...a[i].mappings,[po]:+e.target.value}}; set('coPoMapping',a); }}>
                    {[0,1,2,3].map(v=><option key={v} value={v}>{v||'—'}</option>)}
                  </select>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // ─── Step 3: assigned Textbooks & Reference Literature ───
  const BookSection = ({ field, label, color }) => (
    <div className="mb-6">
      <h3 className={`text-sm font-bold mb-3`} style={{color}}>{label}</h3>
      {(form[field] || []).map((b,i)=>(
        <div key={i} className="grid grid-cols-4 gap-2 mb-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
          {[['title','Title','col-span-2'],['author','Author','col-span-1'],['publisher','Publisher','col-span-1'],['year','Year','col-span-1']].map(([k,lbl,span])=>(
            <div key={k} className={span}>
              <label className="text-xs text-slate-500 font-semibold">{lbl}</label>
              <input className={fieldCls+" mt-1"} value={b[k] || ''} onChange={e=>{ const a=[...form[field]]; a[i]={...a[i],[k]:e.target.value}; set(field,a); }} />
            </div>
          ))}
          <div className="col-span-1 flex items-end justify-center">
            <button onClick={()=>set(field,form[field].filter((_,j)=>j!==i))} className="text-red-500 hover:text-red-600 text-xs font-bold mb-1">✕ Remove</button>
          </div>
        </div>
      ))}
      <button onClick={()=>set(field,[...(form[field]||[]),{title:'',author:'',publisher:'',year:''}])} className="text-xs border px-3 py-1 rounded-lg mt-1 font-bold" style={{color,borderColor:color+'55'}}>+ Add Book</button>
    </div>
  );
  const Step3 = () => <div><BookSection field="textbooks" label="📚 Textbooks" color="#0ea5e9" /><BookSection field="references" label="📖 Reference Books" color="#6366f1" /></div>;

  // ─── Step 4: Assessment distribution forms ───
  const Step4 = () => (
    <div className="space-y-8">
      {/* 3.1 Assessment Weight Distribution */}
      <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">3.1 Assessment Weight Distribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[['quiz','Quiz Weight'],['test','Test Weight'],['assignment','Assignment Weight'],['see','SEE Weight'],['total','Total Marks']].map(([k,l])=>(
            <div key={k}>
              <label className="block text-xs font-semibold text-slate-500 mb-1">{l}</label>
              <input type="number" className={fieldCls} value={form.assessmentWeights?.[k] || 0} onChange={e=>set('assessmentWeights',{...(form.assessmentWeights||{}),[k]:+e.target.value})} />
            </div>
          ))}
        </div>

        <div className="overflow-x-auto pt-2">
          <label className="block text-xs font-semibold text-slate-500 mb-2">Weights / Course Outcomes Breakdown</label>
          <table className="w-full text-xs border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="p-2 border border-slate-200 text-left">CO</th>
                <th className="p-2 border border-slate-200 text-center">Quiz</th>
                <th className="p-2 border border-slate-200 text-center">Test</th>
                <th className="p-2 border border-slate-200 text-center">Assignment</th>
                <th className="p-2 border border-slate-200 text-center">SEE</th>
                <th className="p-2 border border-slate-200 text-center">Total Marks</th>
              </tr>
            </thead>
            <tbody>
              {(form.assessmentCoDistribution || []).map((co, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-2 border border-slate-200 font-bold text-primary">{co.coId}</td>
                  {['quiz','test','assignment','see','totalMarks'].map(k => (
                    <td key={k} className="p-1 border border-slate-200">
                      <input type="number" className="w-full bg-transparent text-center focus:outline-none text-xs font-semibold" value={co[k] || 0}
                        onChange={e => {
                          const a = [...form.assessmentCoDistribution];
                          a[i] = { ...a[i], [k]: +e.target.value };
                          set('assessmentCoDistribution', a);
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3.2 Schedule of Assessment */}
      <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">3.2 Schedule of Assessment</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="p-2 border border-slate-200 text-left">Assessment Type</th>
                <th className="p-2 border border-slate-200 text-left">Dates</th>
                <th className="p-2 border border-slate-200 text-center">Marks</th>
                <th className="p-2 border border-slate-200 text-left">COs</th>
                <th className="p-2 border border-slate-200 text-left">Duration</th>
                <th className="p-2 border border-slate-200 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {(form.assessmentSchedule || []).map((sch, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-1 border border-slate-200"><input className="w-full bg-transparent px-1 focus:outline-none text-xs font-bold text-primary" value={sch.assessmentType || ''} onChange={e=>{ const a=[...form.assessmentSchedule]; a[i]={...a[i],assessmentType:e.target.value}; set('assessmentSchedule',a); }} /></td>
                  <td className="p-1 border border-slate-200"><input className="w-full bg-transparent px-1 focus:outline-none text-xs" value={sch.date || ''} onChange={e=>{ const a=[...form.assessmentSchedule]; a[i]={...a[i],date:e.target.value}; set('assessmentSchedule',a); }} placeholder="e.g. 5th week" /></td>
                  <td className="p-1 border border-slate-200"><input type="number" className="w-full bg-transparent text-center focus:outline-none text-xs font-semibold" value={sch.marks || 0} onChange={e=>{ const a=[...form.assessmentSchedule]; a[i]={...a[i],marks:+e.target.value}; set('assessmentSchedule',a); }} /></td>
                  <td className="p-1 border border-slate-200"><input className="w-full bg-transparent px-1 focus:outline-none text-xs" value={sch.cos || ''} onChange={e=>{ const a=[...form.assessmentSchedule]; a[i]={...a[i],cos:e.target.value}; set('assessmentSchedule',a); }} placeholder="e.g. CO1" /></td>
                  <td className="p-1 border border-slate-200"><input className="w-full bg-transparent px-1 focus:outline-none text-xs" value={sch.duration || ''} onChange={e=>{ const a=[...form.assessmentSchedule]; a[i]={...a[i],duration:e.target.value}; set('assessmentSchedule',a); }} placeholder="e.g. 30 min" /></td>
                  <td className="p-1 border border-slate-200 text-center"><button onClick={()=>set('assessmentSchedule',form.assessmentSchedule.filter((_,j)=>j!==i))} className="text-red-500 hover:text-red-600 font-bold px-1">✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={()=>set('assessmentSchedule',[...(form.assessmentSchedule||[]),{assessmentType:`Assessment-${(form.assessmentSchedule||[]).length+1}`,date:'',marks:10,cos:'',duration:''}])} className="text-xs text-primary border border-primary/30 px-3 py-1.5 rounded-lg font-bold bg-white shadow-sm">+ Add Schedule Row</button>
      </div>

      {/* 3.3 Grading Criterion */}
      <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">3.3 Grading Criterion & Attainment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Attainment Targets</label>
            <input className={fieldCls} value={form.attainmentTargets || ''} onChange={e=>set('attainmentTargets',e.target.value)} placeholder="e.g. 80% of students scoring > 60%" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Quick Select Template</label>
            <select className={fieldCls} onChange={e=>set('gradingScheme',e.target.value)}>
              <option value="">Select a standard grading criteria template...</option>
              <option value="91 and above: O (outstanding); 81-90: A+ (Excellent); 71-80: A (Very Good); 61-70: B+ (Good); 51-60: B (Above Average); 40-50: C (Average); below 40: D (Not satisfactory). If one scores D grade, required to re-register.">Standard 10-Point Letter Grading (O, A+, A...)</option>
              <option value="Absolute Grading System (Letter Grades based on absolute cutoff marks)">Absolute Grading System</option>
              <option value="Relative Grading System (Standardized normal distribution relative to class mean)">Relative Grading (Bell Curve)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Grading Criterion Detailed Rule Text</label>
            <textarea rows="3" className={fieldCls} value={form.gradingScheme || ''} onChange={e=>set('gradingScheme',e.target.value)} placeholder="Specific grading rules..." />
          </div>
        </div>
      </div>
    </div>
  );

  // ─── Step 5: Chronological Lesson Plan configuration grid ───
  const Step5 = () => (
    <div>
      <h3 className="text-sm font-bold text-secondary mb-3">Lesson Plan Entries</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse mb-3">
          <thead>
            <tr className="bg-slate-100">
              {['Week','Lecture No','Topics','COs Mapped','Teaching Method','Hours',''].map(h=>(
                <th key={h} className="p-2 text-left text-slate-700 border border-slate-200 font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(form.lessonPlan || []).map((lp,i)=>(
              <tr key={i} className={i%2===0?'bg-white':'bg-slate-50'}>
                {[['weekNo','number',3],['lectureNo','text',5],['topics','text',16],['cosMapped','text',6],['teachingMethod','text',8],['durationHours','number',3]].map(([k,t])=>(
                  <td key={k} className="p-1 border border-slate-200">
                    <input type={t} className="bg-transparent text-slate-800 text-xs w-full focus:outline-none px-1 font-medium"
                      value={k==='cosMapped'?(lp.cosMapped||[]).join(', '):lp[k]||''}
                      onChange={e=>{ const a=[...form.lessonPlan]; a[i]={...a[i],[k]:k==='cosMapped'?e.target.value.split(',').map(x=>x.trim()):k==='weekNo'||k==='durationHours'?+e.target.value:e.target.value}; set('lessonPlan',a); }}
                    />
                  </td>
                ))}
                <td className="p-1 border border-slate-200 text-center">
                  <button onClick={()=>set('lessonPlan',form.lessonPlan.filter((_,j)=>j!==i))} className="text-red-500">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={()=>set('lessonPlan',[...(form.lessonPlan||[]),{weekNo:form.lessonPlan.length+1,lectureNo:'',topics:'',cosMapped:[],teachingMethod:'Lecture',durationHours:1}])}
        className="text-xs text-secondary border border-secondary/30 px-3 py-1 rounded-lg font-bold">+ Add Row</button>
    </div>
  );

  const steps = [Step0, Step1, Step2, Step3, Step4, Step5];
  const StepComponent = steps[step];

  // Submit complete validated payload into DB collection
  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (id) {
        // Edit course PUT request
        await axios.put(`http://localhost:5000/api/courses/${id}`, form);
        alert('Course details updated successfully!');
      } else {
        // Create course POST request
        await axios.post('http://localhost:5000/api/courses', form);
        alert('Course registered successfully!');
      }
      navigate('/admin');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally { setSaving(false); }
  };

  if (loading) return <div className="p-12 text-center text-xl text-primary animate-pulse font-bold">Loading course details...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary mb-2 tracking-tight">
          {id ? 'Edit Course Settings' : 'Register New Course'}
        </h1>
        <p className="text-slate-500 font-medium text-sm">Complete all steps to {id ? 'update all functions of the course' : 'register a course with full academic details'}</p>
      </div>

      {/* Modern Multi-Step Visual Progress Bar */}
      <div className="flex items-center justify-between glass-card p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        {STEPS.map((s,i)=>(
          <React.Fragment key={i}>
            <button onClick={()=>setStep(i)} className={`flex flex-col items-center ${i<=step?'text-primary':'text-slate-400'}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${i===step?'border-primary bg-primary/10':i<step?'border-secondary bg-secondary/10 text-secondary':'border-slate-200 bg-slate-50'}`}>
                {i<step?'✓':i+1}
              </div>
              <span className="text-xs mt-1 hidden sm:block font-bold">{s}</span>
            </button>
            {i<STEPS.length-1 && <div className={`flex-1 h-px mx-2 ${i<step?'bg-secondary':'bg-slate-200'}`}></div>}
          </React.Fragment>
        ))}
      </div>

      {/* Active Form Panel Context Container */}
      <div className="glass-card p-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">{step+1}</span>
          {STEPS[step]}
        </h2>
        <StepComponent />
      </div>

      {/* Horizontal Wizard Controls */}
      <div className="flex justify-between items-center">
        <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}
          className="px-6 py-2 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 disabled:opacity-40 transition-colors text-sm">
          ← Previous
        </button>
        <span className="text-slate-500 text-sm font-bold">Step {step+1} of {STEPS.length}</span>
        {step < STEPS.length-1
          ? <button onClick={()=>setStep(s=>s+1)} className="px-6 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-accent hover:opacity-95 shadow-sm transition-all text-sm">Next →</button>
          : <button onClick={handleSubmit} disabled={saving} className="px-8 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-secondary to-primary hover:opacity-95 shadow-sm disabled:opacity-60 transition-all text-sm">
              {saving ? 'Saving...' : id ? '💾 Save Changes' : '🚀 Register Course'}
            </button>
        }
      </div>
    </div>
  );
}
