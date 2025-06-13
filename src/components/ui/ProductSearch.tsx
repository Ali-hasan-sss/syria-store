"use client";
import React, { useEffect, useState } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Search, Tune, Close } from "@mui/icons-material";
import { useAppSelector } from "@/store/hooks";
import api from "@/utils/axios";
import { SearchProduct } from "../../../types/userType";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const [result, setResult] = useState<SearchProduct[]>([]);
  const [openFilters, setOpenFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const categories = useAppSelector((state) => state.categories.categories);

  const isFilterApplied = minPrice || maxPrice || category;
  const prices = [
    0, 100, 300, 500, 1000, 2000, 5000, 10000, 25000, 50000, 100000,
  ];
  const handleSearch = async () => {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (category) params.append("category", category);

    const url = `products/search?${params.toString()}`;
    setLoading(true);
    if (query) {
      const res = await api.get(url);
      setResult(res.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (!query.trim()) {
      setResult([]);
    }
  }, [query]);
  const handleClear = () => {
    setQuery("");
    setMinPrice("");
    setMaxPrice("");
    setCategory("");
    setResult([]);
  };

  return (
    <div className="w-full max-w-xl mx-auto relative p-4">
      {/* حقل البحث وأيقونات الفلترة والبحث */}
      <div className="flex items-center gap-2">
        <TextField
          fullWidth
          variant="outlined"
          color="warning"
          placeholder="ابحث عن منتج أو فئة"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          inputProps={{ style: { direction: "rtl", borderRadius: "20px" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={() => setOpenFilters(true)}>
                  <Tune />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {loading ? (
                  <CircularProgress color="warning" size={20} />
                ) : (
                  <IconButton onClick={handleSearch}>
                    <Search />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
          required
        />

        {/* زر إلغاء الفلاتر فقط إذا تم تطبيق فلتر */}
        {isFilterApplied && (
          <div className="flex items-center flex-wrap gap-3">
            <IconButton onClick={handleClear}>
              <Close />
            </IconButton>
            {/* {categories && (
              <span className="rounded-full bg-secondary-light">
                {category}
              </span>
            )} */}
          </div>
        )}
      </div>

      {result.length > 0 && (
        <Paper className="absolute z-10 w-[330px] z-50  mt-2 p-4 bg-primary shadow-md max-h-60 overflow-y-auto">
          {result.map((item) => (
            <div
              key={item._id}
              className="p-2 border-b flex items-center gap-4 rounded-lg last:border-none text-right cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => router.push(`/store/${item._id}`)}
            >
              <Image
                src={item.images[0] || "/images/probuct.png"}
                alt={`Product`}
                width={50}
                height={50}
                className="object-contain  rounded"
              />
              <div className="flex flex-col">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">
                  {item?.category_id?.name || "-"}
                </p>
                <p className="text-sm text-green-600">
                  السعر: {item.price} ل.س
                </p>
              </div>
            </div>
          ))}
        </Paper>
      )}

      {/* نافذة الفلاتر */}
      <Dialog
        open={openFilters}
        onClose={() => setOpenFilters(false)}
        dir="rtl"
      >
        <DialogTitle>تصفية متقدمة</DialogTitle>
        <DialogContent className="flex flex-col mt-2 w-[290px] gap-4">
          <TextField
            label="الفئة"
            select
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="number"
            label="الحد الأدنى"
            select
            fullWidth
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          >
            {prices.map((price, idx) => (
              <MenuItem key={idx} value={price}>
                {price}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="number"
            label="الحد الأعلى"
            select
            fullWidth
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          >
            {prices
              .filter((price) => !minPrice || price > parseInt(minPrice))
              .map((price, idx) => (
                <MenuItem key={idx} value={price}>
                  {price}
                </MenuItem>
              ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFilters(false)}>إلغاء</Button>
          <Button
            onClick={() => {
              setOpenFilters(false);
              handleSearch();
            }}
            variant="contained"
          >
            تطبيق
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
