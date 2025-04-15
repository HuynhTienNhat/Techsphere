// Basic product information component
const ProductBasicInfo = () => {
    return (
      <div className="border border-gray-200 rounded-lg p-5 h-full">
        <h3 className="text-lg font-bold mb-4">Thông tin sản phẩm</h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-gray-600 mt-0.5 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </span>
            <span>Mới, đầy đủ phụ kiện từ nhà sản xuất</span>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-gray-600 mt-0.5 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            <div>
              <span>Bảo hành 12 tháng tại trung tâm bảo hành Chính hãng. 1 đổi 1 trong 30 ngày nếu có lỗi phần cứng từ nhà sản xuất. </span>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-gray-600 mt-0.5 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </span>
            <span>Giá sản phẩm đã bao gồm VAT</span>
          </div>
        </div>
      </div>
    );
  };  

export default ProductBasicInfo;