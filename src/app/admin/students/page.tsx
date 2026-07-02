"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/components/AdminLayout";
import { ALL_STUDENTS, DEPARTMENTS, ALL_CLASSES } from "@/data/adminData";
import { Search, Plus, Pencil, Trash2, X, GraduationCap, CheckCircle } from "lucide-react";

function riskColor(r) {
  if (r >= 70) return "var(--danger)";
  if (r >= 35) return "var(--warning)";
  return "var(--success)";
}

export default function StudentsPage() {
  const [search,      setSearch]      = useState("");
  const [statusFilter,setStatusFilter]= useState("all");
  const [showModal,   setShowModal]   = useState(false);
  const [dismissed,   setDismissed]   = useState(new Set());
  const [form,        setForm]        = useState({ name:"", regno:"", email:"", dept:"", class:"" });
  const [saved,       setSaved]       = useState(false);

  const rows = ALL_STUDENTS.filter(s => !dismissed.has(s.id)).filter(s => {
    const q = search.toLowerCase();
    const matchQ = s.name.toLowerCase().includes(q) || s.regno.toLowerCase().includes(q) || s.class.toLowerCase().includes(q);
    const matchS  = statusFilter === "all" || s.status === statusFilter;
    return matchQ && matchS;
  });

  async function handleAdd(e) {
    e.preventDefault();
    setSaved(true);
    await new Promise(r => setTimeout(r, 900));
    setSaved(false);
    setShowModal(false);
    setForm({ name:"", regno:"", email:"", dept:"", class:"" });
  }

  const filteredClasses = form.dept
    ? ALL_CLASSES.filter(c => c.dept === form.dept)
    : ALL_CLASSES;

  const counts = {
    total:   ALL_STUDENTS.length,
    active:  ALL_STUDENTS.filter(s => s.status==="active").length,
    flagged: ALL_STUDENTS.filter(s => s.status==="flagged").length,
  };

  return (
    <AdminLayout title="Students" subtitle="Manage all students across all departments">
      {/* Stats */}
      <div className="flex flex-wrap gap-3 mb-5">
        {[
          { label:"Total",   value:counts.total,   color:"var(--primary)", border:"rgba(37,99,235,0.2)"  },
          { label:"Active",  value:counts.active,  color:"var(--success)", border:"rgba(22,163,74,0.2)"  },
          { label:"Flagged", value:counts.flagged, color:"var(--danger)",  border:"rgba(220,38,38,0.2)"  },
        ].map(({ label, value, color, border }) => (
          <div key={label} className="px-4 py-2 rounded-xl"
            style={{ background:"var(--card)", border:`1px solid ${border}` }}>
            <span className="text-sm font-bold" style={{ color }}>{value}</span>
            <span className="text-xs ml-2" style={{ color:"var(--text-muted)" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"var(--text-muted)" }}/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, regno, class…" className="input-field pl-8"/>
        </div>
        {["all","active","flagged"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className="px-3 py-2 rounded-xl text-xs font-semibold border capitalize transition-all"
            style={{
              background:  statusFilter===s ? (s==="flagged"?"var(--danger-muted)":s==="all"?"var(--primary-muted)":"var(--success-muted)") : "var(--card)",
              color:       statusFilter===s ? (s==="flagged"?"var(--danger)":s==="all"?"var(--primary)":"var(--success)") : "var(--text-secondary)",
              borderColor: statusFilter===s ? (s==="flagged"?"rgba(220,38,38,0.3)":s==="all"?"rgba(37,99,235,0.3)":"rgba(22,163,74,0.3)") : "var(--border)",
            }}>{s==="all"?"All":s}</button>
        ))}
        <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white"
          style={{ background:"linear-gradient(135deg,#1B4D1E,#0F2D12)" }}>
          <Plus size={13}/> Add Student
        </motion.button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
        <div className="grid grid-cols-[2fr_1.2fr_1.5fr_1.2fr_2fr_1fr_0.8fr_1fr] gap-3 px-5 py-3"
          style={{ borderBottom:"1px solid var(--border)", background:"var(--bg-deep)" }}>
          {["Student","Reg No","Department","Class","Email","Status","Risk","Actions"].map(h => (
            <p key={h} className="text-[10px] font-bold uppercase tracking-wider" style={{ color:"var(--text-muted)" }}>{h}</p>
          ))}
        </div>
        {rows.map((s, i) => (
          <motion.div key={s.id}
            initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.025 }}
            className="grid grid-cols-[2fr_1.2fr_1.5fr_1.2fr_2fr_1fr_0.8fr_1fr] gap-3 px-5 py-3 table-row"
            style={{ borderBottom:"1px solid var(--border-soft)" }}>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1B4D1E] to-[#F5C800]
                              flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {s.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
              </div>
              <span className="text-sm font-medium truncate" style={{ color:"var(--text-primary)" }}>{s.name}</span>
            </div>
            <span className="text-sm font-mono flex items-center" style={{ color:"var(--text-secondary)" }}>{s.regno}</span>
            <span className="text-xs flex items-center truncate" style={{ color:"var(--text-secondary)" }}>{s.dept}</span>
            <span className="text-xs flex items-center" style={{ color:"var(--text-secondary)" }}>{s.class}</span>
            <span className="text-xs flex items-center truncate" style={{ color:"var(--text-muted)" }}>{s.email}</span>
            <div className="flex items-center">
              <span className={`badge ${s.status==="active"?"badge-success":"badge-danger"} text-[10px]`}>{s.status}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-bold" style={{ color:riskColor(s.risk) }}>{s.risk}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                style={{ background:"var(--primary-muted)", border:"1px solid rgba(37,99,235,0.2)", color:"var(--primary)" }}>
                <Pencil size={11}/>
              </button>
              <button onClick={() => setDismissed(d => new Set([...d, s.id]))}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                style={{ background:"var(--danger-muted)", border:"1px solid rgba(220,38,38,0.2)", color:"var(--danger)" }}>
                <Trash2 size={11}/>
              </button>
            </div>
          </motion.div>
        ))}
        {rows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14">
            <GraduationCap size={28} className="mb-2" style={{ color:"var(--border)" }}/>
            <p style={{ color:"var(--text-muted)" }}>No students found</p>
          </div>
        )}
        <div className="px-5 py-3 flex items-center justify-between"
          style={{ borderTop:"1px solid var(--border)", background:"var(--bg-deep)" }}>
          <p className="text-xs" style={{ color:"var(--text-muted)" }}>Showing {rows.length} students</p>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)" }}
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale:0.9, y:16 }} animate={{ scale:1, y:0 }} exit={{ scale:0.9, y:16 }}
              transition={{ type:"spring", stiffness:280, damping:24 }}
              className="w-full max-w-md rounded-2xl overflow-hidden"
              style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow-xl)" }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom:"1px solid var(--border)", background:"rgba(124,58,237,0.08)" }}>
                <h3 className="font-bold" style={{ color:"var(--text-primary)" }}>Add New Student</h3>
                <button onClick={() => setShowModal(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background:"var(--bg-deep)", color:"var(--text-muted)" }}>
                  <X size={13}/>
                </button>
              </div>
              <form onSubmit={handleAdd} className="p-5 space-y-3">
                {[
                  { label:"Full Name",      key:"name",   type:"text",  ph:"Student full name"    },
                  { label:"Register No",    key:"regno",  type:"text",  ph:"22CS101"              },
                  { label:"Email",          key:"email",  type:"email", ph:"student@college.edu"  },
                ].map(({ label, key, type, ph }) => (
                  <div key={key}>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
                           style={{ color:"var(--text-muted)" }}>{label}</label>
                    <input type={type} value={form[key]} placeholder={ph}
                      onChange={e => setForm(f => ({ ...f, [key]:e.target.value }))}
                      className="input-field" required/>
                  </div>
                ))}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
                         style={{ color:"var(--text-muted)" }}>Department</label>
                  <select value={form.dept}
                    onChange={e => setForm(f => ({ ...f, dept:e.target.value, class:"" }))}
                    className="input-field" required>
                    <option value="">Select department…</option>
                    {DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
                         style={{ color:"var(--text-muted)" }}>Class</label>
                  <select value={form.class} onChange={e => setForm(f => ({ ...f, class:e.target.value }))}
                    className="input-field" required>
                    <option value="">Select class…</option>
                    {filteredClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex gap-2 pt-1">
                  <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }}
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                    style={{ background: saved ? "var(--success)" : "linear-gradient(135deg,#1B4D1E,#0F2D12)" }}>
                    {saved ? <><CheckCircle size={13}/>Student Added</> : <><Plus size={13}/>Add Student</>}
                  </motion.button>
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl text-sm btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
