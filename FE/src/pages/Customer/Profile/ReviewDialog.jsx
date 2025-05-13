import { useEffect, useState} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Rating,
  List,
  ListItem,
  ListItemText 
} from "@mui/material";
import { toast } from "react-toastify";
import { createReview, getReviewsOfUserByOrderId } from "./../../../services/api.js";

export default function ReviewDialog({
    open,
    onClose,
    selectedOrder,
    selectedOrderId,
}) {
//   const [selectedVariantId, setSelectedVariantId] = useState("");
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [variantName, setVariantName] = useState("");
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [openProductReview, setOpenProductReview] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [isViewOnly, setIsViewOnly] = useState(false);

    useEffect(() => {
        if (open) {
        loadReviews();
        }
    }, [open]);
  

    const loadReviews = async () => {
        try {
            const data = await getReviewsOfUserByOrderId(selectedOrderId);
            setReviews(data);
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleOpenProductReview = async (productId, variantName) => {
        const existingReview = reviews.find(r => r.variantName === variantName);
    
        if (existingReview) {
            setRating(existingReview.rating);
            setComment(existingReview.comment);
            setIsViewOnly(true);
        } else {
            setRating(0);
            setComment("");
            setIsViewOnly(false);
        }

            setOpenProductReview(true);
            setSelectedProductId(productId);
            setVariantName(variantName);
        }

        const handleCloseProductReview = () => {
            setOpenProductReview(false);
            setSelectedProductId(null);
            setVariantName("");
    };

    const handleSubmitReview = async () => {
        try {
        if (comment.trim() === "" ) {
            toast.error("Nội dung không được để trống");
        }
        if (rating === 0) {
            toast.error("Đánh giá không được để trống");
        }

        await createReview(
            rating,
            comment,
            selectedOrderId,
            selectedProductId,
            variantName
        );

        toast.success("Đánh giá đã được gửi.");
        onClose();
        } catch (error) {
        toast.error("Lỗi: " + error.message);
        }
    };

    return (
        <>
        <Dialog open={openProductReview} onClose={handleCloseProductReview}>
        <DialogTitle>Đánh giá {variantName}</DialogTitle>
        <DialogContent sx={{width: 500}}>
            <TextField
            label="Nội dung đánh giá"
            fullWidth
            multiline
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            disabled={isViewOnly}
            sx={{marginTop: 2}}
            />

            <Rating
            name="rating"
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            precision={1}
            disabled={isViewOnly}
            sx={{ display: "flex", justifyContent: "center", mx: "auto", mt: 2 }}
            />
        </DialogContent>
        <DialogActions>
            {isViewOnly?(
                <Button onClick={()=> handleCloseProductReview()}>Đóng</Button>
            ):(
            <>
                <Button onClick={()=> handleCloseProductReview()}>Hủy</Button>
                <Button variant="contained" color="primary" onClick={handleSubmitReview}>
                Gửi đánh giá
                </Button>
            </>
            )}
        </DialogActions>
        </Dialog>



        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Chọn sản phẩm để đánh giá</DialogTitle>
            <DialogContent>
                <List>
                {selectedOrder?.orderItems?.map((item) => (
                    <ListItem
                    key={item.variantId}
                    secondaryAction={
                        reviews?.some(itemR => itemR.variantName == `${item.productName} (${item.color}, ${item.storage})`)?
                        (<Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleOpenProductReview(item.productId,`${item.productName} (${item.color}, ${item.storage})`)}
                            >
                            Xem đánh giá
                        </Button>):
                        (<Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleOpenProductReview(item.productId,`${item.productName} (${item.color}, ${item.storage})`)}
                            >
                            Đánh giá
                        </Button>)   
                    }
                    >
                    <ListItemText
                        primary={`${item.productName} (${item.color}, ${item.storage})`}
                    />
                    </ListItem>
                ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Đóng</Button>
            </DialogActions>
        </Dialog>
        </>
    );
    }
