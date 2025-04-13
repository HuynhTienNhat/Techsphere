import React from "react";

export default function SpecsTab({ specs }) {
  return (
    <div className="space-y-2">
      {specs && specs.length > 0 ? (
        specs.map((spec, index) => (
          <div key={index} className="p-2 border rounded">
            <p>
              <strong>{spec.specName}:</strong> {spec.specValue}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Chưa có thông số nào.</p>
      )}
    </div>
  );
}