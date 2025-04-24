import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Login() {
  const [loginData, setLoginData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()

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

  const handleInputChange = async (event) => {
    event.preventDefault();

    const errorMessage = validateForm();
    if (errorMessage) {
      toast.error(errorMessage);
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

      const result = await response.json();

      if (response.status === 200) {
        toast.success("Đăng nhập thành công!");
        
        localStorage.setItem("token", result.token);

        const profileResponse = await fetch("http://localhost:8080/api/users/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${result.token}`,
          }
        })

        if (!profileResponse.ok) {
          throw new Error("Không thể tải thông tin người dùng!"); 
        }
        
        const profileData = await profileResponse.json()
        const role = profileData.role
        
        localStorage.setItem('role', role)

        // Kích hoạt custom event sau khi lưu token
        window.dispatchEvent(new Event("token-changed"));

        if (role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        toast.error("Đăng nhập thất bại: " + (result.error || "Lỗi không xác định"));
      }
    } catch (error) {
      toast.error("Đăng nhập thất bại! Vui lòng thử lại sau.");
    }
  };

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
              className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-7"
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