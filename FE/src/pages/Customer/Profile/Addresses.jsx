import React from "react";
import { useState } from "react";
import AddressModal from "./AddressModal";

export default function Addresses() {

    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(null);
    const [address, setAddress] = useState([
        {
            id: 1,
            fullName: "Nguyễn Văn A",
            name: "Nhà riêng",
            phone: "0123456789",
            address: "123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh",
        },
        {
            id: 2,
            fullName: "Nguyễn Văn B",
            name: "Văn phòng",
            phone: "0123456789",
            address: "456 Đường DEF, Phường UVW, Quận 2, TP. Hồ Chí Minh",
        },
    ])

    const handleAddNew = () => {
        setEdit(null);
        setOpen(true);
    };

    const handleEdit = (address) => {
        setEdit(address);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEdit(null);
    }

    const handleSave = (formData) => {
        if (edit) {
            // Edit existing address
            setAddress(address.map(addr => 
                addr.id === edit.id ? { ...addr, ...formData } : addr
            ));
        } else {
            // Add new address
            const newAddress = {
                id: Date.now(),
                ...formData
            };
            setAddress([...address, newAddress]);
        }
        setOpen(false);
        setEdit(null);
    };


    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">Địa chỉ nhận hàng</h1>
            <div className="space-y-4">
                {address.map((address) => (
                    <div key={address.id} className="border rounded-md p-4">
                        <div className="flex justify-between">
                            <div>
                                <div className="font-medium">{address.name}</div>
                                <div className="text-sm text-gray-600 mt-1">{address.fullName}</div>
                                <div className="text-sm text-gray-600 mt-1">{address.phone}</div>
                                <div className="text-sm text-gray-600 mt-1">{address.address}</div>
                            </div>
                            <div>
                                <button onClick={() => handleEdit(address)} className="text-violet-600 hover:text-violet-800">Chỉnh sửa</button>
                            </div>
                        </div>
                    </div>
                ))}
                <button onClick={handleAddNew} className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700">Thêm địa chỉ mới</button>
            </div>

            {open && (
                <AddressModal
                    initialData={edit}
                    onClose={handleClose}
                    onSave={handleSave}
                />)}
        </div>
    );
}