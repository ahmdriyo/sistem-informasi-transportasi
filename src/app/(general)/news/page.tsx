import { Metadata } from "next";
import News from "./News";
export const metadata: Metadata = {
  title: "Next.js News page | Admin - Next.js Dashboard Template",
  description: "This is Next.js News page Admin Dashboard Template",
};

export default function ProfilePage() {
  return (
    <News/>
  );
}
