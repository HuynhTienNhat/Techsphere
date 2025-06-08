import { Link, useLocation } from "react-router-dom";

export default function AdminBreadcrumb() {
  const location = useLocation();
  const paths = location.pathname.split("/").filter((path) => path);

  if (paths.length === 0 || paths.length === 1) return null;

  return (
    <div className="px-44 py-3 text-gray-600 text-sm shadow-md mb-10 bg-white sticky top-24 z-2">
      <ul className="flex space-x-2">
        {paths.map((path, index) => {
          const fullPath = `/${paths.slice(0, index + 1).join("/")}`; // Đường dẫn tuyệt đối
          const isLast = index === paths.length - 1;

          // Thay thế "admin" thành "Dashboard" khi hiển thị
          const displayPath = path === "admin" ? "Dashboard" : path;

          return (
            <li key={fullPath} className="flex items-center">
              {/* Chỉ thêm dấu / nếu không phải phần tử đầu tiên */}
              {index > 0 && <span className="mx-2">/</span>}
              {isLast ? (
                <span className="text-violet-500 capitalize">{displayPath}</span>
              ) : (
                <Link to={fullPath} className="hover:underline capitalize">
                  {displayPath}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}