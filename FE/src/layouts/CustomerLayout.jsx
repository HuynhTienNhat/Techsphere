import Header from "./../components/customer/Header";
import Breadcrumb from "./../components/customer/Breadcrumb";
import Footer from "./../components/customer/Footer";

export default function CustomerLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Breadcrumb />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}