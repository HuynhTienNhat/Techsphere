import { Link } from "react-router-dom"
import Login from "./Login"
import { useState } from "react"
export default function Register() {
    const [registerData, setRegisterData] = useState({ name: "", username: "", password: "", email: "", phone: "", address: "" });
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegisterData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };
    
    
    const handleInputChange = async (event) => {
        event.preventDefault();
        if (!registerData.name || !registerData.username || !registerData.password || !registerData.email || !registerData.phone || !registerData.address) {
            alert("Vui lòng điền đầy đủ thông tin.");
            return;
        }
    
        if (registerData.password !== confirmPassword) {
            alert("Mật khẩu và mật khẩu nhập lại không khớp!");
            return;
        }
    
        try {
            console.log("Register Data:", registerData); // Kiểm tra dữ liệu trước khi gửi

            const response = await fetch("http://localhost:8080/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registerData),
            });

            console.log("Response Status:", response.status); // Debug response

            const result = await response.json(); 
            console.log("Response Data:", result); // Debug JSON response

            if (result.status === 1000) {
                alert("Đăng ký thành công!");
                localStorage.setItem("token", result.token);
                window.location.href = "../";
            } else {
                alert("Đăng ký thất bại: " + result.message);
            }
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            alert("Đăng ký thất bại! Vui lòng thử lại sau.");
        }

    };

    return(
        <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
            <div className="border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-50 relative w-[450px]">
                <h2 className="text-3xl text-center mb-6">Đăng ký tài khoản</h2>
                <form onSubmit={handleInputChange}>
                <div className="relative my-4">
                    <input type="text" name="name" onChange={handleChange}  className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none" placeholder="" required />
                    <label htmlFor="" className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6">Họ và tên</label>
                </div>
                <div className="relative my-4">
                    <input type="text" name="username" onChange={handleChange}  className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none" placeholder="" required />
                    <label htmlFor="" className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6">Tên đăng nhập</label>
                </div>
                <div className="relative my-4">
                    <input type="password" name="password" onChange={handleChange}  className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none" placeholder="" />
                    <label htmlFor="" className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6">Mật khẩu</label>
                </div>
                <div className="relative my-4">
                    <input type="password" name="confirmPassword" onChange={(e)=> {setConfirmPassword(e.target.value)}} className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none" placeholder="" />
                    <label htmlFor="" className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6">Nhập lại mật khẩu</label>
                </div>
                <div className="relative my-4">
                    <input type="email" name="email" onChange={handleChange} className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none" placeholder="" />
                    <label htmlFor="" className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6">Email</label>
                </div>
                <div className="relative my-4">
                    <input type="tel" name="phone" onChange={handleChange} className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none" placeholder="" />
                    <label htmlFor="" className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6">Số điện thoại</label>
                </div>
                <div className="relative my-4">
                    <input type="text" name="address" onChange={handleChange} className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none" placeholder="" />
                    <label htmlFor="" className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6">Địa chỉ</label>
                </div>
                <button className="w-full mb-4 text-[18px] mt-6 rounded-full bg-violet-600 text-emerald-50 hover:bg-violet-800  py-2"  type="submit">Đăng ký</button>
                <p className="block text-center">Đã có tài khoản? <Link to={"/login"} className="text-violet-600 hover:underline">Đăng nhập ngay</Link></p>
                </form>
            </div>
        </div>
    )
}