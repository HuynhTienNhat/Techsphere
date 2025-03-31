import React from "react";
import {sections} from './../../assets/data/Products/Information';

export default function GeneralInformation() {
    const [expanded, setExpanded] = React.useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const contentElements = sections.map(section => 
        <div key={section.id} className="px-3">
            <h2 className="text-lg font-semibold my-2">{section.id}. {section.title}</h2>
            <div className={`transition-all flex flex-col items-center duration-300 ${expanded ? "h-auto" : "line-clamp-3"}`}>
                {section.content.map((text, index) => 
                    <React.Fragment key={index}>
                        <p className="mb-3">{text}</p>
                        {index === 0 && (
                            <img src={section.img} alt="Related Image" className="w-2/3 rounded-lg shadow-md my-4" />
                        )}
                    </React.Fragment>
                )}
            </div>
        </div>
    )

    return(
        <div className="general-info mt-12 py-4 border-gray-300 border rounded-xl mx-30 flex flex-col transition-all duration-500 overflow-hidden items-center relative pb-10"
            style={{
                maxHeight: expanded ? "100%" : "220px",  // Điều chỉnh chiều cao
            }}>
            <h1 className="text-2xl font-bold mb-4 text-center">Tổng quan về điện thoại</h1>
            <div className="w-full">
                {contentElements}
            </div>
            
            <div className="z-10 bg-white bg-opacity-50 flex items-center justify-center py-2 absolute bottom-0 w-full">
                <button
                    onClick={toggleExpand}
                    className="text-red-500 cursor-pointer font-semibold hover:underline"
                >
                    {expanded ? "Rút gọn" : "Xem thêm"}
                </button>
            </div>
        </div>
    )
}