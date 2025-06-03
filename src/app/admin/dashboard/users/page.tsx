"use client";

import DynamicTable from "@/components/table/table";
import ConfirmMessage from "@/components/ui/confirm_message";
import UserForm from "@/components/ui/userFoem";
import {
  deleteUser,
  fetchUsers,
  updateUser,
  User,
} from "@/store/features/admin_Store/usersSlise";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UsarPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleted, setDeleted] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoaging] = useState(false);
  const [viewUser, setViewUser] = useState(false);
  const [userView, setUserView] = useState<User>();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users);
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);
  const [editing, setEditing] = useState<{
    _id: string;
    name: string;
    email: string;
    phone_num: string;
  }>({ _id: "", name: "", email: "", phone_num: "" });
  const columns = [
    { id: "name", label: "الاسم" },
    { id: "email", label: "البريد الالكتروني" },
    { id: "phone_num", label: "رقم الهاتف" },
    { id: "role", label: "الصلاحية" },
    { id: "isActive", label: "الحالة" },
  ];
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNum: "",
  });

  const handleFormChange = (data: typeof userFormData) => {
    setUserFormData(data);
    console.log(userFormData);
  };

  const handleEdit = async () => {
    try {
      setLoaging(true);
      await dispatch(
        updateUser({ id: editing._id, userData: userFormData })
      ).unwrap();
      toast.success("تم تعديل بيانات المستخدم بنجاح");
      setOpenModal(false);
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء التعديل");
    } finally {
      setLoaging(false);
    }
  };
  const handleToggleActive = async (user: User) => {
    try {
      setLoaging(true);
      await dispatch(
        updateUser({ id: user._id, userData: { isActive: !user.isActive } })
      ).unwrap();
      toast.success(`تم ${user.isActive ? "تعطيل" : "تفعيل"} المستخدم بنجاح`);
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء تعديل حالة التفعيل");
    } finally {
      setLoaging(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoaging(true);
      await dispatch(deleteUser(deleted)).unwrap();
      toast.success("تم حذف المستخدم بنجاح");
      setConfirmOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء الحذف");
    } finally {
      setLoaging(false);
    }
  };

  return (
    <div className="flex flex-col px-5 py-20">
      <DynamicTable
        columns={columns}
        data={users}
        onDelete={(item) => {
          setDeleted(item._id);
          setConfirmOpen(true);
        }}
        onEdit={(item) => {
          setEditing({
            _id: item._id,
            name: item.name,
            email: item.email,
            phone_num: item.phone_num,
          });
          setUserFormData({
            name: item.name,
            email: item.email,
            password: "",
            phoneNum: item.phone_num,
          });
          setOpenModal(true);
        }}
        onToggleActive={(user) => handleToggleActive(user as User)}
        onView={(item) => {
          setViewUser(true);
          setUserView(item as User);
        }}
      />
      <ConfirmMessage
        loading={loading}
        open={confirmOpen}
        message="هل أنت متأكد من حذف هذا المستخدم؟"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />

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
        <DialogTitle id="confirm-dialog-title">تعديل المستخدم</DialogTitle>
        <DialogContent>
          <UserForm onChange={handleFormChange} initialData={editing} />
        </DialogContent>
        <DialogActions className="gap-4 w-full">
          <Button onClick={() => setOpenModal(false)} color="inherit">
            إلغاء
          </Button>
          <Button
            onClick={handleEdit}
            variant="contained"
            color="success"
            autoFocus
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "حفظ"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={viewUser}
        onClose={() => setViewUser(false)}
        aria-labelledby="view-dialog-user"
        aria-describedby="view-dialog-description"
        slotProps={{
          paper: {
            sx: {
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              width: "500px",
            },
          },
        }}
      >
        <DialogTitle id="view-dialog-title">بيانات المستخدم </DialogTitle>
        <DialogContent className="space-y-2">
          {userView && (
            <>
              <h1>الاسم: {userView.name}</h1>
              <h1>الايميل: {userView.email}</h1>
              <h1>رقم الموبايل: {userView.phone_num}</h1>
              <h1>الصلاحية: {userView.role}</h1>
            </>
          )}
        </DialogContent>
        <DialogActions className="gap-4 w-full">
          <Button onClick={() => setViewUser(false)} color="error">
            إغلاق
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
