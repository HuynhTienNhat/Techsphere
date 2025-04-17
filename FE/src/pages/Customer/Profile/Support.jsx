import React from "react";

export default function Support() {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">Hỗ trợ</h1>
            <div className="space-y-6">
            <div>
                <h2 className="text-lg font-medium mb-2">Liên hệ chúng tôi</h2>
                <p className="text-gray-600">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua:</p>
                <div className="mt-2">
                <div className="flex items-center mt-2">
                    <span className="font-medium mr-2">Email:</span>
                    <a href="mailto:support@example.com" className="text-violet-600">support@example.com</a>
                </div>
                <div className="flex items-center mt-2">
                    <span className="font-medium mr-2">Hotline:</span>
                    <a href="tel:1900123456" className="text-violet-600">1900 123 456</a>
                </div>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-medium mb-2">Gửi yêu cầu hỗ trợ</h2>
                <form className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Tiêu đề</label>
                    <input 
                    type="text" 
                    className="w-full p-2 border rounded" 
                    placeholder="Nhập tiêu đề yêu cầu"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Nội dung</label>
                    <textarea 
                    className="w-full p-2 border rounded" 
                    rows="4"
                    placeholder="Mô tả chi tiết vấn đề của bạn"
                    ></textarea>
                </div>
                <button className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700">
                    Gửi yêu cầu
                </button>
                </form>
            </div>
            </div>
        </div>
    );
}