// components/PriceRangeSelect.tsx
import { Check, Close } from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Box,
  IconButton,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  onChange: (range: { minPrice?: number; maxPrice?: number }) => void;
  value: { minPrice?: number; maxPrice?: number };
}

export default function PriceRangeSelect({ onChange, value }: Props) {
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const theme = useTheme();

  useEffect(() => {
    setMinPrice(value.minPrice ?? "");
    setMaxPrice(value.maxPrice ?? "");
  }, [value]);

  const priceOptions = [
    0, 100, 200, 300, 500, 1000, 5000, 10000, 20000, 25000, 50000, 100000,
  ];

  const handleApply = () => {
    if (minPrice !== "" && maxPrice !== "" && minPrice < maxPrice) {
      onChange({ minPrice, maxPrice });
    }
  };

  const handleClear = () => {
    setMinPrice("");
    setMaxPrice("");
    onChange({});
  };

  return (
    <Box
      sx={{
        backgroundColor: "transparent",
        border: `2px solid ${
          theme.palette.mode === "dark" ? "#F6E05E" : "#F6E05E"
        }`,
        borderRadius: 2,
        boxShadow: 1,
        p: 1,
        display: "flex",
        alignItems: "center",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>الحد الأدنى</InputLabel>
        <Select
          value={minPrice}
          label="الحد الأدنى"
          onChange={(e: SelectChangeEvent<number>) =>
            setMinPrice(Number(e.target.value))
          }
        >
          {priceOptions.map((price) => (
            <MenuItem key={price} value={price}>
              {price} $
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>الحد الأعلى</InputLabel>
        <Select
          value={maxPrice}
          label="الحد الأعلى"
          onChange={(e: SelectChangeEvent<number>) =>
            setMaxPrice(Number(e.target.value))
          }
        >
          {priceOptions
            .filter((price) => minPrice === "" || price > minPrice)
            .map((price) => (
              <MenuItem key={price} value={price}>
                {price} $
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      {maxPrice !== undefined && minPrice !== undefined && (
        <IconButton color="success" onClick={handleApply} size="small">
          <Check />
        </IconButton>
      )}
      {value.maxPrice !== undefined && value.minPrice !== undefined && (
        <IconButton color="error" onClick={handleClear} size="small">
          <Close />
        </IconButton>
      )}
    </Box>
  );
}
