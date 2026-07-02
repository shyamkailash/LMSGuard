"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/components/AdminLayout";
import { ALL_EXAMS, DEPARTMENTS, ALL_CLASSES } from "@/data/adminData";
import { BookOpen, Plus, Pencil, Trash2, X, CheckCircle, Eye } from "lucide-react";

export default function ExamsPage() {
  const [showModal, setShowModal] = useState(false);
  const [dismissed, setDismissed] = useState(new Set());
  const [form, setForm] = useState({ title:"", subject:"", code:"", date:"", duration:60, questions:50, dept:"", classes:[] });
  const [saved, setSaved] = useState(false);

  const rows = ALL_EXAMS.filter(e => !dismissed.has(e.id));

  const counts = {
    total:     rows.length,
    active:    rows.filter(e=>e.status==="active").length,
    scheduled: rows.filter(e=>e.status==="scheduled").length,
  };

  async function handleAdd(e) {
    e.preventDefault();
    setSaved(true);
    await new Promise(r => setTimeout(r, 900));
    setSaved(false); setShowModal(false);
    setForm({ title:"", subject:"", code:"", date:"", duration:60, questions:50, dept:"", classes:[] });
  }

  function toggleClass(id) {
    setForm(f => ({ ...f, classes: f.classes.includes(id) ? f.classes.filter(c=>c!==id) : [...f.classes, id] }));
  }

  const filteredClasses = form.dept ? ALL_CLASSES.filter(c => c.dept === form.dept) : ALL_CLASSES;

  return (
    <AdminLayout title="Exams" subtitle="Create and manage all exams system-wide">
      {/* Stats */}
      <div className="flex flex-wrap gap-3 mb-5">
        {[
          { label:"Total",     value:counts.total,     color:"var(--primary)" },
          { label:"Active",    value:counts.active,    color:"var(--success)" },
          { label:"Scheduled", value:counts.scheduled, color:"var(--warning)" },
        ].map(({ label, value, color }) => (
          <div key={label} className="px-4 py-2 rounded-xl"
            style={{ background:"var(--card)", border:`1px solid ${color}30` }}>
            <span className="text-sm font-bold" style={{ color }}>{value}</span>
            <span className="text-xs ml-2" style={{ color:"var(--text-muted)" }}>{label}</span>
          </div>
        ))}
        <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
          onClick={() => setShowModal(true)}
          className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white"
          style={{ background:"linear-gradient(135deg,#1B4D1E,#0F2D12)" }}>
          <Plus size={13}/> Add Exam
        </motion.button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
        <div className="grid grid-cols-[2fr_1.5fr_0.8fr_1fr_1.5fr_1.2fr_0.7fr_0.7fr_1fr_1.2fr] gap-2 px-5 py-3"
          style={{ borderBottom:"1px solid var(--border)", background:"var(--bg-deep)" }}>
          {["Exam","Subject","Code","Date","Dept","Classes","Dur","Qs","Status","Actions"].map(h => (
            <p key={h} className="text-[10px] font-bold uppercase tracking-wider" style={{ color:"var(--text-muted)" }}>{h}</p>
          ))}
        </div>
        {rows.map((exam, i) => (
          <motion.div key={exam.id}
            initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.05 }}
            className="grid grid-cols-[2fr_1.5fr_0.8fr_1fr_1.5fr_1.2fr_0.7fr_0.7fr_1fr_1.2fr] gap-2 px-5 py-3 table-row"
            style={{ borderBottom:"1px solid var(--border-soft)" }}>
            <div className="flex items-center gap-1.5 min-w-0">
              <BookOpen size={11} style={{ color:"var(--primary)", shrink:0 }}/>
              <span className="text-xs font-semibold truncate" style={{ color:"var(--text-primary)" }}>
                {exam.title}
              </span>
            </div>
            <span className="text-xs flex items-center truncate" style={{ color:"var(--text-secondary)" }}>{exam.subject}</span>
            <span className="text-xs font-mono flex items-center" style={{ color:"var(--text-muted)" }}>{exam.code}</span>
            <span className="text-xs flex items-center" style={{ color:"var(--text-muted)" }}>{exam.date}</span>
            <span className="text-xs flex items-center truncate" style={{ color:"var(--text-secondary)" }}>{exam.dept}</span>
            <div className="flex items-center gap-1">
              <span className="text-xs" style={{ color:"var(--text-secondary)" }}>
                {exam.classes?.[0]}
                {exam.classes?.length > 1 && <span style={{ color:"var(--text-muted)" }}> +{exam.classes.length-1}</span>}
              </span>
            </div>
            <span className="text-xs flex items-center" style={{ color:"var(--text-muted)" }}>{exam.duration}m</span>
            <span className="text-xs flex items-center" style={{ color:"var(--text-muted)" }}>{exam.questions}</span>
            <div className="flex items-center">
              <span className={`badge ${exam.status==="active"?"badge-success":"badge-warning"} text-[9px]`}>{exam.status}</span>
            </div>
            <div className="flex items-center gap-1">
              <a href="/admin/monitoring"
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background:"var(--success-muted)", border:"1px solid rgba(22,163,74,0.2)", color:"var(--success)" }}>
                <Eye size={10}/>
              </a>
              <button className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background:"var(--primary-muted)", border:"1px solid rgba(37,99,235,0.2)", color:"var(--primary)" }}>
                <Pencil size={10}/>
              </button>
              <button onClick={() => setDismissed(d => new Set([...d, exam.id]))}
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background:"var(--danger-muted)", border:"1px solid rgba(220,38,38,0.2)", color:"var(--danger)" }}>
                <Trash2 size={10}/>
              </button>
            </div>
          </motion.div>
        ))}
        <div className="px-5 py-3" style={{ borderTop:"1px solid var(--border)", background:"var(--bg-deep)" }}>
          <p className="text-xs" style={{ color:"var(--text-muted)" }}>{rows.length} exams</p>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)" }}
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale:0.9, y:16 }} animate={{ scale:1, y:0 }} exit={{ scale:0.9 }}
              transition={{ type:"spring", stiffness:280, damping:24 }}
              className="w-full max-w-md rounded-2xl overflow-hidden max-h-[85vh] overflow-y-auto"
              style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow-xl)" }}
              onClick={e=>e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 sticky top-0 z-10"
                style={{ borderBottom:"1px solid var(--border)", background:"var(--card)" }}>
                <h3 className="font-bold" style={{ color:"var(--text-primary)" }}>Add New Exam</h3>
                <button onClick={() => setShowModal(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background:"var(--bg-deep)", color:"var(--text-muted)" }}>
                  <X size={13}/>
                </button>
              </div>
              <form onSubmit={handleAdd} className="p-5 space-y-3">
                {[
                  { label:"Exam Title", key:"title",   ph:"DBMS Final Exam"        },
                  { label:"Subject",    key:"subject",  ph:"Database Management"    },
                  { label:"Code",       key:"code",     ph:"CS501"                  },
                ].map(({ label, key, ph }) => (
                  <div key={key}>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color:"var(--text-muted)" }}>{label}</label>
                    <input type="text" value={form[key]} placeholder={ph}
                      onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} className="input-field" required/>
                  </div>
                ))}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color:"var(--text-muted)" }}>Date</label>
                  <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} className="input-field" required/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color:"var(--text-muted)" }}>Duration (min)</label>
                    <input type="number" value={form.duration} min={15} max={180}
                      onChange={e=>setForm(f=>({...f,duration:e.target.value}))} className="input-field"/>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color:"var(--text-muted)" }}>Questions</label>
                    <input type="number" value={form.questions} min={5} max={200}
                      onChange={e=>setForm(f=>({...f,questions:e.target.value}))} className="input-field"/>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color:"var(--text-muted)" }}>Department</label>
                  <select value={form.dept} onChange={e=>setForm(f=>({...f,dept:e.target.value,classes:[]}))} className="input-field">
                    <option value="">Select…</option>
                    {DEPARTMENTS.map(d=><option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color:"var(--text-muted)" }}>Assign Classes</label>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {filteredClasses.map(c => (
                      <label key={c.id} className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg"
                        style={{ background:"var(--bg-deep)" }}>
                        <input type="checkbox" checked={form.classes.includes(c.id)}
                          onChange={()=>toggleClass(c.id)} className="accent-purple-600"/>
                        <span className="text-sm" style={{ color:"var(--text-primary)" }}>{c.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }} type="submit"
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                    style={{ background:saved?"var(--success)":"linear-gradient(135deg,#1B4D1E,#0F2D12)" }}>
                    {saved?<><CheckCircle size={13}/>Added</>:<><Plus size={13}/>Add Exam</>}
                  </motion.button>
                  <button type="button" onClick={()=>setShowModal(false)} className="px-4 py-2.5 rounded-xl text-sm btn-secondary">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
