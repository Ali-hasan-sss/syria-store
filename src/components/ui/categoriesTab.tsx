import { RootState } from "@/store";
import { fetchCategories } from "@/store/features/categories/categoriesSlice";
import { useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import { useSelector } from "react-redux";

interface CategoriesTapProps {
  onChange: (selectCategory: string) => void;
  value: string;
}

export default function CategoriesTap({ onChange, value }: CategoriesTapProps) {
  const Categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (Categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, Categories.length]);

  return (
    <div className="flex border border-secondary bg-primary rounded-lg py-1 px-4 w-full items-center gap-4 overflow-x-auto scrollbar-hide">
      <button
        onClick={() => onChange("")}
        className={`px-2 z-10 py-1 rounded-lg hover:bg-secondary hover:text-white cursor-pointer ${
          value === "" ? "bg-secondary text-white" : " bg-white"
        }`}
      >
        الكل
      </button>
      {Categories.map((item) => (
        <button
          key={item._id}
          onClick={() => onChange(item._id)}
          className={`px-2 z-10 py-1 rounded-lg hover:bg-secondary hover:text-white cursor-pointer whitespace-nowrap ${
            value === item._id ? "bg-secondary text-white" : " bg-white"
          }`}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}
