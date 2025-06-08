import { useEffect } from "react";
import { TextField, MenuItem, CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/features/categories/categoriesSlice";

interface CategorySelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <TextField
      select
      name="category_id"
      label="المجموعة"
      value={value}
      onChange={onChange}
      fullWidth
      variant="outlined"
      margin="normal"
      disabled={loading}
    >
      {loading ? (
        <MenuItem disabled>
          <CircularProgress size={20} />
          جاري التحميل...
        </MenuItem>
      ) : (
        categories.map((category) => (
          <MenuItem key={category._id} value={category._id}>
            {category.name}
          </MenuItem>
        ))
      )}
    </TextField>
  );
};

export default CategorySelect;
