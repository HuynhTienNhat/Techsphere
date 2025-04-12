import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
        try {
            const token = localStorage.getItem("token");
            const storedRole = localStorage.getItem('role')

            if (!token) {
                throw new Error("No token found");
            }
            if (storedRole) {
              setRole(storedRole)
            }else{
              console.log("Else runs");
              
              const response = await fetch("http://localhost:8080/api/users/profile", {
                  method: "GET",
                  headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                  },
              });

              if (!response.ok) {
                  throw new Error("Failed to fetch user profile");
              }

              const data = await response.json();
              setRole(data.role); // Lấy role từ API
              localStorage.setItem('role', data.role)
            }
        } catch (err) {
            console.error(err);
            setRole(null);
        } finally {
            setIsLoading(false);
        }
    };

    fetchUserRole();
  }, []);

  if (isLoading) {
    return <div className="text-center py-10">Đang tải...</div>;
  }

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}