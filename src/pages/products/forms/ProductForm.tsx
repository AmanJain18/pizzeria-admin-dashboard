import { useQuery } from '@tanstack/react-query';
import {
    Row,
    Col,
    Input,
    Form,
    Card,
    Space,
    Select,
    Upload,
    Image,
    Typography,
    Switch,
} from 'antd';
import { getCategories, getTenants } from '../../../http/api';
import { ICategory, ITenant } from '../../../types';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import PriceConfig from './PriceConfig';
import Attributes from './Attributes';

const getCategoriesList = async () => {
    try {
        const { data } = await getCategories();
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
};

const getTenantsList = async () => {
    try {
        const { data } = await getTenants();
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
};

const ProductForm = ({ inEditMode = false }: { inEditMode: boolean }) => {
    const selectedCategory = Form.useWatch('categoryId');
    const { data: categoriesList } = useQuery({
        queryKey: ['get-category'],
        queryFn: getCategoriesList,
    });

    const { data: restaurantsList } = useQuery({
        queryKey: ['get-restaurants'],
        queryFn: getTenantsList,
    });

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type='button'>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );
    return (
        <Row>
            <Col span={24}>
                <Space
                    direction='vertical'
                    size='large'
                    style={{ width: '100%' }}
                >
                    <Card title='Product Info' bordered={false}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name='name'
                                    label='Product name'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Product name is required',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder='Please enter product name'
                                        size='large'
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name='categoryId'
                                    label='Category'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select category',
                                        },
                                    ]}
                                    style={{ width: '100%' }}
                                >
                                    <Select
                                        placeholder='Select Category'
                                        size='large'
                                        allowClear
                                    >
                                        {categoriesList?.map(
                                            (category: ICategory) => (
                                                <Select.Option
                                                    key={category._id}
                                                    value={JSON.stringify(
                                                        category,
                                                    )}
                                                >
                                                    {category.name}
                                                </Select.Option>
                                            ),
                                        )}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name='description'
                                    label='Description'
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Description is required',
                                        },
                                    ]}
                                >
                                    <Input.TextArea
                                        placeholder='Please enter product description'
                                        size='middle'
                                        allowClear
                                        rows={2}
                                        maxLength={120}
                                        style={{ resize: 'none' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    {/* {!inEditMode && ( */}
                    <Card title='Product Image' bordered={false}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name='image'
                                    label='Upload Image'
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Product image is required',
                                        },
                                    ]}
                                >
                                    <Upload
                                        name='avatar'
                                        listType='picture-card'
                                        className='avatar-uploader'
                                        showUploadList={false}
                                        action=''
                                        // beforeUpload={beforeUpload}
                                        // onChange={handleChange}
                                    >
                                        {imageUrl ? (
                                            <Image
                                                src={imageUrl}
                                                style={{ width: '100%' }}
                                            />
                                        ) : (
                                            uploadButton
                                        )}
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    {/* )} */}
                    <Card title='Restaurant Info' bordered={false}>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    name='tenantId'
                                    label='Restaurant'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select restaurant',
                                        },
                                    ]}
                                >
                                    <Select
                                        style={{ width: '100%' }}
                                        placeholder='Select Restaurant'
                                        size='large'
                                        showSearch
                                        allowClear
                                    >
                                        {restaurantsList?.data.map(
                                            (tenant: ITenant) => (
                                                <Select.Option
                                                    key={tenant.id}
                                                    value={tenant.id}
                                                >
                                                    {tenant.name}
                                                </Select.Option>
                                            ),
                                        )}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {selectedCategory && (
                        <PriceConfig selectedCategory={selectedCategory} />
                    )}

                    {selectedCategory && (
                        <Attributes selectedCategory={selectedCategory} />
                    )}

                    <Card title='Additional Info' bordered={false}>
                        <Row>
                            <Col span={24}>
                                <Space>
                                    <Form.Item
                                        name='isPublished'
                                        style={{
                                            display: 'contents',
                                        }}
                                    >
                                        <Switch
                                            checkedChildren='Yes'
                                            unCheckedChildren='No'
                                            defaultChecked={false}
                                        />
                                    </Form.Item>
                                    <Typography.Text style={{ marginLeft: 10 }}>
                                        Published
                                    </Typography.Text>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </Space>
            </Col>
        </Row>
    );
};

export default ProductForm;
