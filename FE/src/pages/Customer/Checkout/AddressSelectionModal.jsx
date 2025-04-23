// src/components/Checkout/AddressSelectionModal.jsx
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Radio, RadioGroup, FormControlLabel } from '@mui/material';

export default function AddressSelectionModal({
  open,
  addresses,
  selectedAddressId,
  onSelect,
  onClose,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '8px',
          fontFamily: 'Roboto, sans-serif',
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.3)', // Trong suốt hơn
          backdropFilter: 'blur(3px)', // Hiệu ứng mờ
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 500, color: '#1f2937' }}>
        Chọn địa chỉ giao hàng
      </DialogTitle>
      <DialogContent>
        {addresses.length === 0 ? (
          <p className="text-gray-600">Hiện chưa có địa chỉ khả dụng</p>
        ) : (
          <RadioGroup
            value={selectedAddressId || ''}
            onChange={(e) => onSelect(Number(e.target.value))}
          >
            {addresses.map((addr) => (
              <FormControlLabel
                key={addr.id}
                value={addr.id}
                control={<Radio sx={{ color: '#8b5cf6', '&.Mui-checked': { color: '#8b5cf6' } }} />}
                label={`${addr.streetAndHouseNumber}, ${addr.district}, ${addr.city}${addr.isDefault ? ' (Mặc định)' : ''}`}
                sx={{ color: '#1f2937', marginY: 1 }}
              />
            ))}
          </RadioGroup>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{ textTransform: 'none', color: '#6b7280', '&:hover': { backgroundColor: '#f3f4f6' } }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}