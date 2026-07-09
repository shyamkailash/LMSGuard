import {
  GoogleAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  type Timestamp,
} from "firebase/firestore";

import { firebaseAuth } from "@/firebase/auth";
import { isFirebaseConfigured } from "@/firebase/config";
import { firestore } from "@/firebase/firestore";
import { createFirebaseSession } from "@/lib/api/auth";
import { clearStoredBackendToken } from "@/lib/api/client";

export type UserRole = "Admin" | "Invigilator" | "Student";

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  institution: string;
  department: string;
  registerNumber?: string;
  studentID?: string;
  invigilatorID?: string;
  managedId?: string;
  createdAt: Timestamp | Date | null;
};

type SignUpInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  institution: string;
  department: string;
};

function assertFirebaseConfigured() {
  if (!isFirebaseConfigured() || !firebaseAuth || !firestore) {
    throw new Error("Authentication is unavailable in local demo mode.");
  }
}

function getFirebaseAuth() {
  assertFirebaseConfigured();
  return firebaseAuth!;
}

function getFirebaseFirestore() {
  assertFirebaseConfigured();
  return firestore!;
}

function userProfileRef(uid: string) {
  return doc(getFirebaseFirestore(), "users", uid);
}

export function getRoleRedirect(role: UserRole) {
  if (role === "Student") {
    return "/student";
  }

  if (role === "Invigilator") {
    return "/invigilator";
  }

  return "/admin";
}

export function normalizeRole(role: string | undefined | null): UserRole {
  if (role === "Student" || role === "Invigilator" || role === "Admin") {
    return role;
  }

  return "Student";
}

function inferRoleFromEmail(email: string | null): UserRole {
  const normalized = email?.toLowerCase() ?? "";
  if (normalized.includes("student")) {
    return "Student";
  }

  if (normalized.includes("invigilator") || normalized.includes("faculty")) {
    return "Invigilator";
  }

  return "Admin";
}

export function getManagedAccountEmail(idOrEmail: string, role: UserRole) {
  const normalized = idOrEmail.trim().toLowerCase();
  if (normalized.includes("@")) {
    return normalized;
  }

  if (role === "Student") {
    return `${normalized}@students.lmsguard.local`;
  }

  if (role === "Invigilator") {
    return `${normalized}@invigilators.lmsguard.local`;
  }

  return normalized;
}

export function requiresEmailVerification() {
  return process.env.NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION === "true";
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  assertFirebaseConfigured();
  const snapshot = await getDoc(userProfileRef(uid));

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    uid,
    name: String(data.name ?? ""),
    email: String(data.email ?? ""),
    role: normalizeRole(String(data.role ?? "")),
    institution: String(data.institution ?? ""),
    department: String(data.department ?? ""),
    registerNumber: data.registerNumber ? String(data.registerNumber) : undefined,
    studentID: data.studentID ? String(data.studentID) : undefined,
    invigilatorID: data.invigilatorID ? String(data.invigilatorID) : undefined,
    managedId: data.managedId ? String(data.managedId) : undefined,
    createdAt: (data.createdAt as Timestamp | Date | null) ?? null,
  };
}

export async function ensureBackendSession(
  user: User,
  profile?: UserProfile | null,
) {
  const email = profile?.email || user.email;
  if (!email) {
    throw new Error("Firebase did not return an email address for this account.");
  }

  return createFirebaseSession({
    uid: user.uid,
    email,
    name: profile?.name || user.displayName || "LMSGuard User",
    role: profile?.role || inferRoleFromEmail(email),
  });
}

export async function tryEnsureBackendSession(
  user: User,
  profile?: UserProfile | null,
) {
  try {
    await ensureBackendSession(user, profile);
    return "";
  } catch (error) {
    return error instanceof Error ? error.message : "Backend session sync failed.";
  }
}

export async function createUserProfile(
  user: User,
  profile: Partial<Omit<UserProfile, "uid" | "createdAt">> = {},
) {
  assertFirebaseConfigured();
  const existing = await getDoc(userProfileRef(user.uid));

  if (existing.exists()) {
    return getUserProfile(user.uid);
  }

  const nextProfile = {
    uid: user.uid,
    name: profile.name || user.displayName || "LMSGuard User",
    email: profile.email || user.email || "",
    role: profile.role || inferRoleFromEmail(user.email),
    institution: profile.institution || "Institution workspace",
    department: profile.department || "General",
    createdAt: serverTimestamp(),
  };

  await setDoc(userProfileRef(user.uid), nextProfile);
  return getUserProfile(user.uid);
}

