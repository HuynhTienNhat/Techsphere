import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';
import { getTop6BestSellingProducts } from '../../../services/api';
import React from 'react';
import { Link, useNavigate} from 'react-router-dom'; // Thêm import Link

export default function HomeProducts() {
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    
    const navigate = useNavigate()

    const handleClick = (slug) => {
        navigate(`/products/${slug}`);
      };

    React.useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getTop6BestSellingProducts();
                setProducts(data);
            } catch (error) {
                console.log(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div className="text-center py-10">Đang tải...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Lỗi: {error}</div>;
    if (products.length === 0) return <div className="text-center py-10">Không có sản phẩm nào</div>;

    const productDisplay = products.map(product => (
        <div key={product.productId} onClick={() => handleClick(product.slug)} className="flex flex-col bg-white rounded-md shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <Link className="flex flex-col h-full">
                <div className="flex justify-center items-center p-4 h-40 border-b border-gray-200">
                    <img 
                        src={product.mainImageUrl} 
                        alt={product.name} 
                        className="h-full object-contain" 
                    />
                </div>
                <div className="p-4 flex flex-col">
                    <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 h-10">{product.name}</h3>
                    <div className="mt-auto">
                        <p className="text-violet-500 font-medium">{product.basePrice}</p>
                        {product.oldPrice && <p className="text-gray-400 text-sm line-through">{product.oldPrice}</p>}
                    </div>
                </div>
            </Link>
        </div>
    ));

    return(
        <div className="home-products px-30 mt-15">
            <div className="border-15 border-violet-500 rounded-sm p-5">
                <h1 className='text-red-500 text-xl mb-5'> <FontAwesomeIcon icon={faFire} className="mr-2" /> Sản phẩm bán chạy nhất</h1>
                <div className='products-display grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
                    {productDisplay}
                </div>
            </div>
        </div>
    );
}