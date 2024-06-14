import {
    Form,
    Upload,
    UploadProps,
    message,
    Image,
    Space,
    Typography,
    UploadFile,
} from 'antd';
import ImgCrop from 'antd-img-crop';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

const ImageUploader = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        fileList,
        beforeUpload: (file) => {
            setFileList([file]);
            const isJpgOrPng =
                file.type === 'image/jpeg' ||
                file.type === 'image/png' ||
                file.type === 'image/jpg' ||
                file.type === 'image/webp';
            if (!isJpgOrPng) {
                messageApi.error('You can only upload JPG/PNG file!');
                return Upload.LIST_IGNORE;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                messageApi.error('Image must smaller than 2MB!');
                return Upload.LIST_IGNORE;
            }
            setImageUrl(URL.createObjectURL(file));
            return false; // Prevent default upload behavior
        },
    };

    return (
        <Form.Item
            name='image'
            label='Upload Image'
            rules={[
                {
                    required: true,
                    message: 'Product image is required',
                },
            ]}
            htmlFor='image'
        >
            <ImgCrop
                rotationSlider
                showReset
                cropShape='round'
                fillColor='transparent'
            >
                <Upload listType='picture-card' {...props} id='image'>
                    {contextHolder}
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            style={{ width: '100%' }}
                            preview={false}
                        />
                    ) : (
                        <Space direction='vertical'>
                            <PlusOutlined />
                            <Typography.Text>Upload</Typography.Text>
                        </Space>
                    )}
                </Upload>
            </ImgCrop>
        </Form.Item>
    );
};

export default ImageUploader;
