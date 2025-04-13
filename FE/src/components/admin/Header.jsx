import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminHeader() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role')

        window.dispatchEvent(new Event('token-changed'))

        navigate('/');
    }

    return (
        <header class="text-gray-600 body-font px-40 py-2 bg-gray-100">
            <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    <span class="ml-3 text-xl">TechSphere</span>
                </a>
                <nav class="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center">
                    <Link to='/admin/users' className={`mr-5 cursor-pointer hover:text-gray-900 ${location.pathname=='/admin/users' ? "text-violet-500":""}`}>Users</Link>
                    <Link to='/admin/products' className={`mr-5 cursor-pointer hover:text-gray-900 ${location.pathname=='/admin/products' ? "text-violet-500":""}`}>Products</Link>
                    {/* <Link to='/users' class="mr-5 cursor-pointer hover:text-gray-900">Orders</Link>
                    <Link to='/users' class="mr-5 cursor-pointer hover:text-gray-900">Revenue</Link> */}
                </nav>
                <button onClick={handleLogout} class="inline-flex cursor-pointer items-center bg-violet-300 border-0 py-2 px-3 focus:outline-none hover:bg-violet-200 rounded text-base mt-4 md:mt-0">Đăng xuất
                    <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        </header>
    )
}