export type UserRole = "admin" | "invigilator" | "student";

export type AuthenticatedUser = {
  email: string;
  name: string;
  role: UserRole;
  redirectTo: string;
};

export const roleHome: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  invigilator: "/invigilator/dashboard",
  student: "/student/dashboard",
};

export async function authenticateWithMockBackend(
  email: string,
  password: string,
): Promise<AuthenticatedUser> {
  await new Promise((resolve) => window.setTimeout(resolve, 550));

  if (!email.includes("@") || password.length < 6) {
    throw new Error("Use a valid institutional email and a password with at least 6 characters.");
  }

  const normalized = email.toLowerCase();
  const role: UserRole = normalized.includes("student")
    ? "student"
    : normalized.includes("invigilator") || normalized.includes("faculty")
      ? "invigilator"
      : "admin";

  return {
    email,
    name: email.split("@")[0].replace(/[._-]/g, " "),
    role,
    redirectTo: roleHome[role],
  };
}
