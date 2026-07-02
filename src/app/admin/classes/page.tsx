"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/components/AdminLayout";
import { ALL_CLASSES, ALL_STUDENTS, DEPARTMENTS } from "@/data/adminData";
import { Layers, Plus, Pencil, Trash2, Users, X, CheckCircle, ChevronRight, ArrowLeft } from "lucide-react";

export default function ClassesPage() {
  const [showModal,    setShowModal]    = useState(false);
  const [viewClass,    setViewClass]    = useState(null); // class id for slide panel
  const [form,         setForm]         = useState({ name:"", dept:"", year:"3rd", section:"A" });
  const [saved,        setSaved]        = useState(false);

  const studentsByClass = (classId) => ALL_STUDENTS.filter(s => s.class === classId);

  async function handleAdd(e) {
    e.preventDefault();
    setSaved(true);
    await new Promise(r => setTimeout(r, 900));
    setSaved(false); setShowModal(false);
    setForm({ name:"", dept:"", year:"3rd", section:"A" });
  }

  const total    = ALL_CLASSES.length;
  const enrolled = ALL_CLASSES.reduce((a, c) => a + c.strength, 0);

  return (
    <AdminLayout title="Classes" subtitle="Manage all classes and student assignments">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex flex-wrap gap-3">
          {[
            { label:"Total Classes",    value:total,    color:"var(--primary)" },
            { label:"Total Enrolled",   value:enrolled, color:"var(--primary)"  },
          ].map(({ label, value, color }) => (
            <div key={label} className="px-4 py-2 rounded-xl"
              style={{ background:"var(--card)", border:`1px solid ${color}30` }}>
              <span className="text-sm font-bold" style={{ color }}>{value}</span>
              <span className="text-xs ml-2" style={{ color:"var(--text-muted)" }}>{label}</span>
            </div>
          ))}
        </div>
        <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white"
          style={{ background:"linear-gradient(135deg,#1B4D1E,#0F2D12)" }}>
          <Plus size={13}/> Add Class
        </motion.button>
      </div>

      <div className="flex gap-5">
        {/* Table */}
        <div className="flex-1 rounded-2xl overflow-hidden"
          style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1.5fr] gap-4 px-5 py-3"
            style={{ borderBottom:"1px solid var(--border)", background:"var(--bg-deep)" }}>
            {["Class","Department","Year","Section","Enrolled","Actions"].map(h => (
              <p key={h} className="text-[10px] font-bold uppercase tracking-wider" style={{ color:"var(--text-muted)" }}>{h}</p>
            ))}
          </div>
          {ALL_CLASSES.map((c, i) => {
            const studs = studentsByClass(c.id);
            return (
              <motion.div key={c.id}
                initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.06 }}
                className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1.5fr] gap-4 px-5 py-3 table-row"
                style={{ borderBottom:"1px solid var(--border-soft)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background:"var(--purple-muted)", border:"1px solid rgba(27,77,30,0.2)" }}>
                    <Layers size={12} style={{ color:"var(--primary)" }}/>
                  </div>
                  <span className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>{c.name}</span>
                </div>
                <span className="text-xs flex items-center" style={{ color:"var(--text-secondary)" }}>{c.dept}</span>
                <span className="text-xs flex items-center" style={{ color:"var(--text-muted)" }}>{c.year}</span>
                <span className="text-xs flex items-center" style={{ color:"var(--text-muted)" }}>{c.section}</span>
                <span className="text-sm font-bold flex items-center" style={{ color:"var(--primary)" }}>
                  {studs.length}
                </span>
                <div className="flex items-center gap-1.5">
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background:"var(--primary-muted)", border:"1px solid rgba(37,99,235,0.2)", color:"var(--primary)" }}>
                    <Pencil size={11}/>
                  </button>
                  <button onClick={() => setViewClass(viewClass===c.id ? null : c.id)}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background:viewClass===c.id?"var(--purple-muted)":"var(--bg-deep)",
                             color:viewClass===c.id?"var(--primary)":"var(--text-muted)",
                             border:`1px solid ${viewClass===c.id?"rgba(124,58,237,0.3)":"var(--border)"}` }}>
                    <Users size={10}/> Students
                  </button>
                </div>
              </motion.div>
            );
          })}
          <div className="px-5 py-3" style={{ borderTop:"1px solid var(--border)", background:"var(--bg-deep)" }}>
            <p className="text-xs" style={{ color:"var(--text-muted)" }}>{ALL_CLASSES.length} classes</p>
          </div>
        </div>

        {/* Student panel */}
        <AnimatePresence>
          {viewClass && (
            <motion.div initial={{ opacity:0, x:24, width:0 }} animate={{ opacity:1, x:0, width:280 }}
              exit={{ opacity:0, x:24, width:0 }} transition={{ duration:0.25 }}
              className="rounded-2xl overflow-hidden shrink-0"
              style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
              <div className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom:"1px solid var(--border)", background:"var(--bg-deep)" }}>
                <p className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>
                  {ALL_CLASSES.find(c=>c.id===viewClass)?.name}
                </p>
                <button onClick={() => setViewClass(null)}
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background:"var(--border)", color:"var(--text-muted)" }}>
                  <X size={11}/>
                </button>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight:400 }}>
                {studentsByClass(viewClass).length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm" style={{ color:"var(--text-muted)" }}>No students enrolled</p>
                  </div>
                ) : (
                  studentsByClass(viewClass).map((s, i) => (
                    <div key={s.id} className="flex items-center gap-2.5 px-4 py-2.5 table-row"
                      style={{ borderBottom:"1px solid var(--border-soft)" }}>
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1B4D1E] to-[#F5C800]
                                      flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {s.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color:"var(--text-primary)" }}>{s.name}</p>
                        <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>{s.regno}</p>
                      </div>
                      <span className={`badge ${s.status==="active"?"badge-success":"badge-danger"} text-[9px] shrink-0`}>
                        {s.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
              className="w-full max-w-sm rounded-2xl overflow-hidden"
              style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow-xl)" }}
              onClick={e=>e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom:"1px solid var(--border)", background:"rgba(124,58,237,0.08)" }}>
                <h3 className="font-bold" style={{ color:"var(--text-primary)" }}>Add Class</h3>
                <button onClick={() => setShowModal(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background:"var(--bg-deep)", color:"var(--text-muted)" }}>
                  <X size={13}/>
                </button>
              </div>
              <form onSubmit={handleAdd} className="p-5 space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color:"var(--text-muted)" }}>Class Name</label>
                  <input type="text" value={form.name} placeholder="e.g. CSE 4th Year C"
                    onChange={e => setForm(f=>({...f,name:e.target.value}))} className="input-field" required/>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color:"var(--text-muted)" }}>Department</label>
                  <select value={form.dept} onChange={e=>setForm(f=>({...f,dept:e.target.value}))} className="input-field" required>
                    <option value="">Select…</option>
                    {DEPARTMENTS.map(d=><option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color:"var(--text-muted)" }}>Year</label>
                    <select value={form.year} onChange={e=>setForm(f=>({...f,year:e.target.value}))} className="input-field">
                      {["1st","2nd","3rd","4th"].map(y=><option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color:"var(--text-muted)" }}>Section</label>
                    <select value={form.section} onChange={e=>setForm(f=>({...f,section:e.target.value}))} className="input-field">
                      {["A","B","C","D"].map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }} type="submit"
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                    style={{ background:saved?"var(--success)":"linear-gradient(135deg,#1B4D1E,#0F2D12)" }}>
                    {saved?<><CheckCircle size={13}/>Added</>:<><Plus size={13}/>Add Class</>}
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
