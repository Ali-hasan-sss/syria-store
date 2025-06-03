import React, { useEffect, useState } from "react";
import api from "@/utils/axios";
import { IconButton, styled, Switch, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import clsx from "clsx"; // npm install clsx

interface Column {
  id: string;
  label: string;
}

interface DynamicTableProps {
  columns: Column[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>[];
  apiUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onView?: (row: Record<string, any>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEdit?: (row: Record<string, any>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDelete?: (row: Record<string, any>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onToggleActive?: (row: Record<string, any>) => void;
}
const CustomSwitch = styled(Switch)(({}) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#4ade80", // اللون عند التشغيل (لون المقبض)
    "& + .MuiSwitch-track": {
      backgroundColor: "#4ade80", // لون الخلفية عند التشغيل
    },
  },
  "& .MuiSwitch-switchBase": {
    color: "#ef4444", // اللون عند الإطفاء (لون المقبض)
    "& + .MuiSwitch-track": {
      backgroundColor: "#ef4444", // لون الخلفية عند الإطفاء
    },
  },
}));
const DynamicTable: React.FC<DynamicTableProps> = ({
  columns,
  data,
  apiUrl,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fetchedData, setFetchedData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!data && apiUrl) {
      setLoading(true);
      api
        .get(apiUrl)
        .then((res) => {
          setFetchedData(res.data);
          setError(null);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setError("فشل في جلب البيانات");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [apiUrl, data]);

  const rows = data || fetchedData;
  const hasActions = onView || onEdit || onDelete;

  return (
    <div className="relative overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      {loading ? (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          جاري التحميل...
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-500">{error}</div>
      ) : (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-100 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3">#</th>
              {columns.map((column) => (
                <th key={column.id} className="px-6 py-3">
                  {column.label}
                </th>
              ))}
              {hasActions && (
                <th className="px-6 py-3 text-center">الإجراءات</th>
              )}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => {
              const rowClasses = clsx(
                rowIndex % 2 === 0
                  ? "bg-white dark:bg-gray-800"
                  : "bg-gray-50 dark:bg-gray-900",
                "border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              );

              return (
                <tr key={rowIndex} className={rowClasses}>
                  <td className="px-6 py-4 font-bold">{rowIndex + 1}</td>
                  {/* الترقيم */}
                  {columns.map((column) => (
                    <td key={column.id} className="px-6 py-4">
                      {column.id === "isActive" && onToggleActive ? (
                        <CustomSwitch
                          checked={row[column.id]}
                          onChange={() => onToggleActive(row)}
                        />
                      ) : (
                        row[column.id]
                      )}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-6 py-4 min-w-[150px] text-center space-x-1 space-x-reverse">
                      {onView && (
                        <Tooltip title="عرض التفاصيل">
                          <IconButton onClick={() => onView(row)} size="small">
                            <VisibilityIcon fontSize="small" color="primary" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onEdit && (
                        <Tooltip title="تعديل">
                          <IconButton onClick={() => onEdit(row)} size="small">
                            <EditIcon fontSize="small" color="warning" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDelete && (
                        <Tooltip title="حذف">
                          <IconButton
                            onClick={() => onDelete(row)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DynamicTable;
