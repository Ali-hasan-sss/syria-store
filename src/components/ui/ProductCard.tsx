"use client";

import Image from "next/image";
import { useState } from "react";
import { IconButton, MenuItem, Menu, Button, Rating } from "@mui/material";
import { MenuRounded, Send } from "@mui/icons-material";
import { Product } from "../../../types/userType";
import { useAppDispatch } from "@/store/hooks";
import {
  deleteProduct,
  updateProductRate,
  updateProductStatus,
} from "@/store/features/products/productSlice";
import ConfirmMessage from "./confirm_message";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { IsLoggedIn } from "@/store/features/Auth/authSlice";
import ClientOnly from "../hooks/ClientOnly";
import BuyButton from "./bayButton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit }) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openRate, setOpenRate] = useState(false);
  const [rate, setRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const isAdmin = useSelector(
    (state: RootState) => state.auth.user?.role === "ADMIN"
  );
  const isLoggedIn = useSelector(IsLoggedIn);
  const dispatch = useAppDispatch();
  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(id);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleView = (id: string) => {
    console.log("view:", id);
  };
  const handleAcceptFinish = (status: number, id: string) => {
    setLoading(true);
    dispatch(updateProductStatus({ id: id, status: status }));
    setLoading(false);
  };
  const handleDelete = (id: string) => {
    setLoading(true);
    dispatch(deleteProduct(id));
    setLoading(false);
  };
  const handleRating = (id: string) => {
    dispatch(updateProductRate({ id: id, rate: rate }));
    setOpenRate(false);
  };

  return (
    <div className="relative w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      {isAdmin && (
        <IconButton
          onClick={(event) => handleMenuOpen(event, 5)}
          style={{
            position: "absolute",
            background: "#F6E05E",
            top: "0",
            left: "0",
            zIndex: "10",
          }}
          color="warning"
        >
          <MenuRounded className="text-gray-600 text-lg" />
        </IconButton>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && selectedRow === 5}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            minWidth: "200px",
          },
        }}
      >
        <MenuItem onClick={() => handleView(product._id)}>عرض المنتج</MenuItem>
        <MenuItem onClick={() => onEdit(product)}>تعديل</MenuItem>
        <MenuItem
          onClick={() => handleAcceptFinish(1, product._id)}
          disabled={loading}
        >
          نشر
        </MenuItem>
        <MenuItem
          onClick={() => handleAcceptFinish(2, product._id)}
          disabled={loading}
        >
          تعيين ك مباع
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDeleteId(product._id);
            setOpenDelete(true);
          }}
        >
          حذف
        </MenuItem>
      </Menu>
      <div className="relative">
        {product.images.length > 0 ? (
          <Swiper
            modules={[Navigation]}
            navigation={true}
            spaceBetween={10}
            slidesPerView={1}
            className="rounded-t-lg"
          >
            {product.images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="h-[200px] relative">
                  <Image
                    src={img}
                    alt={`Product ${idx}`}
                    fill
                    unoptimized
                    className="object-cover rounded-t-lg"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="h-[200px] relative">
            <Image
              src="/images/probuct.png"
              alt="Product"
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
        )}
      </div>

      <div className="px-5 py-2 pb-3 ">
        <div className="flex items-Center justify-between">
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {product.name}
          </h5>
          <Button onClick={() => handleView(product._id)}>عرض التفاصيل</Button>
        </div>

        <div className="flex items-center mt-2.5 mb-5">
          {!openRate && (
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < product.averageRating
                      ? "text-yellow-300"
                      : "text-gray-200 dark:text-gray-600"
                  }`}
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
              ))}
            </div>
          )}
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800 ms-3">
            {product.averageRating.toFixed(1)}
          </span>
          <ClientOnly>
            {isLoggedIn && (
              <Button
                onClick={() => {
                  if (openRate) {
                    handleRating(product._id);
                  } else {
                    setOpenRate(true);
                  }
                }}
                className="py-1 px-2"
              >
                {openRate ? <Send className="text-green-400" /> : "اضافة تقييم"}
              </Button>
            )}
          </ClientOnly>

          {openRate && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                direction: "ltr",
              }}
            >
              <Rating
                name="rate"
                value={rate}
                precision={0.5}
                onChange={(e, newValue) => {
                  setRate(newValue || 0);
                }}
                sx={{ direction: "ltr" }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-green-600">
            ${product.price}
          </span>
          <BuyButton
            isLoggedIn={isLoggedIn}
            productName={product.name}
            productId={product._id}
          />
        </div>
      </div>
      <ConfirmMessage
        message="هل انت متأكد من حذف المنتج؟"
        open={openDelete}
        onCancel={() => setOpenDelete(false)}
        onConfirm={() => handleDelete(deleteId)}
        loading={loading}
      />
    </div>
  );
};

export default ProductCard;
