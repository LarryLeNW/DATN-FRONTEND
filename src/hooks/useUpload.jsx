import axios from "axios";

const useFileUpload = () => {
    const upload = async (file, uploadProgress, index) => {
        if (!file) return null;

        const maxSize = 10 * 1024 * 1024; // 10MB

        if (file.size > maxSize) {
            console.error("Kích thước file không được vượt quá 10MB");
            return null;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ml_default");
        formData.append("folder", "uploads");

        try {
            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/dilajt5zl/upload",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress(progressEvent) {
                        if (progressEvent.total !== undefined) {
                            const percentCompleted = Math.floor(
                                (progressEvent.loaded / progressEvent.total) *
                                    100
                            );
                            uploadProgress(percentCompleted, index); // Cập nhật tiến trình tải lên
                        }
                    },
                }
            );

            return response.data.url;
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const uploadMultiple = async (files, uploadProgress, index) => {
        files = Array.isArray(files) ? files : Array.from(files);

        if (!files || files.length === 0) return null;

        const maxSize = 10 * 1024 * 1024; // 10MB

        // Kiểm tra kích thước của tất cả các file
        for (let file of files) {
            if (file.size > maxSize) {
                console.error(
                    `Kích thước file ${file.name} không được vượt quá 10MB`
                );
                return null;
            }
        }

        // Tạo danh sách các promises để tải lên nhiều file cùng lúc
        const uploadPromises = files.map((file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "ml_default");
            formData.append("folder", "uploads");

            return axios.post(
                "https://api.cloudinary.com/v1_1/dilajt5zl/upload",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress(progressEvent) {
                        if (progressEvent.total !== undefined) {
                            const percentCompleted = Math.floor(
                                (progressEvent.loaded / progressEvent.total) *
                                    100
                            );
                            uploadProgress(percentCompleted, index); // Cập nhật tiến trình tải lên cho từng file
                        }
                    },
                }
            );
        });

        try {
            // Đợi tất cả các file tải lên cùng lúc
            const responses = await Promise.all(uploadPromises);

            // Lưu kết quả các file đã được tải lên
            const uploadedFiles = responses.map((response) => response.data);

            return uploadedFiles; // Trả về dữ liệu của tất cả các file đã tải lên
        } catch (error) {
            console.error("Lỗi khi tải lên file:", error);
        }
    };

    return { upload, uploadMultiple };
};

export default useFileUpload;
