import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your dstore.in account to manage orders, wishlist and more.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
