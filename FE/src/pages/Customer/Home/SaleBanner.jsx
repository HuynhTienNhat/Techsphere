import { Link } from "react-router-dom";

export default function SalesBanner() {
    return(<div className="mt-10 p-6 py-12 dark:bg-violet-600 dark:text-gray-50">
        <div className="container mx-auto">
            <div className="px-25 flex flex-col lg:flex-row items-center justify-between">
                <h2 className="text-center text-6xl tracking-tighter font-bold">Up to
                    <br  className="sm:hidden" /> 30% Off
                </h2>
                <div className="space-x-2 text-center py-2 lg:py-0">
                    <span>Plus free shipping! Use code:</span>
                    <span className="font-bold text-lg">TECHSPHERE</span>
                </div>
                <Link to='/products' rel="noreferrer noopener" className="px-5 mt-4 lg:mt-0 py-3 rounded-md border block dark:bg-gray-900 dark:text-gray-50 dark:border-gray-600">Shop Now</Link>
            </div>
        </div>
    </div>)
}