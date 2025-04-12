import {judgementImages} from './../../../assets/data/Judgement';

export default function HomeJudgement() {
    const imgElements = judgementImages.map(img => 
        <img src={img.image} key={img.id} alt={`Judgement image with id ${img.id}`} className='w-50 h-50 mb-10 rounded transition-all duration-300 hover:scale-105'/>
    )

    return(
        <div className="judgement-container mt-16 mx-30 bg-violet-500 rounded text-center px-8 h-80">
            <h1 className="text-2xl font-bold text-white p-6">Cảm ơn HÀNG NGÀN người nổi tiếng cùng HÀNG TRIỆU khách hàng đã và đang ủng hộ TechSphere</h1>
            <div className="flex justify-between">
                {imgElements}
            </div>
        </div>
    )
}