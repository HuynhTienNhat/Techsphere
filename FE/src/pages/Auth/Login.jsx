import { Link } from "react-router-dom";
import { useState } from "react";
// Sửa: Thêm import FaEye, FaEyeSlash
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  // Sửa: Dùng object cho state và thêm showPassword
  const [loginData, setLoginData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Sửa: Thêm handleChange và validateForm
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!loginData.usernameOrEmail || !loginData.password) {
      return "Vui lòng điền đầy đủ tên đăng nhập và mật khẩu.";
    }
    return null;
  };

  // Sửa: Cập nhật handleInputChange
  const handleInputChange = async (event) => {
    event.preventDefault();

    // Validate form trước khi gửi
    const errorMessage = validateForm();
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    try {
      console.log("Login Data:", loginData);

      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      console.log("Response Status:", response.status);

      const result = await response.json();
      console.log("Response Data:", result);

      if (response.status === 200) {
        alert("Đăng nhập thành công!");
        localStorage.setItem("token", result.token);
        window.location.href = "../";
      } else {
        alert("Đăng nhập thất bại: " + (result.error || "Lỗi không xác định"));
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert("Đăng nhập thất bại! Vui lòng thử lại sau.");
    }
  };

  // Sửa: Cập nhật JSX để thêm icon mắt và dùng state mới
  return (
    <div id="loginForm" className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
      <div className="border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-50 relative">
        <h1 className="mt-6 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">Đăng nhập</h1>
        <form onSubmit={handleInputChange} autoComplete="off">
          <div className="relative my-4">
            <input
              type="text"
              name="usernameOrEmail"
              value={loginData.usernameOrEmail}
              onChange={handleChange}
              className="block w-72 py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none"
              placeholder=""
              required
            />
            <label
              htmlFor=""
              className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6"
            >
              Tên đăng nhập / Email
            </label>
          </div>
          <div className="relative my-4">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={loginData.password}
              onChange={handleChange}
              className="block w-72 py-2.5 pr-10 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none"
              placeholder=""
              required
            />
            <label
              htmlFor=""
              className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6"
            >
              Mật khẩu
            </label>
            <div
              className="absolute right-2 top-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <span className="block text-right text-violet-600 hover:underline">
            <Link to={'/forget-password'}>Quên mật khẩu?</Link>
          </span>
          <button
            className="w-full mb-4 cursor-pointer text-[18px] mt-6 rounded-full bg-violet-600 text-emerald-50 hover:bg-violet-800 py-2"
            type="submit"
          >
            Đăng nhập
          </button>
          <p className="block text-center">
            Chưa có tài khoản?{" "}
            <Link to={"/register"} className="text-violet-600 hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}