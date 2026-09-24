import { ENV } from "./env.js";

export function resolveInitialRole(email) {
  if ((email || "").toLowerCase() === ENV.SUPER_ADMIN_EMAIL) {
    return { role: "admin", roleSet: true };
  }
  return { role: "student", roleSet: false };
}
