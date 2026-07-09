"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { KeyRound, Trash2, UsersRound, UserPlus } from "lucide-react";

import { useToast } from "@/Providers/ToastProvider";
import { Button } from "@/components/ui/button";
import { firebaseConfig, isFirebaseConfigured } from "@/firebase/config";
import { firestore } from "@/firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { getManagedAccountEmail, type UserRole } from "@/services/authService";

type ManagedRole = Extract<UserRole, "Student" | "Invigilator">;
type AccountCollection = "students" | "invigilators";

type ManagedAccount = {
  id: string;
  name: string;
  managedId: string;
  department: string;
  status: string;
  authEmail: string;
  authUid: string;
};

type BulkAccountRow = {
  managedId: string;
  name: string;
  department: string;
  password: string;
};

async function createFirebaseAuthAccount(email: string, password: string) {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  );

  const data = await response.json() as { localId?: string; error?: { message?: string } };
  if (!response.ok || !data.localId) {
    throw new Error(data.error?.message?.replaceAll("_", " ") || "Firebase could not create this account.");
  }

  return data.localId;
}

function normalizeManagedId(value: string, role: ManagedRole) {
  const trimmed = value.trim();
  if (role === "Invigilator" && trimmed.includes("@")) {
    return trimmed.toLowerCase();
  }

  return role === "Student" ? trimmed : trimmed.toUpperCase();
}

function parseBulkRows(value: string, fallbackPassword: string): BulkAccountRow[] {
  let activeDepartment = "";
  const rows: BulkAccountRow[] = [];

  for (const rawLine of value.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || /^id[\s,|\t]+name/i.test(line) || /^student\s*id[\s,|\t]+name/i.test(line)) {
      continue;
    }

    const departmentMatch = line.match(/^(department|dept)\s*[:=-]\s*(.+)$/i);
    if (departmentMatch?.[2]) {
      activeDepartment = departmentMatch[2].trim() || "";
      continue;
    }

    const separator = line.includes("\t") ? "\t" : line.includes("|") ? "|" : ",";
    const [managedId = "", name = "", third = "", fourth = ""] = line
      .split(separator)
      .map((item) => item.trim());

    if (!managedId) {
      continue;
    }

    const thirdLooksLikePassword = third.length >= 6 || /[@#$%]/.test(third);
    const department = fourth ? third || activeDepartment : thirdLooksLikePassword ? activeDepartment : third || activeDepartment;
    const password = fourth || (thirdLooksLikePassword ? third : fallbackPassword);

    rows.push({
      managedId,
      name,
      department: department || "General",
      password: password || fallbackPassword,
    });
  }

  return rows;
}

