import React from "react";

export default function BasicTab({ formData, brands, errors, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={onChange}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Model</label>
        <input
          type="text"
          name="model"
          value={formData.model || ""}
          onChange={onChange}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        {errors.model && <p className="text-red-500 text-sm">{errors.model}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Slug</label>
        <input
          type="text"
          name="slug"
          value={formData.slug || ""}
          onChange={onChange}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        {errors.slug && <p className="text-red-500 text-sm">{errors.slug}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Base Price (VND)</label>
        <input
          type="number"
          name="basePrice"
          value={formData.basePrice || ""}
          onChange={onChange}
          min="500000"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        {errors.basePrice && (
          <p className="text-red-500 text-sm">{errors.basePrice}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Old Price (VND)</label>
        <input
          type="number"
          name="oldPrice"
          value={formData.oldPrice || ""}
          onChange={onChange}
          min="500000"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        {errors.oldPrice && (
          <p className="text-red-500 text-sm">{errors.oldPrice}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Brand</label>
        <select
          name="brandName"
          value={formData.brandName || ""}
          onChange={onChange}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="">Select Brand</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.name}>
              {brand.name}
            </option>
          ))}
        </select>
        {errors.brandName && (
          <p className="text-red-500 text-sm">{errors.brandName}</p>
        )}
      </div>
    </div>
  );
}