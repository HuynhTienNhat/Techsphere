import { FaFacebook, FaInstagram, FaComment } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 body-font mt-12">
      <div className="container px-5 py-12 mx-auto flex flex-wrap flex-col md:flex-row pl-30">
        {/* Cột 1: Logo và tên công ty */}
        <div className="w-full md:w-1/4 flex-shrink-0 mb-10 md:mb-0 text-center md:text-left ">
          <a className="flex items-center justify-center md:justify-start text-gray-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-10 h-10 text-white p-2 bg-purple-500 rounded-full"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="ml-3 text-xl font-semibold">TechSphere</span>
          </a>
          <p className="mt-2 text-sm text-gray-500">
            Giải pháp mua sắm trực tuyến hàng đầu
          </p>
        </div>

        {/* Các cột khác */}
        <div className="flex-grow flex flex-wrap md:pl-10 justify-between -mb-10 md:mt-0 mt-10 md:text-left text-center pr-20">
          {/* Cột 2: Tổng đài hỗ trợ */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4 mb-10 whitespace-nowrap mr-10">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              TỔNG ĐÀI HỖ TRỢ MIỄN PHÍ
            </h2>
            <div className="list-none">
              <p className="text-gray-600 mb-2">
                <strong>Mua hàng - Bảo hành:</strong>
                <br />
                1800.2097 (7h30 - 22h00)
              </p>
              <p className="text-gray-600">
                <strong>Khiếu nại:</strong>
                <br />
                1800.2063 (8h00 - 21h30)
              </p>
            </div>
          </div>

          {/* Cột 3: Liên kết hữu ích */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4 mb-10">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              LIÊN KẾT HỮU ÍCH
            </h2>
            <nav className="list-none">
              <li>
                <a className="text-gray-600 hover:text-gray-800" href="/policy">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a className="text-gray-600 hover:text-gray-800" href="/terms">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a className="text-gray-600 hover:text-gray-800" href="/support">
                  Hỗ trợ khách hàng
                </a>
              </li>
              <li>
                <a className="text-gray-600 hover:text-gray-800" href="/about">
                  Về chúng tôi
                </a>
              </li>
            </nav>
          </div>

          {/* Cột 4: Social Media */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4 mb-10">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              KẾT NỐI VỚI CHÚNG TÔI
            </h2>
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-green-600"
              >
                <FaComment size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Phần bản quyền */}
      <div className="bg-gray-200">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} YourBrand — All Rights Reserved
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
            <a className="text-gray-500" href="/privacy">
              Privacy Policy
            </a>
            <a className="ml-3 text-gray-500" href="/terms">
              Terms of Service
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}