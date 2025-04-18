import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Tabs,
  Tab,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { format } from 'date-fns';
import { getUserAddresses, getUserOrders, changeOrderStatus } from '../../../services/api';
import { toast } from 'react-toastify';

const UserDetailModal = ({ open, onClose, user }) => {
  const [tabValue, setTabValue] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusChanges, setStatusChanges] = useState({});

  useEffect(() => {
    if (open && user) {
      fetchAddresses();
      fetchOrders();
    }
  }, [open, user]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await getUserAddresses(user.id);
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getUserOrders(user.id);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setStatusChanges((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));
  };

  const saveStatusChange = async (orderId) => {
    const newStatus = statusChanges[orderId];
    if (!newStatus) return;

    try {
      await changeOrderStatus(user.id, orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );
      setStatusChanges((prev) => {
        const updated = { ...prev };
        delete updated[orderId];
        return updated;
      });
      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <Modal open={open} onClose={onClose}>
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl">
          <CircularProgress className="mx-auto" />
        </Box>
      </Modal>
    );
  }

  const statusOptions = ['PROCESSING', 'DELIVERED', 'CANCELLED'];

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <Typography variant="h5" className="mb-4">
          User Details: {user?.name}
        </Typography>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          className="border-b mb-4"
        >
          <Tab label="General Info" className="px-4 py-2" />
          <Tab label="Addresses" className="px-4 py-2" />
          <Tab label="Orders" className="px-4 py-2" />
        </Tabs>

        {/* Tab 1: Thông tin chung */}
        {tabValue === 0 && (
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold">Email</TableCell>
                <TableCell>{user?.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Username</TableCell>
                <TableCell>{user?.username}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Phone</TableCell>
                <TableCell>{user?.phone || 'N/A'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Gender</TableCell>
                <TableCell>{user?.gender || 'N/A'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Date of Birth</TableCell>
                <TableCell>{user?.dateOfBirth || 'N/A'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Role</TableCell>
                <TableCell>{user?.role}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Created At</TableCell>
                <TableCell>
                  {user?.createdAt
                    ? format(new Date(user.createdAt), 'dd/MM/yyyy')
                    : 'N/A'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Last Login</TableCell>
                <TableCell>
                  {user?.lastLogin
                    ? format(new Date(user.lastLogin), 'dd/MM/yyyy')
                    : 'N/A'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}

        {/* Tab 2: Địa chỉ */}
        {tabValue === 1 && (
          <Box className="mt-4">
            {addresses.length > 0 ? (
              addresses.map((address) => (
                <Box
                  key={address.id}
                  className="mb-4 p-4 border rounded-lg"
                >
                  <Typography>
                    {address.streetAndHouseNumber}, {address.district}, {address.city}{' '}
                  </Typography>
                  {address.isDefault && (
                    <Typography className="text-green-500">
                      Default Address
                    </Typography>
                  )}
                </Box>
              ))
            ) : (
              <Typography>No addresses found.</Typography>
            )}
          </Box>
        )}

        {/* Tab 3: Orders */}
        {tabValue === 2 && (
          <Box className="mt-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <Box
                  key={order.orderId}
                  className="mb-4 p-4 border rounded-lg"
                >
                  <Typography>
                    <strong>Order ID:</strong> {order.orderId}
                  </Typography>
                  <Typography>
                    <strong>Date:</strong>{' '}
                    {order.orderDate
                      ? format(new Date(order.orderDate), 'dd/MM/yyyy')
                      : 'N/A'}
                  </Typography>
                  <Typography>
                    <strong>Total:</strong> {order.totalAmount}
                  </Typography>
                  <Box className="flex items-center mt-2">
                    <Typography className="mr-2">
                      <strong>Status:</strong>
                    </Typography>
                    <Select
                      value={statusChanges[order.orderId] || order.status}
                      onChange={(e) =>
                        handleStatusChange(order.orderId, e.target.value)
                      }
                      size="small"
                      className="border rounded-md"
                    >
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                    {statusChanges[order.orderId] &&
                      statusChanges[order.orderId] !== order.status && (
                        <Button
                          variant="contained"
                          className="bg-green-500 hover:bg-green-600 ml-2"
                          size="small"
                          onClick={() => saveStatusChange(order.orderId)}
                        >
                          Save
                        </Button>
                      )}
                  </Box>
                </Box>
              ))
            ) : (
              <Typography>No orders found.</Typography>
            )}
          </Box>
        )}

        <button onClick={onClose} className='mt-6 bg-gray-400 px-4 py-2 cursor-pointer rounded'>
            Close
        </button>
      </Box>
    </Modal>
  );
};

export default UserDetailModal;