export function ManagedAccountPanel() {
  const { notify } = useToast();
  const { userProfile } = useAuth();
  const [role, setRole] = useState<ManagedRole>("Student");
  const [name, setName] = useState("");
  const [managedId, setManagedId] = useState("");
  const [department, setDepartment] = useState("");
  const [defaultPassword, setDefaultPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [bulkRows, setBulkRows] = useState("");
  const [bulkSaving, setBulkSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [createdStudents, setCreatedStudents] = useState<ManagedAccount[]>([]);
  const [createdInvigilators, setCreatedInvigilators] = useState<ManagedAccount[]>([]);

  const normalizedManagedId = useMemo(() => normalizeManagedId(managedId, role), [managedId, role]);
  const loginEmail = useMemo(() => getManagedAccountEmail(managedId, role), [managedId, role]);
  const canCreate = userProfile?.role === "Admin";

  useEffect(() => {
    if (!isFirebaseConfigured() || !firestore || !canCreate) {
      return;
    }

    function mapAccounts(collectionName: "students" | "invigilators", update: (accounts: ManagedAccount[]) => void) {
      return onSnapshot(collection(firestore!, collectionName), (snapshot) => {
        update(snapshot.docs.map((item) => {
          const data = item.data();
          return {
            id: item.id,
            name: String(data.name ?? ""),
            managedId: String(data.managedId ?? data.studentID ?? data.invigilatorID ?? item.id),
            department: String(data.department ?? ""),
            status: String(data.status ?? "Active"),
            authEmail: String(data.authEmail ?? data.email ?? ""),
            authUid: String(data.authUid ?? data.uid ?? ""),
          };
        }));
      });
    }

    const unsubscribeStudents = mapAccounts("students", setCreatedStudents);
    const unsubscribeInvigilators = mapAccounts("invigilators", setCreatedInvigilators);

    return () => {
      unsubscribeStudents();
      unsubscribeInvigilators();
    };
  }, [canCreate]);

  function changeRole(nextRole: ManagedRole) {
    setRole(nextRole);
    setManagedId("");
  }

  async function createManagedAccount() {
    if (!canCreate) {
      notify({ tone: "error", title: "Only Admin can create managed IDs" });
      return;
    }

    if (!managedId.trim()) {
      notify({ tone: "error", title: `Enter a ${role === "Student" ? "Student ID" : "Invigilator ID or email"}` });
      return;
    }

    if (defaultPassword.trim().length < 6) {
      notify({ tone: "error", title: "Default password must be at least 6 characters" });
      return;
    }

    if (!isFirebaseConfigured() || !firestore) {
      notify({ tone: "error", title: "Firebase is not configured", body: "Add Firebase env values before creating real login IDs." });
      return;
    }

    setSaving(true);
    try {
      const uid = await createFirebaseAuthAccount(loginEmail, defaultPassword);
      const displayEmail = normalizedManagedId.includes("@") ? normalizedManagedId.toLowerCase() : "";
      const profile = {
        uid,
        name: name.trim() || `${role} ${normalizedManagedId}`,
        email: displayEmail,
        authEmail: loginEmail,
        loginId: normalizedManagedId,
        role,
        department,
        institution: userProfile?.institution || "Institution workspace",
        managedId: normalizedManagedId,
        registerNumber: role === "Student" ? normalizedManagedId : null,
        studentID: role === "Student" ? normalizedManagedId : null,
        invigilatorID: role === "Invigilator" ? normalizedManagedId : null,
        mustChangePassword: true,
        status: "Active",
        createdBy: userProfile?.uid ?? null,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(firestore, "users", uid), profile);
      await setDoc(doc(firestore, role === "Student" ? "students" : "invigilators", normalizedManagedId), {
        ...profile,
        authUid: uid,
        updatedAt: serverTimestamp(),
      });

      notify({
        tone: "success",
        title: `${role} login ID created`,
        body: `Login ID: ${normalizedManagedId} | Password: ${defaultPassword}`,
      });
      setName("");
      setManagedId("");
    } catch (error) {
      notify({
        tone: "error",
        title: "Account creation failed",
        body: error instanceof Error ? error.message : "Try another ID or password.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function createBulkAccounts() {
    if (!canCreate) {
      notify({ tone: "error", title: "Only Admin can create managed IDs" });
      return;
    }

    if (!isFirebaseConfigured() || !firestore) {
      notify({ tone: "error", title: "Firebase is not configured", body: "Add Firebase env values before creating real login IDs." });
      return;
    }

    const rows = parseBulkRows(bulkRows, defaultPassword);
    if (rows.length === 0) {
      notify({ tone: "error", title: "Paste at least one account row" });
      return;
    }

    const weakPasswordRow = rows.find((row) => row.password.trim().length < 6);
    if (weakPasswordRow) {
      notify({ tone: "error", title: `Password is too short for ${weakPasswordRow.managedId}` });
      return;
    }

    setBulkSaving(true);
    try {
      for (const row of rows) {
        const rowManagedId = normalizeManagedId(row.managedId, role);
        const rowAuthEmail = getManagedAccountEmail(rowManagedId, role);
        const uid = await createFirebaseAuthAccount(rowAuthEmail, row.password);
        const displayEmail = rowManagedId.includes("@") ? rowManagedId.toLowerCase() : "";
        const profile = {
          uid,
          name: row.name || `${role} ${rowManagedId}`,
          email: displayEmail,
          authEmail: rowAuthEmail,
          loginId: rowManagedId,
          role,
          department: row.department || "General",
          institution: userProfile?.institution || "Institution workspace",
          managedId: rowManagedId,
          registerNumber: role === "Student" ? rowManagedId : null,
          studentID: role === "Student" ? rowManagedId : null,
          invigilatorID: role === "Invigilator" ? rowManagedId : null,
          mustChangePassword: true,
          status: "Active",
          createdBy: userProfile?.uid ?? null,
          createdAt: serverTimestamp(),
        };

        await setDoc(doc(firestore, "users", uid), profile);
        await setDoc(doc(firestore, role === "Student" ? "students" : "invigilators", rowManagedId), {
          ...profile,
          authUid: uid,
          updatedAt: serverTimestamp(),
        });
      }

      notify({
        tone: "success",
        title: `${rows.length} ${role.toLowerCase()} accounts created`,
        body: "They are now visible in the created accounts list.",
      });
      setBulkRows("");
    } catch (error) {
      notify({
        tone: "error",
        title: "Bulk creation stopped",
        body: error instanceof Error ? error.message : "Check the row that failed, then try again.",
      });
    } finally {
      setBulkSaving(false);
    }
  }

  async function removeManagedAccount(collectionName: AccountCollection, account: ManagedAccount) {
    if (!canCreate || !isFirebaseConfigured() || !firestore) {
      notify({ tone: "error", title: "Only Admin can remove dashboard accounts" });
      return;
    }

    setDeletingId(`${collectionName}:${account.id}`);
    try {
      await deleteDoc(doc(firestore, collectionName, account.id));
      if (account.authUid) {
        await deleteDoc(doc(firestore, "users", account.authUid));
      }

      notify({
        tone: "success",
        title: "Account removed from dashboard",
        body: `${account.managedId} was removed from Firestore account lists.`,
      });
    } catch (error) {
      notify({
        tone: "error",
        title: "Could not remove account",
        body: error instanceof Error ? error.message : "Check Firestore rules and try again.",
      });
    } finally {
      setDeletingId("");
    }
  }

  return (
    <section className="aurora-card p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <p className="text-sm font-medium text-cyan-200">Admin account creation</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-50">Create Student and Invigilator IDs</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Admin creates the login ID and default password first. Students and invigilators use only those credentials to reach their own dashboards.
          </p>
        </div>
        <div className="flex rounded-2xl border border-white/8 bg-white/[0.04] p-1">
          {(["Student", "Invigilator"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => changeRole(item)}
              className={`rounded-xl px-3 py-2 text-sm transition ${
                role === item
                  ? "bg-cyan-400 text-slate-950"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
        <label className="block">
          <span className="text-sm text-zinc-400">Full name</span>
          <input className="aurora-input mt-2" value={name} onChange={(event) => setName(event.target.value)} placeholder={`${role} name`} />
        </label>
        <label className="block">
          <span className="text-sm text-zinc-400">{role === "Student" ? "Student ID" : "Invigilator ID or email"}</span>
          <input className="aurora-input mt-2" value={managedId} onChange={(event) => setManagedId(event.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm text-zinc-400">Department</span>
          <input className="aurora-input mt-2" value={department} onChange={(event) => setDepartment(event.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm text-zinc-400">Default password</span>
          <input className="aurora-input mt-2" value={defaultPassword} onChange={(event) => setDefaultPassword(event.target.value)} />
        </label>
        <div className="flex items-end">
          <Button disabled={saving || !canCreate} onClick={createManagedAccount} className="h-11 w-full bg-blue-500 hover:bg-blue-400">
            <UserPlus className="size-4" />
            {saving ? "Creating..." : `Create ${role}`}
          </Button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/[0.035] p-4 text-sm text-zinc-400 lg:flex-row lg:items-center lg:justify-between">
        <span className="inline-flex items-center gap-2">
          <KeyRound className="size-4 text-cyan-200" />
          Login ID: <span className="font-medium text-zinc-100">{normalizedManagedId || managedId}</span>
        </span>
        <span className="text-xs">Firebase Auth email is kept hidden internally.</span>
      </div>

      <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.035] p-4">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
          <div>
            <h3 className="text-sm font-medium text-zinc-100">Bulk create {role.toLowerCase()} accounts</h3>
            <p className="mt-1 text-sm leading-6 text-zinc-500">
              For department-wise lists, write Department: CSE once, then add ID, Name, Password rows below it.
            </p>
          </div>
          <Button disabled={bulkSaving || !canCreate} onClick={createBulkAccounts} className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">
            <UserPlus className="size-4" />
            {bulkSaving ? "Creating..." : "Create bulk"}
          </Button>
        </div>
        <textarea
          className="mt-4 min-h-36 w-full resize-y rounded-2xl border border-white/10 bg-white/[0.055] p-3 text-sm text-zinc-100 outline-none transition focus:border-cyan-300/35 focus:ring-4 focus:ring-cyan-500/10"
          value={bulkRows}
          onChange={(event) => setBulkRows(event.target.value)}
          disabled={!canCreate || bulkSaving}
          spellCheck={false}
        />
        <p className="mt-2 text-xs text-zinc-500">
          Example: Department: CSE | 714924247097, Anu Kumar, LMS@12345
        </p>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <CreatedAccountList
          title="Created students"
          collectionName="students"
          accounts={createdStudents}
          emptyText="No student accounts created yet."
          deletingId={deletingId}
          onRemove={removeManagedAccount}
        />
        <CreatedAccountList
          title="Created invigilators"
          collectionName="invigilators"
          accounts={createdInvigilators}
          emptyText="No invigilator accounts created yet."
          deletingId={deletingId}
          onRemove={removeManagedAccount}
        />
      </div>
    </section>
  );
}

function CreatedAccountList({
  title,
  collectionName,
  accounts,
  emptyText,
  deletingId,
  onRemove,
}: {
  title: string;
  collectionName: AccountCollection;
  accounts: ManagedAccount[];
  emptyText: string;
  deletingId: string;
  onRemove: (collectionName: AccountCollection, account: ManagedAccount) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="inline-flex items-center gap-2 text-sm font-medium text-zinc-100">
          <UsersRound className="size-4 text-cyan-200" />
          {title}
        </h3>
        <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-100">{accounts.length}</span>
      </div>

      <div className="mt-4 max-h-72 space-y-3 overflow-auto pr-1">
        {accounts.length === 0 ? (
          <p className="rounded-xl border border-white/8 bg-white/[0.03] p-3 text-sm text-zinc-500">{emptyText}</p>
        ) : accounts.map((account) => {
          const isDeleting = deletingId === `${collectionName}:${account.id}`;
          return (
          <div key={account.id} className="rounded-xl border border-white/8 bg-black/10 p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-100">{account.name || account.managedId}</p>
                <p className="mt-1 text-xs text-zinc-500">{account.department || "No department"}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-100">{account.status}</span>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => onRemove(collectionName, account)}
                  className="grid size-8 place-items-center rounded-lg border border-red-300/20 text-red-200 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Remove ${account.managedId}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
            <p className="mt-3 text-xs text-zinc-400">
              Login ID: <span className="font-medium text-zinc-100">{account.managedId}</span>
            </p>
          </div>
        );
        })}
      </div>
    </div>
  );
}
