import React from "react";
import { useState, useEffect } from "react";
import { Rating, Select, MenuItem } from "@mui/material";
import { FaStar, FaClock, FaChevronLeft, FaChevronRight, FaUserCircle } from "react-icons/fa";
import { getRatingInformation, getReviewsOfProduct } from "../../../services/api";
import { toast } from "react-toastify";

const ProductReview = ({productId}) => {
    const [selectedRating, setSelectedRating] = useState("All");
    const [ratingData, setRatingData] = useState([]);
    const [reviews, setReviewsData] = useState([]);
    const [displayReviews, setDisplayReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState([]);
    const [totalPages, setTotalPages] = useState(null);
    const pageSize = 5;

    useEffect(() => {
        const fetchData = async () => {
            await getRatingData();
    
            const response = await getReviewsOfProduct(productId);
            if (response) {
                setReviewsData(response);
            } else {
                toast.error("Không thể lấy dữ liệu đánh giá");
            }
        };
        fetchData();
    }, []);
    
    useEffect(() => {
        if (reviews.length > 0) {
            setDisplayReviews(reviews);
        }
    }, [reviews]);
    
    useEffect(() => {
        if (displayReviews.length > 0) {
            setTotalPages(Math.ceil(displayReviews.length / pageSize));
            setPaginatedData(
                displayReviews.slice(
                    (currentPage - 1) * pageSize,
                    currentPage * pageSize
                )
            );
        }
    }, [displayReviews, currentPage]);
    
    const onChangeSelect = (selectedValue) => {
        if(selectedValue === "All" ){
            setDisplayReviews(reviews);
            setSelectedRating("All");
        }
        else{
            setSelectedRating(selectedValue);
            const data = reviews.filter(r => r.rating === selectedValue);
            if(data) setDisplayReviews(data);
            else setDisplayReviews([]);
            
        }
    }

    const getRatingData = async () => {
        try{
            const response = await getRatingInformation(productId);
            if(response){
                setRatingData(response);
            }else{
                toast.error("Không thể lấy dữ liệu đánh giá");
            }
        }
        catch(error){
            toast("Lỗi khi lấy dữ liệu"+ error);
        }
    }

    const countRating = ratingData?.ratingStarList?.map(item => {
        return (
          <div key={item.star} className="flex items-center space-x-2 ml-5">
            <span>{item.star}</span>
            <FaStar />
            <div className="flex-1 h-2 rounded-full bg-neutral-700 ml-5">
              <div
                className="h-2 rounded-full bg-red-700"
                style={{ width: `${ratingData.ratingCount > 0
                    ? (item.reviewsCount / ratingData.ratingCount) * 100
                    : 0}%` }}
              ></div>
            </div>
            <span className="text-sm text-neutral-300 mx-5">{item.reviewsCount} đánh giá</span>
          </div>
        );
    });

    const review = paginatedData.length > 0 ? paginatedData.map((item, index) => {
        return (
            <div key={index} className="border-b p-5 mt-5">
                <div className="flex">
                    <div className="mr-3">
                        <FaUserCircle size={30} className="text-gray-400" />
                    </div>
                    <div>
                        <div className="flex">
                            <div className="font-bold text-base mr-5">{item.username}</div>
                            <div className="flex text-gray-400 text-sm mt-1">
                                <FaClock className="pt-1 mt-0.5"/>{item.createdAt.split("T")[0]}
                            </div>
                        </div>
                        <div className="flex text-gray-400 text-sm">{item.variantName}</div>
                        <Rating value={item.rating} precision={1} readOnly size="small" className="mt-2"></Rating>
                        <div className="text-sm mt-2">{item.comment}</div>
                    </div>
                </div>
            </div>
        );
    }) : null;

    return (
        <div className="border border-gray-200 rounded-lg p-5 h-full mt-10">
            <h3 className="text-lg font-bold mb-4">Đánh giá & nhận xét sản phẩm</h3>
            <div className="grid grid-cols-2 gap-2 border-b pb-5">
                <div className="border-r border-gray-200 py-10">
                    <div className="flex flex-col justify-center items-center gap-1">
                        <div className="text-2xl font-bold">{ratingData.averageRating}/5.0</div>
                        <Rating value={ratingData?.averageRating ?? 0} precision={0.1} size="small"></Rating>
                        <div className="underline">{ratingData.ratingCount} đánh giá</div>
                    </div>
                </div>
                <div>
                    {countRating}
                </div>
            </div>
            <div className="flex mt-2">
                <h4 className="text-lg font-bold mt-5 mr-5">Lọc theo</h4>
                <Select 
                    value={selectedRating}
                    size="small"
                    sx={{ marginTop: 2, width: 100 }}
                    onChange={(e) => onChangeSelect(e.target.value)}
                    renderValue={(selected) => {
                        if (selected === "All") return "Tất cả";
                        return (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '4px' }}>{selected}</span>
                                <FaStar />
                            </div>
                        );
                    }}
                >
                    <MenuItem value="All">Tất cả</MenuItem>
                    <MenuItem value={1}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '4px' }}>1</span>
                            <FaStar />
                        </div>
                    </MenuItem>
                    <MenuItem value={2}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '4px' }}>2</span>
                            <FaStar />
                        </div>
                    </MenuItem>
                    <MenuItem value={3}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '4px' }}>3</span>
                            <FaStar />
                        </div>
                    </MenuItem>
                    <MenuItem value={4}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '4px' }}>4</span>
                            <FaStar />
                        </div>
                    </MenuItem>
                    <MenuItem value={5}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '4px' }}>5</span>
                            <FaStar />
                        </div>
                    </MenuItem>
                </Select>
            </div>
            {(displayReviews.length !== 0) ? (
                <div>
                    {review}
                    <div className="flex gap-2 mt-4 justify-center items-center">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="border rounded-md p-2 bg-violet-600 w-10 h-10 text-white flex justify-center items-center"
                        >
                            <FaChevronLeft />
                        </button>

                        <span>Trang {currentPage} / {totalPages}</span>

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="border rounded-md p-2 bg-violet-600 w-10 h-10 text-white flex justify-center items-center"
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="h-50 flex justify-center items-center">
                    <p>Hiện chưa có đánh giá nào thỏa mãn</p>
                </div>
            )}
        </div>
    );
}

export default ProductReview;