export async function signUpWithEmail(input: SignUpInput) {
  const auth = getFirebaseAuth();
  await setPersistence(auth, browserLocalPersistence);
  const credential = await createUserWithEmailAndPassword(
    auth,
    input.email,
    input.password,
  );

  await updateProfile(credential.user, { displayName: input.name });
  await createUserProfile(credential.user, {
    name: input.name,
    email: input.email,
    role: input.role,
    institution: input.institution,
    department: input.department,
  });
  const backendSessionError = await tryEnsureBackendSession(credential.user, {
    uid: credential.user.uid,
    name: input.name,
    email: input.email,
    role: input.role,
    institution: input.institution,
    department: input.department,
    createdAt: null,
  });
  if (backendSessionError) {
    console.warn(backendSessionError);
  }
  await sendEmailVerification(credential.user);

  return credential.user;
}

export async function loginWithEmail(
  email: string,
  password: string,
  rememberMe: boolean,
) {
  const auth = getFirebaseAuth();
  await setPersistence(
    auth,
    rememberMe ? browserLocalPersistence : browserSessionPersistence,
  );
  const credential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const profile = await createUserProfile(credential.user);
  const backendSessionError = await tryEnsureBackendSession(credential.user, profile);
  if (backendSessionError) {
    console.warn(backendSessionError);
  }
  return credential.user;
}

export async function loginWithGoogle(rememberMe: boolean) {
  const auth = getFirebaseAuth();
  await setPersistence(
    auth,
    rememberMe ? browserLocalPersistence : browserSessionPersistence,
  );
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const credential = await signInWithPopup(auth, provider);

  const profile = await createUserProfile(credential.user);
  const backendSessionError = await tryEnsureBackendSession(credential.user, profile);
  if (backendSessionError) {
    console.warn(backendSessionError);
  }
  return credential.user;
}

export async function resendCurrentUserEmailVerification() {
  const auth = getFirebaseAuth();

  if (!auth.currentUser) {
    throw new Error("No authenticated user is available.");
  }

  await sendEmailVerification(auth.currentUser);
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(getFirebaseAuth(), email);
}

export async function changeCurrentUserPassword(currentPassword: string, nextPassword: string) {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;

  if (!user?.email) {
    throw new Error("No signed-in email user is available.");
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, nextPassword);
}

export async function logoutUser() {
  clearStoredBackendToken();

  if (!isFirebaseConfigured() || !firebaseAuth) {
    return;
  }

  await signOut(firebaseAuth);
}

export function getFriendlyAuthError(error: unknown) {
  const message = error instanceof Error ? error.message : "Authentication failed.";
  const code =
    typeof error === "object" && error && "code" in error
      ? String(error.code)
      : "";

  if (code === "auth/configuration-not-found" || message.includes("auth/configuration-not-found")) {
    return "Firebase Authentication is not enabled or configured for this project. In Firebase Console, open Authentication, click Get started, and enable Email/Password sign-in.";
  }

  if (code === "auth/operation-not-allowed" || message.includes("auth/operation-not-allowed")) {
    return "This Firebase sign-in method is disabled. Enable Email/Password or Google in Firebase Console > Authentication > Sign-in method.";
  }

  if (code === "auth/invalid-credential" || message.includes("auth/invalid-credential")) {
    return "Invalid email or password.";
  }

  if (code === "auth/email-already-in-use" || message.includes("auth/email-already-in-use")) {
    return "This email already has an LMSGuard account.";
  }

  if (code === "auth/weak-password" || message.includes("auth/weak-password")) {
    return "Password must be at least 6 characters.";
  }

  if (code === "auth/too-many-requests" || message.includes("auth/too-many-requests")) {
    return "Firebase temporarily blocked this account or device because of too many attempts. Wait a few minutes before trying again, or use password reset if you forgot the password.";
  }

  if (code === "auth/popup-closed-by-user" || message.includes("auth/popup-closed-by-user")) {
    return "Google sign-in was closed before completion.";
  }

  if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
    return "The backend is not reachable, so LMSGuard cannot finish the secure app session. Start the backend on http://localhost:8000 and refresh the page.";
  }

  return message;
}
