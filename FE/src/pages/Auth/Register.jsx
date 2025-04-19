import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { sendOTP } from "../../services/api";

export default function Register() {
  const [registerData, setRegisterData] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (location.state?.isVerify === "yes") {
      const savedData = JSON.parse(localStorage.getItem("registerData"));
      if (savedData) {
        regiserUser(savedData);
        localStorage.removeItem("registerData");
        navigate("/login");
      }
    }
  }, []);

  const validateForm = () => {
    // Kiểm tra các trường bắt buộc
    if (
      !registerData.name ||
      !registerData.username ||
      !registerData.password ||
      !registerData.email ||
      !registerData.phone ||
      !registerData.gender ||
      !registerData.dateOfBirth
    ) {
      return "Vui lòng điền đầy đủ thông tin.";
    }

    // Validate name (2-50 ký tự)
    if (registerData.name.length < 2 || registerData.name.length > 50) {
      return "Họ và tên phải từ 2 đến 50 ký tự.";
    }

    // Validate username (3-20 ký tự)
    if (registerData.username.length < 3 || registerData.username.length > 20) {
      return "Tên đăng nhập phải từ 3 đến 20 ký tự.";
    }

    // Validate password (ít nhất 6 ký tự)
    if (registerData.password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    // Validate confirm password
    if (registerData.password !== confirmPassword) {
      return "Mật khẩu và mật khẩu nhập lại không khớp!";
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      return "Định dạng email không hợp lệ.";
    }

    // Validate phone (bắt đầu bằng 0, đúng 10 chữ số)
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(registerData.phone)) {
      return "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số.";
    }

    // Validate dateOfBirth (phải trong quá khứ)
    const today = new Date();
    const dob = new Date(registerData.dateOfBirth);
    if (dob >= today) {
      return "Ngày sinh phải trong quá khứ.";
    }

    return null;
  };

  const regiserUser = async (data) => {
    try {

      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.status === 201) {
        toast.success("Đăng ký thành công!");
        localStorage.setItem("token", result.token);
        
      } else {
        toast.error("Đăng ký thất bại: " + (result.error || "Lỗi không xác định"));
      }
    } catch (error) {
      toast.error("Đăng ký thất bại! Vui lòng thử lại sau.");
    }
  }

  const handleInputChange = async (event) => {
    event.preventDefault();
  
    const errorMessage = validateForm();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }
    localStorage.setItem("registerEmail", registerData.email);
    navigate("/email-verify", { state:"register"});
    await sendOTP(registerData.email);
    
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
      <div className="border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-50 relative w-[450px]">
        <h2 className="mt-6 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">Đăng ký tài khoản</h2>
        <form onSubmit={handleInputChange} autoComplete="off">
          <div className="relative my-4">
            <input
              type="text"
              name="name"
              value={registerData.name}
              onChange={handleChange}
              className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none"
              placeholder=""
              required
            />
            <label
              htmlFor=""
              className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6"
            >
              Họ và tên
            </label>
          </div>
          <div className="relative my-4">
            <input
              type="text"
              name="username"
              value={registerData.username}
              onChange={handleChange}
              className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none"
              placeholder=""
              required
            />
            <label
              htmlFor=""
              className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6"
            >
              Tên đăng nhập
            </label>
          </div>
          <div className="relative my-4">
            <input
              type={showPassword?"text":"password"}
              name="password"
              value={registerData.password}
              onChange={handleChange}
              className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none"
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
              className="absolute right-0 top-2.5 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <div className="relative my-4">
            <input
              type={showConfirm?"text" :"password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none"
              placeholder=""
              required
            />
            <label
              htmlFor=""
              className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6"
            >
              Nhập lại mật khẩu
            </label>
            <div
              className="absolute right-0 top-2.5 cursor-pointer text-gray-600"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <div className="relative my-4">
            <input
              type="email"
              name="email"
              value={registerData.email}
              onChange={handleChange}
              className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none"
              placeholder=""
              required
            />
            <label
              htmlFor=""
              className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6"
            >
              Email
            </label>
          </div>
          <div className="relative my-4">
            <input
              type="tel"
              name="phone"
              value={registerData.phone}
              onChange={handleChange}
              className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none"
              placeholder=""
              required
            />
            <label
              htmlFor=""
              className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6"
            >
              Số điện thoại
            </label>
          </div>
          <div className="relative my-4">
            <select
              name="gender"
              value={registerData.gender}
              onChange={handleChange}
              className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none"
              required
            >
              <option value="" disabled>
                Chọn giới tính
              </option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
            <label
              htmlFor=""
              className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6"
            >
              Giới tính
            </label>
          </div>
          <div className="relative my-4">
            <input
              type="date"
              name="dateOfBirth"
              value={registerData.dateOfBirth}
              onChange={handleChange}
              className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none"
              placeholder=""
              required
            />
            <label
              htmlFor=""
              className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6"
            >
              Ngày sinh
            </label>
          </div>
          <button
            className="w-full cursor-pointer mb-4 text-[18px] mt-6 rounded-full bg-violet-600 text-emerald-50 hover:bg-violet-800 py-2"
            type="submit"
          >
            Đăng ký
          </button>
          <p className="block text-center">
            Đã có tài khoản?{" "}
            <Link to={"/login"} className="text-violet-600 hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}