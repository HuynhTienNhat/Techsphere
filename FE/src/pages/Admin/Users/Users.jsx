import React, { useState, useEffect } from 'react';
import UserDetailModal from './UserDetailModal';
import { getAllUsers, deleteUser } from './../../../services/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-12">
        <div className="w-10 h-10 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-10 md:px-20 lg:px-44 py-3">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white shadow-md rounded-lg p-4 flex items-center hover:shadow-lg transition-shadow"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${user.name}`}
              alt={user.name}
              className="w-10 h-10 rounded-full mr-4"
            />
            <div className="flex-grow">
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-gray-500">{user.role}</p>
            </div>
            <button
              onClick={() => handleOpenModal(user)}
              className="bg-violet-500 cursor-pointer text-white px-4 py-2 rounded-md mr-2 hover:bg-violet-600 transition-colors"
            >
              View Details
            </button>
            <button
              onClick={() => handleDelete(user.id)}
              className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {selectedUser && (
        <UserDetailModal
          open={openModal}
          onClose={handleCloseModal}
          user={selectedUser}
        />
      )}
    </div>
  );
}