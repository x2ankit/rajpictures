import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type AdminGuardProps = {
  children: ReactNode;
};

const ADMIN_AUTH_KEY = "isAdminAuthenticated";

export default function AdminGuard({ children }: AdminGuardProps) {
  let isAuthed = false;
  try {
    isAuthed = localStorage.getItem(ADMIN_AUTH_KEY) === "true";
  } catch {
    isAuthed = false;
  }

  if (!isAuthed) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
