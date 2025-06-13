import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import api from "@/utils/axios";

interface FileUploadProps {
  multiple?: boolean;
  onUploadSuccess: (
    fileNames: string[] | string,
    fileUrls: string[] | string
  ) => void;
  onUploadingStatusChange?: (uploading: boolean) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  multiple = false,
  onUploadSuccess,
  onUploadingStatusChange,
}) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<number>(0);

  const uploadFiles = async (files: File[]) => {
    setUploading(true);
    onUploadingStatusChange?.(true);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });

    try {
      const res = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
      });

      const data = res.data;

      const fileNames = multiple
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.map((file: any) => file.originalName)
        : data[0]?.originalName;

      const fileUrls = multiple
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.map((file: any) => file.imageUrl)
        : data[0]?.imageUrl;

      onUploadSuccess(fileNames, fileUrls);
      setSelectedFiles([]);
      setProgress(0);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء رفع الملفات");
    } finally {
      setUploading(false);
      onUploadingStatusChange?.(false);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const filesToUpload = multiple
        ? acceptedFiles
        : acceptedFiles.slice(0, 1);

      setSelectedFiles(filesToUpload);
      uploadFiles(filesToUpload);
    },
    [multiple]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: {
      "image/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
    },
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          ${
            isDragActive
              ? "bg-gray-200 dark:bg-gray-700"
              : "bg-gray-50 dark:bg-gray-800"
          }
          border-gray-300 dark:border-gray-600 transition-colors`}
      >
        <input {...getInputProps()} />
        <div className="flex justify-center text-gray-600 dark:text-gray-300">
          <CloudUploadIcon fontSize="large" />
        </div>
        <p className="mt-2 text-sm">
          {isDragActive
            ? `إسحب ${multiple ? "الملفات" : "الملف"} هنا...`
            : `قم بسحب ${multiple ? "الملفات" : "الملف"} هنا أو اضغط لاختياره`}
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            جاري رفع {selectedFiles.length} {multiple ? "ملفات" : "ملف"}:
          </p>
          <ul className="space-y-2">
            {selectedFiles.map((file) => (
              <li key={file.name} className="flex items-center gap-2">
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                ) : (
                  <InsertDriveFileIcon className="text-gray-500 dark:text-gray-300" />
                )}
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  {file.name}
                </span>
              </li>
            ))}
          </ul>

          {uploading && (
            <div className="w-full">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {progress}%
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
