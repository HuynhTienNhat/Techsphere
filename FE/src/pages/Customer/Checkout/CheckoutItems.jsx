export default function CheckoutItems({ cartItems, formatCurrency }) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Sản phẩm</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-600">Giỏ hàng trống, vui lòng thêm sản phẩm.</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start p-4 bg-white rounded-md border border-gray-200 mb-4"
            >
              <img
                src={item.mainImageUrl || 'https://via.placeholder.com/150'}
                alt={item.productName}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="ml-4 flex-1">
                <p className="font-medium text-gray-900">{item.productName}</p>
                <p className="text-sm text-gray-600">
                  {item.storage} - {item.color}
                </p>
                <p className="text-red-600 font-semibold">
                  {formatCurrency(item.unitPrice)} x {item.quantity}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }