import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductCard from "../ui/ProductCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import {
  fetchLatestProducts,
  fetchTopRatedProducts,
} from "@/store/features/products/productSlice";
import useMobile from "../hooks/useMobile";
import useTablet from "../hooks/useTablet";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

type ProductSliderProps = {
  type: "latest" | "top-rated";
};

export default function ProductSlider({ type }: ProductSliderProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const products = useAppSelector((state) => state.products.products);
  const loading = useAppSelector((state) => state.products.loading);
  const isMobile = useMobile();
  const isTablet = useTablet();

  useEffect(() => {
    if (type === "latest") {
      dispatch(fetchLatestProducts());
    } else if (type === "top-rated") {
      dispatch(fetchTopRatedProducts());
    }
  }, [dispatch, type]);

  if (loading) {
    return <CircularProgress size={30} color="warning" />;
  }

  const title =
    type === "latest"
      ? " المنتجات الأحدث في السوق السوري"
      : " المنتجات الأعلى تقييماً";

  return (
    <div className="relative px-1 md:px-10 py-5">
      <h2 className="text-gray-200 text-center text-2xl dark:text-white my-5">
        {title}
      </h2>
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={isMobile ? 1 : isTablet ? 2 : 3}
        loop
        className="py-4"
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <div className="w-[300px] mx-auto">
              <ProductCard product={product} onEdit={() => {}} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="w-full flex items-center justify-center py-5">
        <button
          onClick={() => router.push("/store")}
          className="px-6 py-2 bg-secondary-light text-gray-600 hover:text-gray-100 font-semibold rounded-lg shadow hover:bg-secondary-dark transition"
        >
          تصفح كل المنتجات
        </button>
      </div>
    </div>
  );
}
