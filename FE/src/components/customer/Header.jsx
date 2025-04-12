import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleTokenChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("token-changed", handleTokenChange);
    window.addEventListener("storage", handleTokenChange);
    setToken(localStorage.getItem("token"));

    return () => {
      window.removeEventListener("token-changed", handleTokenChange);
      window.removeEventListener("storage", handleTokenChange);
    };
  }, []);

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      fetch("http://localhost:8080/api/users/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failed to fetch user profile!");
        })
        .then((data) => {
          setUser(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          localStorage.removeItem("token");
          localStorage.removeItem("role"); // Xóa role nếu token không hợp lệ
          setToken(null);
          setUser(null);
          setIsLoading(false);
        });
    } else {
      setUser(null);
      setIsLoading(false);
    }
  }, [token]);

  const handleCartClick = () => {
    if (!user) {
      alert("Bạn cần đăng nhập trước!");
    } else {
      navigate("/cart");
    }
  };

  const handleSearch = () => {
    navigate(`/products?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    setSearchKeyword("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Xóa role khi đăng xuất
    setToken(null);
    setUser(null);
    navigate("/login");
    window.dispatchEvent(new Event("token-changed"));
  };

  return (
    <header className="px-30 py-4 dark:bg-gray-100 dark:text-gray-800">
      <div className="container flex justify-between h-16 items-center">
        <ul className="items-stretch hidden space-x-3 lg:flex">
          <li className="flex">
            <Link
              to="/"
              className={`flex items-center px-4 -mb-1 border-b-2 ${
                location.pathname === "/" ? "dark:border-violet-600 dark:text-violet-600" : "border-transparent hover:border-gray-300"
              }`}
            >
              Home
            </Link>
          </li>
          <li className="flex">
            <Link
              to="/products"
              className={`flex items-center px-4 -mb-1 border-b-2 ${
                location.pathname === "/products" ? "dark:border-violet-600 dark:text-violet-600" : "border-transparent hover:border-gray-300"
              }`}
            >
              Products
            </Link>
          </li>
        </ul>

        <Link to={"/"} href="" aria-label="Back to homepage" className="flex items-center p-2">
          <span className="text-2xl font-bold text-purple-600 dark:text-violet-600">TechSphere</span>
        </Link>

        <div className="flex items-center space-x-6">
          <div className="relative w-[280px]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <button type="submit" title="Search" className="p-1 focus:outline-none focus:ring" onClick={handleSearch}>
                <svg fill="currentColor" viewBox="0 0 512 512" className="w-4 h-4 dark:text-gray-800">
                  <path d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z"></path>
                </svg>
              </button>
            </span>
            {searchKeyword && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setSearchKeyword("")}
              >
                <svg
                  className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                ></svg>
              </button>
            )}
            <input
              type="search"
              name="Search"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search products..."
              className="w-full px-2 py-2 pl-10 text-base rounded-md focus:outline-none dark:bg-gray-100 dark:text-gray-800 focus:dark:bg-gray-50 border border-gray-300 shadow-sm"
            />
          </div>

          <button
            type="button"
            className="p-2 cursor-pointer rounded-full dark:bg-violet-600 dark:text-gray-50 hover:dark:bg-violet-700 transition-colors"
            onClick={handleCartClick}
            title="Giỏ hàng"
          >
            <FaShoppingCart className="w-5 h-5" />
          </button>

          {isLoading ? (
            <span className="px-6 py-2 font-semibold">Đang tải...</span>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <span className="px-6 py-2 font-semibold text-violet-600">
                Xin chào {user.name}
              </span>
              <button
                type="button"
                className="px-6 cursor-pointer py-2 font-semibold rounded dark:bg-gray-300 dark:text-gray-800 hover:dark:bg-gray-400 transition-colors"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="hidden cursor-pointer px-6 py-2 font-semibold rounded lg:block dark:bg-violet-600 dark:text-gray-50 hover:dark:bg-violet-700 transition-colors"
            >
              <Link to="/login" className="text-gray-50">
                Log in
              </Link>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}