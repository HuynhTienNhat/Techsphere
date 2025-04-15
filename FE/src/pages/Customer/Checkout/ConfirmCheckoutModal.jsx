// src/components/Checkout/ConfirmCheckoutModal.jsx
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function ConfirmCheckoutModal({ isOpen, onConfirm, onCancel }) {
  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '8px',
          fontFamily: 'Roboto, sans-serif',
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(3px)',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 500, color: '#1f2937' }}>
        Xác nhận đặt hàng
      </DialogTitle>
      <DialogContent>
        <p className="text-gray-600">Bạn có chắc muốn đặt đơn hàng này?</p>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCancel}
          sx={{ textTransform: 'none', color: '#6b7280', '&:hover': { backgroundColor: '#f3f4f6' } }}
        >
          Hủy
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
            textTransform: 'none',
            backgroundColor: '#8b5cf6',
            color: 'white',
            '&:hover': { backgroundColor: '#7c3aed' },
          }}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
}