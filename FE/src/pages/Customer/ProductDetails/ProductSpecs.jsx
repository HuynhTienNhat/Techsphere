// Basic product information component
const ProductSpecs = ({ specs }) => {
    if (!specs || specs.length === 0) {
      return <div className="text-gray-500">Không có thông số kỹ thuật</div>;
    }
  
    // Function to get specs by name
    const getSpecByName = (name) => {
      return specs.find(spec => spec.specName === name) || { specValue: "N/A" };
    };
  
    return (
      <div className="border border-gray-200 rounded-lg p-5 h-full">
        <h3 className="text-lg font-bold mb-4">Thông số kỹ thuật</h3>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-600">Màn hình</div>
          <div className="font-medium">{getSpecByName("Màn hình").specValue}</div>
          
          <div className="text-gray-600">RAM</div>
          <div className="font-medium">{getSpecByName("RAM").specValue}</div>

          <div className="text-gray-600">Camera trước</div>
          <div className="font-medium">{getSpecByName("Camera trước").specValue}</div>

          <div className="text-gray-600">Camera sau</div>
          <div className="font-medium">{getSpecByName("Camera sau").specValue}</div>
          
          <div className="text-gray-600">Pin</div>
          <div className="font-medium">{getSpecByName("Pin").specValue}</div>
        </div>
      </div>
    );
};

export default ProductSpecs;