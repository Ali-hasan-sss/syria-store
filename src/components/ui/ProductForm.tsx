import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Rating, Typography } from "@mui/material";
import CategorySelect from "./categorySelect";
import FileUpload from "./FileUploadDialog";

export interface AddProductForm {
  name: string;
  price: number;
  images: string[];
  rate?: number;
  description: string;
  phone: string;
  category_id: string;
}

interface ProductFormProps {
  initialData?: AddProductForm;
  onChange: (data: AddProductForm) => void;
  onUploadingStatusChange?: (uploading: boolean) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onChange,
  onUploadingStatusChange,
}) => {
  const [formData, setFormData] = useState<AddProductForm>({
    name: initialData?.name || "",
    price: initialData?.price || 0,
    images: initialData?.images || [],
    rate: initialData?.rate || 0,
    description: initialData?.description || "",
    phone: initialData?.phone || "",
    category_id: initialData?.category_id || "",
  });
  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "rate" ? Number(value) : value,
    }));
  };

  // دالة تستقبل أسماء الملفات وروابطها بعد الرفع
  const handleFilesUpload = (
    fileNames: string[] | string,
    fileUrls: string[] | string
  ) => {
    if (Array.isArray(fileUrls)) {
      // إذا رفع متعدد ملفات
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...fileUrls],
      }));
    } else {
      // رفع ملف واحد فقط
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, fileUrls],
      }));
    }
  };

  return (
    <div style={{ padding: 3, maxWidth: 600, margin: "0 auto" }}>
      <TextField
        name="name"
        label="اسم المنتج"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        margin="normal"
      />

      <TextField
        name="price"
        label="السعر"
        type="number"
        value={formData.price}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        margin="normal"
        onFocus={(e) => e.target.select()}
        slotProps={{
          input: {
            inputProps: {
              min: 0,
              inputMode: "numeric",
              style: { textAlign: "right" },
            },
          },
        }}
        sx={{
          "& input[type=number]": {
            MozAppearance: "textfield",
          },
          "& input[type=number]::-webkit-outer-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "& input[type=number]::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
        }}
      />

      <TextField
        name="description"
        label="الوصف"
        value={formData.description}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        margin="normal"
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 16,
          gap: 8,
          direction: "ltr",
        }}
      >
        <Rating
          name="rate"
          value={formData.rate}
          precision={0.5}
          onChange={(e, newValue) => {
            setFormData((prev) => ({ ...prev, rate: newValue || 0 }));
          }}
          sx={{ direction: "ltr" }}
        />
      </div>
      <TextField
        name="phone"
        label="رقم الهاتف"
        value={formData.phone}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        margin="normal"
      />

      <CategorySelect value={formData.category_id} onChange={handleChange} />

      {/* هنا تستدعي FileUpload مع خاصية multiple حسب حاجتك */}
      <FileUpload
        multiple
        onUploadSuccess={handleFilesUpload}
        onUploadingStatusChange={onUploadingStatusChange}
      />

      {/* إذا تريد عرض أسماء الملفات المرفوعة مثلاً: */}
      {formData.images.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <Typography variant="subtitle1">الملفات المرفوعة:</Typography>
          <ul>
            {formData.images.map((img, idx) => (
              <li key={idx}>{img}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductForm;
