"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getFirestore,
  collection,
  query as fsQuery,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "@/app/lib/firebase";

// -------------------- Types --------------------
type Role = "student" | "landlord" | "admin";

type AdminUser = {
  id: string; // uid
  displayName?: string;
  email?: string;
  phone?: string;
  role: Role;
  disabled?: boolean;
  createdAt?: unknown; 
};

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
};

type Toast = { id: string; kind: "success" | "error" | "info"; msg: string };

// -------------------- Tiny UI primitives --------------------
function RoleBadge({ role }: { role: Role }) {
  const cls: Record<Role, string> = {
    admin: "bg-[var(--color-bright-green)] text-[var(--color-white)]",
    landlord: "bg-[var(--color-periwinkle)] text-[var(--color-white)]",
    student: "bg-[var(--color-hover-blue)] text-[var(--color-royal-blue)]",
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${cls[role]}`}>{role}</span>;
}

function ActionPill({
  variant,
  children,
  onClick,
}: {
  variant: "make-landlord" | "make-student" | "disable" | "enable" | "view";
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium " +
    "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1";
  const map: Record<string, string> = {
    "make-landlord":
      "border border-[var(--color-periwinkle)] text-[var(--color-white)] bg-[var(--color-periwinkle)] hover:opacity-90 focus:ring-[var(--color-periwinkle)]",
    "make-student":
      "border border-[var(--color-hover-blue)] text-[var(--color-royal-blue)] bg-[var(--color-hover-blue)]/90 hover:bg-[var(--color-hover-blue)] focus:ring-[var(--color-hover-blue)]",
    disable: "border border-red-500 text-white bg-red-500 hover:bg-red-600 focus:ring-red-400",
    enable:
      "border border-emerald-600 text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-400",
    view: "border border-[var(--color-hover-blue)] text-[var(--color-royal-blue)] bg-white hover:bg-[var(--color-light-blue)] focus:ring-[var(--color-hover-blue)]",
  };
  if (variant === "view") {
    return (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onClick?.();
        }}
        className={`${base} ${map[variant]}`}
      >
        {children}
      </a>
    );
  }
  return (
    <button className={`${base} ${map[variant]}`} onClick={onClick} type="button">
      {children}
    </button>
  );
}

// -------------------- Confirm Dialog --------------------
function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-[101] w-[min(520px,92vw)] rounded-2xl border border-[var(--color-hover-blue)] bg-white p-5 shadow-xl">
        <h3 className="text-lg font-semibold text-[var(--color-dark-gray)]">{title}</h3>
        <div className="mt-2 text-sm text-[var(--color-dark-gray)]">{message}</div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            className="rounded-full border border-[var(--color-hover-blue)] px-4 py-1.5 text-sm text-[var(--color-royal-blue)] hover:bg-[var(--color-light-blue)]"
            onClick={onClose}
            type="button"
          >
            {cancelText}
          </button>
          <button
            className="rounded-full bg-[var(--color-periwinkle)] px-4 py-1.5 text-sm text-white hover:opacity-95"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            type="button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------- Toasts --------------------
function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  function push(t: Omit<Toast, "id">) {
    const id = Math.random().toString(36).slice(2);
    const toast = { id, ...t };
    setToasts((p) => [...p, toast]);
    setTimeout(() => {
      setToasts((p) => p.filter((x) => x.id !== id));
    }, 3000);
  }
  function remove(id: string) {
    setToasts((p) => p.filter((x) => x.id !== id));
  }
  return { toasts, push, remove };
}

function ToastViewport({
  toasts,
  remove,
}: {
  toasts: Toast[];
  remove: (id: string) => void;
}) {
  const color: Record<Toast["kind"], string> = {
    success: "bg-emerald-600",
    error: "bg-red-600",
    info: "bg-[var(--color-periwinkle)]",
  };
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[110] flex w-[min(92vw,380px)] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto rounded-xl px-4 py-2 text-sm text-white shadow-lg ${color[t.kind]}`}
        >
          <div className="flex items-start justify-between gap-3">
            <span>{t.msg}</span>
            <button className="opacity-80 hover:opacity-100" onClick={() => remove(t.id)}>
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// -------------------- Page --------------------
export default function AdminUsersPage() {
  const db = useMemo(() => getFirestore(app), []);
  const auth = getAuth(app);
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [role, setRole] = useState<Role | "all">("all");
  const [status, setStatus] = useState<"any" | "enabled" | "disabled">("any");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  // confirm dialog state
  const [confirm, setConfirm] = useState<{
    open: boolean;
    title: string;
    message: React.ReactNode;
    onConfirm: () => void;
  }>({ open: false, title: "", message: "", onConfirm: () => {} });

  // toasts
  const { toasts, push, remove } = useToasts();

  useEffect(() => {
    setLoading(true);
    const ref = collection(db, "users");
    const qry = fsQuery(ref, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(qry, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Timestamp) })) as AdminUser[];
      setRows(list);
      setLoading(false);
    });
    return () => unsub();
  }, [db]);

  const filtered = rows.filter((u) => {
    if (role !== "all" && u.role !== role) return false;
    if (status === "enabled" && u.disabled) return false;
    if (status === "disabled" && !u.disabled) return false;
    if (q) {
      const s = q.toLowerCase();
      const hay = [u.displayName, u.email, u.phone, u.id].filter(Boolean).join(" ").toLowerCase();
      if (!hay.includes(s)) return false;
    }
    return true;
  });

  // ----- Minimal audit logger -----
  async function writeAudit(params: {
    action: "role_change" | "disable_change";
    targetUserId: string;
    before: unknown;
    after: unknown;
  }) {
    const actorId = auth.currentUser?.uid || "unknown";
    await addDoc(collection(db, "audit"), {
      ...params,
      actorId,
      createdAt: serverTimestamp(),
    });
  }

  // helpers to show confirm then run
  function confirmAction(opts: {
    title: string;
    message: React.ReactNode;
    onConfirm: () => Promise<void>;
    successMsg: string;
    errorMsg: string;
  }) {
    setConfirm({
      open: true,
      title: opts.title,
      message: opts.message,
      onConfirm: async () => {
        try {
          await opts.onConfirm();
          push({ kind: "success", msg: opts.successMsg });
        } catch (e: unknown) {
          console.error(e);
          push({ kind: "error", msg: opts.errorMsg });
        }
      },
    });
  }

  async function setUserRole(uid: string, nextRole: Role) {
    const before = rows.find((r) => r.id === uid);
    await updateDoc(doc(db, "users", uid), { role: nextRole });
    await writeAudit({
      action: "role_change",
      targetUserId: uid,
      before: { role: before?.role },
      after: { role: nextRole },
    });
  }

  async function toggleDisable(uid: string, disabled: boolean) {
    const before = rows.find((r) => r.id === uid);
    await updateDoc(doc(db, "users", uid), { disabled });
    await writeAudit({
      action: "disable_change",
      targetUserId: uid,
      before: { disabled: before?.disabled ?? false },
      after: { disabled },
    });
  }

  return (
    <section className="relative rounded-2xl border border-[var(--color-hover-blue)] bg-[var(--color-white)] p-4 shadow-sm">
      {/* Filters */}
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Users</h2>
        <div className="flex flex-wrap items-center gap-2">
          <input
            className="rounded-xl border border-[var(--color-hover-blue)] px-3 py-2"
            placeholder="Search name / email / phone / uid"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="rounded-xl border border-[var(--color-hover-blue)] px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value as Role | "all")}
          >
            <option value="all">All roles</option>
            <option value="student">Students</option>
            <option value="landlord">Landlords</option>
            <option value="admin">Admins</option>
          </select>
          <select
            className="rounded-xl border border-[var(--color-hover-blue)] px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as "any" | "enabled" | "disabled")}
          >
            <option value="any">Any status</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </header>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-light-blue)] text-left">
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2 text-center">Disabled</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-[var(--color-medium-gray)]">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-[var(--color-medium-gray)]">
                  No users found
                </td>
              </tr>
            )}
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-[var(--color-light-blue)]">
                <td className="px-3 py-2">
                  <div className="font-medium">{u.displayName || "—"}</div>
                  <div className="text-xs text-[var(--color-medium-gray)]">{u.id}</div>
                </td>
                <td className="px-3 py-2">{u.email || "—"}</td>
                <td className="px-3 py-2">{u.phone || "—"}</td>
                <td className="px-3 py-2">
                  <RoleBadge role={u.role} />
                </td>
                <td className="px-3 py-2 text-center">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      u.disabled ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {u.disabled ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    {/* Role change */}
                    {u.role !== "admin" ? (
                      <>
                        <ActionPill
                          variant="make-landlord"
                          onClick={() =>
                            confirmAction({
                              title: "Promote to landlord?",
                              message: (
                                <>
                                  You are about to change <strong>{u.displayName || u.id}</strong>
                                  s role to <strong>landlord</strong>.
                                </>
                              ),
                              onConfirm: () => setUserRole(u.id, "landlord"),
                              successMsg: "Role updated to landlord.",
                              errorMsg: "Failed to update role.",
                            })
                          }
                        >
                          Make landlord
                        </ActionPill>
                        <ActionPill
                          variant="make-student"
                          onClick={() =>
                            confirmAction({
                              title: "Change to student?",
                              message: (
                                <>
                                  You are about to set{" "}
                                  <strong>{u.displayName || u.id}</strong> s role to{" "}
                                  <strong>student</strong>.
                                </>
                              ),
                              onConfirm: () => setUserRole(u.id, "student"),
                              successMsg: "Role updated to student.",
                              errorMsg: "Failed to update role.",
                            })
                          }
                        >
                          Make student
                        </ActionPill>
                      </>
                    ) : (
                      <span className="text-xs text-[var(--color-medium-gray)]">(admin)</span>
                    )}

                    {/* Disable / Enable */}
                    {u.disabled ? (
                      <ActionPill
                        variant="enable"
                        onClick={() =>
                          confirmAction({
                            title: "Enable account?",
                            message: (
                              <>
                                This will re-enable access for{" "}
                                <strong>{u.displayName || u.id}</strong>.
                              </>
                            ),
                            onConfirm: () => toggleDisable(u.id, false),
                            successMsg: "Account enabled.",
                            errorMsg: "Failed to enable account.",
                          })
                        }
                      >
                        Enable
                      </ActionPill>
                    ) : (
                      <ActionPill
                        variant="disable"
                        onClick={() =>
                          confirmAction({
                            title: "Disable account?",
                            message: (
                              <>
                                This will prevent <strong>{u.displayName || u.id}</strong> from
                                signing in and using the app.
                              </>
                            ),
                            onConfirm: () => toggleDisable(u.id, true),
                            successMsg: "Account disabled.",
                            errorMsg: "Failed to disable account.",
                          })
                        }
                      >
                        Disable
                      </ActionPill>
                    )}

                    {/* View as */}
                    <ActionPill
                      variant="view"
                      onClick={() => {
                        window.location.href = `/admin/view-as/${u.id}`;
                      }}
                    >
                      View as
                    </ActionPill>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Overlays */}
      <ConfirmDialog
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        onConfirm={confirm.onConfirm}
        onClose={() => setConfirm((c) => ({ ...c, open: false }))}
        confirmText="Yes, continue"
        cancelText="Cancel"
      />
      <ToastViewport toasts={toasts} remove={remove} />
    </section>
  );
}
