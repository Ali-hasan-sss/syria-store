"use client";

import ProductCard from "@/components/ui/ProductCard";
import { RootState } from "@/store";
import {
  AddProduct,
  fetchProducts,
  fetchProductsByCategory,
  updateProduct,
} from "@/store/features/products/productSlice";
import { useAppDispatch } from "@/store/hooks";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AddProductForm, Product } from "../../../../../types/userType";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  useTheme,
} from "@mui/material";
import ProductForm from "@/components/ui/ProductForm";
import CategoriesTap from "@/components/ui/categoriesTab";
import PriceRangeSelect from "@/components/ui/PriceRangeSelect";
import { Close } from "@mui/icons-material";
import Pagination from "@/components/ui/Pagination";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const products = useSelector((state: RootState) => state.products.products);
  const total = useSelector(
    (state: RootState) => state.products.pagination?.total
  );
  const totalPages = useSelector(
    (state: RootState) => state.products.pagination?.totalPages
  );
  const loadingPage = useSelector((state: RootState) => state.products.loading);
  const error = useSelector((state: RootState) => state.products.error);
  const [openModal, setOpenModal] = useState(false);
  const [openPriceRange, setOpenPriceRange] = useState(false);
  const [editId, setEditId] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [priceRange, setPriceRange] = useState<{
    minPrice?: number;
    maxPrice?: number;
  }>({});
  const [foemData, setFormData] = useState<AddProductForm>({
    name: "",
    price: 0,
    images: [],
    rate: 0,
    description: "",
    phone: "",
    category_id: "",
  });

  const onCategoryCange = (category: string) => {
    setSelectCategory(category);
  };

  const handlePriceChange = (range: {
    minPrice?: number;
    maxPrice?: number;
  }) => {
    setPriceRange(range);
  };

  useEffect(() => {
    const hasPriceRange =
      priceRange.minPrice !== undefined && priceRange.maxPrice !== undefined;

    const payload = {
      page: currentPage,
      pageSize: 10,
      ...(hasPriceRange ? priceRange : {}),
    };

    if (selectCategory) {
      dispatch(
        fetchProductsByCategory({ categoryId: selectCategory, ...payload })
      );
    } else {
      dispatch(fetchProducts(payload));
    }
  }, [selectCategory, priceRange, currentPage, dispatch]);

  const handleAdd = () => {
    setIsNew(true);
    setFormData({
      name: "",
      price: 0,
      description: "",
      category_id: "",
      images: [],
      rate: 0,
      phone: "",
    });
    setOpenModal(true);
  };
  const onchange = (data: AddProductForm) => {
    console.log(data);
    setFormData(data);
  };

  const handleSubmit = async () => {
    try {
      if (isNew) {
        setLoading(true);
        await dispatch(AddProduct(foemData));
        setOpenModal(false);
      } else {
        await dispatch(updateProduct({ id: editId, updatedData: foemData }));
        setOpenModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  if (loadingPage)
    return (
      <div className="h-[90vh] flex items-center justify-center ">
        <CircularProgress size={40} color="warning" />
      </div>
    );
  if (error)
    return (
      <div className="h-[90vh] flex items-center justify-center ">
        <p className="text-red-500">{error}</p>
      </div>
    );
  return (
    <div className="py-4 px-1 md:px-10">
      <CategoriesTap value={selectCategory} onChange={onCategoryCange} />
      {openPriceRange ? (
        <div className="my-2 relative w-full">
          <IconButton
            onClick={() => setOpenPriceRange(false)}
            className="absolute top-0 left-0 z-10 bg-white dark:bg-gray-800 shadow"
            size="small"
          >
            <Close fontSize="small" />
          </IconButton>

          {/* مكون تحديد السعر */}
          <PriceRangeSelect onChange={handlePriceChange} value={priceRange} />
        </div>
      ) : (
        <div className="my-2 relative">
          <button
            onClick={() => setOpenPriceRange(true)}
            className="text-yellow-500 rounded py-1 px-2 border border-secondary hover:bg-secondary-light/10"
          >
            تحديد نطاق السعر
          </button>
        </div>
      )}

      <div className="py-10 px-1 relative md:px-10 flex flex-wrap items-center justify-around gap-5">
        <button
          onClick={handleAdd}
          className="pb-1 w-[50px] h-[50px] z-20 absolute p-0 bottom-4 left-4 rounded-full text-3xl dark:text-white text-gray-100 font-bold bg-secondary hover:bg-secondary-dark dark:bg-secondary dark:hover:bg-secondary-dark"
        >
          +
        </button>

        {products.map((item: Product) => (
          <ProductCard
            key={item._id}
            product={item}
            onEdit={(product) => {
              setIsNew(false);
              setEditId(product._id);
              setFormData({
                name: product.name,
                phone: product.phone,
                price: product.price,
                description: product.description,
                rate: product.averageRating,
                images: product.images,
                category_id: product.category,
              });
              setOpenModal(true);
            }}
          />
        ))}
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="edit-dialog-user"
          aria-describedby="edit-dialog-description"
          slotProps={{
            paper: {
              sx: {
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              },
            },
          }}
        >
          <DialogTitle id="confirm-dialog-title">
            {isNew ? "اضافة منتج" : "تعديل المنتج"}
          </DialogTitle>
          <DialogContent>
            <ProductForm
              onChange={(data) => onchange(data)}
              initialData={foemData}
              onUploadingStatusChange={(uploading) => {
                setButtonDisabled(uploading);
              }}
            />
          </DialogContent>
          <DialogActions className="gap-4 w-full">
            <Button onClick={() => setOpenModal(false)} color="inherit">
              إلغاء
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={buttonDisabled}
              variant="contained"
              color="success"
              autoFocus
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "حفظ"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Pagination
        pagination={{
          total: total || 0,
          page: currentPage,
          pageSize: 10,
          totalPages: totalPages || 1,
        }}
        onPageChange={(newPage) => {
          setCurrentPage(newPage);
        }}
      />
    </div>
  );
}
