import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';
import {products} from './../../assets/data/Products';
export default function HomeProducts() {
    
    const productDisplay = products.map(product =>
        <div key={product.id} className="transition-transform transform hover:-translate-y-2 hover:shadow-lg p-2 w-50 flex flex-col justify-center rounded-md shadow-md dark:bg-white-50 dark:text-gray-900 border-[0.5px] border-gray-100">
            <a href="" className='group'>
                <img src={product.image} alt="" className="object-cover object-center w-40 rounded-md h-40 dark:bg-gray-500 bg-white-50" />
                <div className="mt-4 mb-2 flex flex-col items-start">
                    <span className="block text-xs font-medium tracking-widest h-8 overflow-hidden">{product.name}</span>
                    <h3 className='price text-violet-500'>{product.price}</h3>
                    <h3 className='line-through text-gray-500'>{product.oldPrice}</h3>
                </div>
                <p className="dark:text-gray-800"></p>
            </a>
        </div>
    )

    return(
        <div className="home-products px-30 mt-15">
            <div className="border-15 border-violet-500 rounded-sm p-5">
                <h1 className='text-red-500 text-xl mb-5'> <FontAwesomeIcon icon={faFire} className="mr-2" /> Sản phẩm bán chạy nhất</h1>
                <div className='products-display flex justify-between flex-wrap gap-4'>
                    {productDisplay}
                </div>
            </div>
        </div>
    )
}