"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/components/AdminLayout";
import { ALL_INVIGILATORS, DEPARTMENTS, ALL_CLASSES } from "@/data/adminData";
import { Search, Plus, Pencil, Trash2, Key, X, Eye, CheckCircle } from "lucide-react";

export default function InvigilatorsPage() {
  const [search,      setSearch]      = useState("");
  const [filter,      setFilter]      = useState("all");
  const [showModal,   setShowModal]   = useState(false);
  const [showPerm,    setShowPerm]    = useState(null); // invigilator id for perm modal
  const [removed,     setRemoved]     = useState(new Set());
  const [form,        setForm]        = useState({ name:"", email:"", dept:"", classes:[] });
  const [saved,       setSaved]       = useState(false);

  const rows = ALL_INVIGILATORS.filter(inv => !removed.has(inv.id)).filter(inv => {
    const q = search.toLowerCase();
    return (inv.name.toLowerCase().includes(q) || inv.email.toLowerCase().includes(q)) &&
           (filter==="all" || inv.status===filter);
  });

  async function handleAdd(e) {
    e.preventDefault();
    setSaved(true);
    await new Promise(r => setTimeout(r, 900));
    setSaved(false); setShowModal(false);
    setForm({ name:"", email:"", dept:"", classes:[] });
  }

  function toggleClass(id) {
    setForm(f => ({
      ...f,
      classes: f.classes.includes(id) ? f.classes.filter(c=>c!==id) : [...f.classes, id],
    }));
  }

  const counts = {
    total:    ALL_INVIGILATORS.length,
    active:   ALL_INVIGILATORS.filter(i=>i.status==="active").length,
    inactive: ALL_INVIGILATORS.filter(i=>i.status==="inactive").length,
  };

  const permInv = ALL_INVIGILATORS.find(i => i.id === showPerm);

  return (
    <AdminLayout title="Invigilators" subtitle="Manage invigilator accounts and permissions">
      {/* Stats */}
      <div className="flex flex-wrap gap-3 mb-5">
        {[
          { label:"Total",    value:counts.total,    color:"var(--primary)", border:"rgba(37,99,235,0.2)"  },
          { label:"Active",   value:counts.active,   color:"var(--success)", border:"rgba(22,163,74,0.2)"  },
          { label:"Inactive", value:counts.inactive, color:"var(--warning)", border:"rgba(217,119,6,0.2)"  },
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
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search name or email…" className="input-field pl-8"/>
        </div>
        {["all","active","inactive"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-2 rounded-xl text-xs font-semibold border capitalize transition-all"
            style={{
              background:  filter===f ? (f==="inactive"?"var(--warning-muted)":f==="all"?"var(--primary-muted)":"var(--success-muted)") : "var(--card)",
              color:       filter===f ? (f==="inactive"?"var(--warning)":f==="all"?"var(--primary)":"var(--success)") : "var(--text-secondary)",
              borderColor: filter===f ? (f==="inactive"?"rgba(217,119,6,0.3)":f==="all"?"rgba(37,99,235,0.3)":"rgba(22,163,74,0.3)") : "var(--border)",
            }}>{f==="all"?"All":f}</button>
        ))}
        <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white"
          style={{ background:"linear-gradient(135deg,#1B4D1E,#0F2D12)" }}>
          <Plus size={13}/> Add Invigilator
        </motion.button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
        <div className="grid grid-cols-[2fr_2fr_1.5fr_2fr_1fr_1fr_1.2fr] gap-3 px-5 py-3"
          style={{ borderBottom:"1px solid var(--border)", background:"var(--bg-deep)" }}>
          {["Name","Email","Department","Classes","Exams","Status","Actions"].map(h => (
            <p key={h} className="text-[10px] font-bold uppercase tracking-wider" style={{ color:"var(--text-muted)" }}>{h}</p>
          ))}
        </div>
        {rows.map((inv, i) => (
          <motion.div key={inv.id}
            initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.04 }}
            className="grid grid-cols-[2fr_2fr_1.5fr_2fr_1fr_1fr_1.2fr] gap-3 px-5 py-3 table-row"
            style={{ borderBottom:"1px solid var(--border-soft)" }}>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1B4D1E] to-[#F5C800]
                              flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {inv.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
              </div>
              <span className="text-sm font-medium truncate" style={{ color:"var(--text-primary)" }}>{inv.name}</span>
            </div>
            <span className="text-xs flex items-center truncate" style={{ color:"var(--text-muted)" }}>{inv.email}</span>
            <span className="text-xs flex items-center truncate" style={{ color:"var(--text-secondary)" }}>{inv.dept}</span>
            <div className="flex items-center gap-1 flex-wrap">
              {inv.permissions.map(p => (
                <span key={p} className="badge badge-primary text-[9px]">{p}</span>
              ))}
            </div>
            <div className="flex items-center">
              <span className="badge badge-primary text-[9px]">{inv.exams.length} exams</span>
            </div>
            <div className="flex items-center">
              <span className={`badge ${inv.status==="active"?"badge-success":"badge-warning"} text-[10px]`}>{inv.status}</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background:"var(--primary-muted)", border:"1px solid rgba(37,99,235,0.2)", color:"var(--primary)" }}>
                <Pencil size={11}/>
              </button>
              <button onClick={() => setShowPerm(inv.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background:"var(--purple-muted)", border:"1px solid rgba(27,77,30,0.2)", color:"var(--primary)" }}>
                <Key size={11}/>
              </button>
              <button onClick={() => setRemoved(r => new Set([...r, inv.id]))}
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background:"var(--danger-muted)", border:"1px solid rgba(220,38,38,0.2)", color:"var(--danger)" }}>
                <Trash2 size={11}/>
              </button>
            </div>
          </motion.div>
        ))}
        {rows.length === 0 && (
          <div className="flex items-center justify-center py-14">
            <p style={{ color:"var(--text-muted)" }}>No invigilators found</p>
          </div>
        )}
        <div className="px-5 py-3" style={{ borderTop:"1px solid var(--border)", background:"var(--bg-deep)" }}>
          <p className="text-xs" style={{ color:"var(--text-muted)" }}>Showing {rows.length} invigilators</p>
        </div>
      </div>

      {/* Permissions Modal */}
      <AnimatePresence>
        {showPerm && permInv && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)" }}
            onClick={() => setShowPerm(null)}>
            <motion.div initial={{ scale:0.9, y:16 }} animate={{ scale:1, y:0 }} exit={{ scale:0.9 }}
              transition={{ type:"spring", stiffness:280, damping:24 }}
              className="w-full max-w-sm rounded-2xl overflow-hidden"
              style={{ background:"var(--card)", border:"1px solid rgba(124,58,237,0.3)", boxShadow:"var(--shadow-xl)" }}
              onClick={e=>e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom:"1px solid var(--border)", background:"rgba(124,58,237,0.08)" }}>
                <h3 className="font-bold" style={{ color:"var(--text-primary)" }}>
                  Permissions — {permInv.name}
                </h3>
                <button onClick={() => setShowPerm(null)}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background:"var(--bg-deep)", color:"var(--text-muted)" }}>
                  <X size={13}/>
                </button>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color:"var(--text-muted)" }}>Allowed Classes</p>
                {ALL_CLASSES.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-2.5 rounded-xl"
                    style={{ background:"var(--bg-deep)", border:"1px solid var(--border)" }}>
                    <span className="text-sm" style={{ color:"var(--text-primary)" }}>{c.name}</span>
                    {permInv.permissions.includes(c.id)
                      ? <span className="badge badge-success text-[9px]">Allowed</span>
                      : <span className="badge text-[9px]" style={{ background:"var(--bg-deep)", color:"var(--text-muted)", border:"1px solid var(--border)" }}>Restricted</span>
                    }
                  </div>
                ))}
                <button onClick={() => setShowPerm(null)}
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-white mt-2"
                  style={{ background:"linear-gradient(135deg,#1B4D1E,#0F2D12)" }}>
                  Save Permissions
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)" }}
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale:0.9, y:16 }} animate={{ scale:1, y:0 }} exit={{ scale:0.9 }}
              transition={{ type:"spring", stiffness:280, damping:24 }}
              className="w-full max-w-md rounded-2xl overflow-hidden"
              style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow-xl)" }}
              onClick={e=>e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom:"1px solid var(--border)", background:"rgba(124,58,237,0.08)" }}>
                <h3 className="font-bold" style={{ color:"var(--text-primary)" }}>Add Invigilator</h3>
                <button onClick={() => setShowModal(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background:"var(--bg-deep)", color:"var(--text-muted)" }}>
                  <X size={13}/>
                </button>
              </div>
              <form onSubmit={handleAdd} className="p-5 space-y-3">
                {[
                  { label:"Full Name", key:"name",  type:"text",  ph:"Invigilator name"       },
                  { label:"Email",     key:"email", type:"email", ph:"inv@college.edu"         },
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
                    onChange={e => setForm(f => ({ ...f, dept:e.target.value, classes:[] }))}
                    className="input-field">
                    <option value="">Select department…</option>
                    {DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2"
                         style={{ color:"var(--text-muted)" }}>Allowed Classes</label>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {ALL_CLASSES.map(c => (
                      <label key={c.id} className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg"
                        style={{ background:"var(--bg-deep)" }}>
                        <input type="checkbox" checked={form.classes.includes(c.id)}
                          onChange={() => toggleClass(c.id)} className="accent-purple-600"/>
                        <span className="text-sm" style={{ color:"var(--text-primary)" }}>{c.name}</span>
                        <span className="text-[10px] ml-auto" style={{ color:"var(--text-muted)" }}>{c.dept}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }} type="submit"
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                    style={{ background: saved?"var(--success)":"linear-gradient(135deg,#1B4D1E,#0F2D12)" }}>
                    {saved ? <><CheckCircle size={13}/>Added</> : <><Plus size={13}/>Add Invigilator</>}
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
