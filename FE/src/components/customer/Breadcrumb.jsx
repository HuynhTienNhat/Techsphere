import { Link, useLocation } from "react-router-dom";

export default function BreadCrumb() {
    const location = useLocation();
    const paths = location.pathname.split('/').filter(path => path)

    if (paths.length===0) return null;
    return (
        <div className="px-34 py-3 top-24 sticky z-2 text-gray-600 bg-white text-sm shadow-md">
            <ul className="flex space-x-2">
                <li>
                    <Link to="/" className="hover:underline">Home</Link>
                </li>
                {paths.map((path, index) => {
                    const fullPath = `/${paths.slice(0, index + 1).join("/")}`;
                    const isLast = index === paths.length - 1;

                    return (
                        <li key={fullPath} className="flex items-center">
                            <span className="mx-2">/</span>
                            {isLast ? (
                                <span className="text-violet-500 capitalize text">{path}</span>
                            ) : (
                                <Link to={fullPath} className="hover:underline capitalize">{path}</Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}