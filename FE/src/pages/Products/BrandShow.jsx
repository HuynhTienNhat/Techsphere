import {models} from './../../assets/data/Models.js';
import React from 'react';

export default function ProductFilter({ onSelectBrand }) {
    const [selectedBtn, setSelectedBtn] = React.useState("All")

    const handleSelectedBtn = (brand) => {
        setSelectedBtn(brand)
        if(onSelectBrand){
            onSelectBrand(brand)
        }
    }

    const btnElements = models.map(model => 
        <button key={model.id} 
                className={`flex gap-2 p-2 border border-gray-300 rounded cursor-pointer items-center ${selectedBtn===model.name? "border-violet-500" : "bg-white"}`}
                onClick={() => handleSelectedBtn(model.name)}
        >
            <img src={model.logo} alt={model.name} className="w-6 h-6 object-contain" /> {model.name}
        </button>
    )

    return(
        <div className="product-filter mt-10 px-30 flex gap-3">
            <button 
                className={`flex p-2 border border-gray-300 rounded cursor-pointer ${selectedBtn === "All" ? "border-violet-500" : "bg-white"}`}
                onClick={() => handleSelectedBtn("All")}
            >
                All
            </button>

            {btnElements}
        </div>
    )
}