import axios from 'axios';

const useFileUpload = () => {

    const upload = async (file) => {
        if (!file) return null;

        const maxSize = 10 * 1024 * 1024; // 10MB

        if (file.size > maxSize) {
            console.error('Kích thước file không được vượt quá 10MB');
            return null;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default');
        formData.append('folder', 'uploads');

        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dilajt5zl/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress(progressEvent) {
                    if (progressEvent.total !== undefined) {
                        console.log("progress :" + Math.floor((progressEvent.loaded / progressEvent.total) * 100) )
                        if (progressEvent.loaded === progressEvent.total) {
                            console.log("fileSize :" + progressEvent.total < 1024
                                ? `${progressEvent.total}KB`
                                : `${(progressEvent.loaded / (1024 * 1024)).toFixed(2)}MB`)
                        }
                    }
                }
            });

            console.log("res : " , response.data.toString())

            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            console.log('finally');
        }
    };


    const uploadNoPreview = async (file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default');
        formData.append('folder', 'uploads');

        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dilajt5zl/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            console.log('finally');
        }
    };


    const uploadMultiple = async (files) => {
        files = Array.isArray(files) ? files : Array.from(files);


        if (!files || files.length === 0) return null;


        const maxSize = 10 * 1024 * 1024; // 10MB

        // Kiểm tra kích thước của tất cả các file
        for (let file of files) {
            if (file.size > maxSize) {
                console.error(`Kích thước file ${file.name} không được vượt quá 10MB`);
                return null;
            }
        }

        // Tạo danh sách các promises để tải lên nhiều file cùng lúc
        const uploadPromises = files.map(file => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'ml_default');
            formData.append('folder', 'uploads');

            return axios.post('https://api.cloudinary.com/v1_1/dilajt5zl/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress(progressEvent) {
                    if (progressEvent.total !== undefined) {
                        console.log(`Tiến trình tải file ${file.name}: ${Math.floor((progressEvent.loaded / progressEvent.total) * 100)}%`);
                    }
                }
            });
        });

        try {
            // Đợi tất cả các file tải lên cùng lúc
            const responses = await Promise.all(uploadPromises);

            // Lưu kết quả các file đã được tải lên
            const uploadedFiles = responses.map(response => response.data);
            console.log('Tất cả file đã được tải lên:', uploadedFiles);

            return uploadedFiles; // Trả về dữ liệu của tất cả các file đã tải lên

        } catch (error) {
            console.error('Lỗi khi tải lên file:', error);
        }
    };


    return { upload, uploadNoPreview , uploadMultiple};
};

export default useFileUpload;
