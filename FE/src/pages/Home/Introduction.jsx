import {smallProducts} from './../../assets/data/SmallProducts';

export default function Introduction() {
    const liElements = smallProducts.map( (product) =>
        <li key={product.id} className='group w-[100px]'>
            <a href="#">
                <div className='flex flex-col items-center justify-center flex-col items-center text-center'>
                    <img src={product.src} alt={product.name} className="w-17 h-17 object-contain mb-2" />
                    <span className='group-hover:text-violet-500 text-sm break-words h-10'>{product.name}</span>
                </div> 
            </a>
        </li>
    ) 

    return(
        <div className="container mt-5 mx-auto flex items-center px-30">
            <ul className='flex justify-between w-full items-center bg-white rounded-xl shadow-[0px_10px_20px_rgba(0,0,0,0.2)] px-10 py-5 '>
                {liElements}
            </ul>
        </div>
    )
}