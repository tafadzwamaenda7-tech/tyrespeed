import type { Metadata } from "next";
import { AdminSubmissions } from "@/components/admin/admin-submissions";

export const metadata: Metadata = {
  title: "Submissions",
  description: "Internal submission review.",
  alternates: { canonical: "/admin" },
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminSubmissions />;
}
