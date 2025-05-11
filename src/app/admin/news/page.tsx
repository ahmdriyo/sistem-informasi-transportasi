import { Metadata } from "next";
import News from "./News";
export const metadata: Metadata = {
  title: "Next.js Blank Page | Admin - Next.js Dashboard Template",
  description: "This is Next.js Blank Page Admin Dashboard Template",
};

export default function ProfilePage() {
  return (
    <News/>
  );
}
