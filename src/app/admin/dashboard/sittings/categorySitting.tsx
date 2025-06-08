import ConfirmMessage from "@/components/ui/confirm_message";
import { RootState } from "@/store";
import {
  addCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "@/store/features/categories/categoriesSlice";
import { useAppDispatch } from "@/store/hooks";
import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function CategorySettings() {
  const theme = useTheme();
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [name, setName] = useState("");
  const [edit, setEdit] = useState("");
  const categoraies = useSelector(
    (state: RootState) => state.categories.categories
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async () => {
    if (isNew) {
      setLoading(true);
      await dispatch(addCategory(name));
      setLoading(false);
      setOpenModal(false);
    } else {
      setLoading(true);
      await dispatch(updateCategory({ id: edit, name: name }));
      setLoading(false);
      setOpenModal(false);
    }
  };
  const handleDelete = async () => {
    setLoading(true);
    await dispatch(deleteCategory(edit));
    setLoading(false);
  };
  return (
    <div>
      <div className="flex item-center justify-between">
        <h2 className="text-xl font-bold mb-4">إدارة الفئات</h2>{" "}
        <Button
          onClick={() => {
            setIsNew(true);
            setEdit("");
            setName("");
            setOpenModal(true);
          }}
        >
          اضافة فئة
        </Button>{" "}
      </div>
      <div className="text-gray-500 dark:text-gray-300">
        <ul>
          {categoraies.map((item) => (
            <li
              key={item._id}
              className="flex items-center border-b border-secondary justify-between hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <p>{item.name}</p>{" "}
              <div className="flex items-center">
                <IconButton
                  onClick={() => {
                    setName(item.name);
                    setIsNew(false);
                    setEdit(item._id);
                    setOpenModal(true);
                  }}
                >
                  <Edit className="text-yellow-600" />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setOpenDelete(true);
                    setEdit(item._id);
                  }}
                >
                  <Delete className="text-red-600" />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      </div>
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
          {isNew ? "اضافة فئة" : "تعديل الفئة"}
        </DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="اسم الفئة"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
          />
        </DialogContent>
        <DialogActions className="gap-4 w-full">
          <Button onClick={() => setOpenModal(false)} color="inherit">
            إلغاء
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="success"
            autoFocus
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "حفظ"}
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmMessage
        message="هل انت متأكد من حذف الفئة"
        onConfirm={handleDelete}
        onCancel={() => setOpenDelete(false)}
        open={openDelete}
        loading={loading}
      />
    </div>
  );
}
