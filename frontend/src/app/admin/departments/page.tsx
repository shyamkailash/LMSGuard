"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/components/AdminLayout";
import { DEPARTMENTS, ALL_CLASSES } from "@/data/adminData";
import { Building2, Plus, Pencil, ChevronRight, X, CheckCircle } from "lucide-react";

export default function DepartmentsPage() {
  const [showModal, setShowModal] = useState(false);
  const [form,      setForm]      = useState({ name:"", code:"", hod:"" });
  const [saved,     setSaved]     = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    setSaved(true);
    await new Promise(r => setTimeout(r, 900));
    setSaved(false); setShowModal(false);
    setForm({ name:"", code:"", hod:"" });
  }

  return (
    <AdminLayout title="Departments" subtitle="Academic department management">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex flex-wrap gap-3">
          {[
            { label:"Total Departments", value:DEPARTMENTS.length, color:"var(--primary)" },
            { label:"Total Classes",     value:ALL_CLASSES.length, color:"var(--primary)"  },
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
          <Plus size={13}/> Add Department
        </motion.button>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {DEPARTMENTS.map((dept, i) => {
          const deptClasses = ALL_CLASSES.filter(c => c.dept === dept.name);
          return (
            <motion.div key={dept.id}
              initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
              whileHover={{ y:-3, transition:{ duration:0.18 } }}
              className="rounded-2xl p-4"
              style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background:"var(--purple-muted)", border:"1px solid rgba(27,77,30,0.2)" }}>
                  <Building2 size={17} style={{ color:"var(--primary)" }}/>
                </div>
                <span className="badge badge-primary text-[10px]">{dept.code}</span>
              </div>
              <h3 className="font-bold text-sm mb-1" style={{ color:"var(--text-primary)" }}>{dept.name}</h3>
              <p className="text-[11px] mb-3" style={{ color:"var(--text-muted)" }}>HOD: {dept.hod}</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { label:"Students", value:dept.students, color:"var(--primary)" },
                  { label:"Classes",  value:deptClasses.length, color:"var(--primary)" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-xl p-2 text-center"
                    style={{ background:"var(--bg-deep)", border:"1px solid var(--border)" }}>
                    <p className="text-lg font-bold" style={{ color }}>{value}</p>
                    <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>{label}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5">
                <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ background:"var(--primary-muted)", color:"var(--primary)", border:"1px solid rgba(37,99,235,0.2)" }}>
                  <Pencil size={10}/> Edit
                </button>
                <a href="/admin/classes" className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ background:"var(--purple-muted)", color:"var(--primary)", border:"1px solid rgba(27,77,30,0.2)" }}>
                  Classes <ChevronRight size={10}/>
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Classes breakdown table */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
        className="rounded-2xl overflow-hidden"
        style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
        <div className="px-5 py-4" style={{ borderBottom:"1px solid var(--border)", background:"var(--bg-deep)" }}>
          <h3 className="font-semibold text-sm" style={{ color:"var(--text-primary)" }}>All Classes Overview</h3>
        </div>
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 px-5 py-3"
          style={{ borderBottom:"1px solid var(--border)", background:"var(--bg-deep)" }}>
          {["Class","Department","Year","Section","Enrolled"].map(h => (
            <p key={h} className="text-[10px] font-bold uppercase tracking-wider" style={{ color:"var(--text-muted)" }}>{h}</p>
          ))}
        </div>
        {ALL_CLASSES.map((c, i) => (
          <div key={c.id}
            className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 px-5 py-3 table-row"
            style={{ borderBottom:"1px solid var(--border-soft)" }}>
            <p className="text-sm font-semibold flex items-center" style={{ color:"var(--text-primary)" }}>{c.name}</p>
            <p className="text-sm flex items-center" style={{ color:"var(--text-secondary)" }}>{c.dept}</p>
            <p className="text-sm flex items-center" style={{ color:"var(--text-muted)" }}>{c.year}</p>
            <p className="text-sm flex items-center" style={{ color:"var(--text-muted)" }}>{c.section}</p>
            <p className="text-sm font-bold flex items-center" style={{ color:"var(--primary)" }}>{c.strength}</p>
          </div>
        ))}
      </motion.div>

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
                <h3 className="font-bold" style={{ color:"var(--text-primary)" }}>Add Department</h3>
                <button onClick={() => setShowModal(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background:"var(--bg-deep)", color:"var(--text-muted)" }}>
                  <X size={13}/>
                </button>
              </div>
              <form onSubmit={handleAdd} className="p-5 space-y-3">
                {[
                  { label:"Department Name", key:"name", ph:"e.g. Computer Science" },
                  { label:"Code",            key:"code", ph:"e.g. CS"               },
                  { label:"HOD Name",        key:"hod",  ph:"Dr. Full Name"         },
                ].map(({ label, key, ph }) => (
                  <div key={key}>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
                           style={{ color:"var(--text-muted)" }}>{label}</label>
                    <input type="text" value={form[key]} placeholder={ph}
                      onChange={e => setForm(f => ({ ...f, [key]:e.target.value }))}
                      className="input-field" required/>
                  </div>
                ))}
                <div className="flex gap-2 pt-1">
                  <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }} type="submit"
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                    style={{ background: saved?"var(--success)":"linear-gradient(135deg,#1B4D1E,#0F2D12)" }}>
                    {saved ? <><CheckCircle size={13}/>Added</> : <><Plus size={13}/>Add Department</>}
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
