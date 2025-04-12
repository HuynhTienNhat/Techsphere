import Header from "../components/admin/Header";
import Breadcrumb from "../components/admin/Breadcrumb";

export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Breadcrumb />
      <main className="flex-grow">{children}</main>
    </div>
  );
}