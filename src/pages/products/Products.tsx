import {
    Breadcrumb,
    Button,
    Flex,
    message,
    Form,
    Space,
    TableProps,
    Table,
    Typography,
    Spin,
    Image,
    Tag,
} from 'antd';
import {
    PlusOutlined,
    LoadingOutlined,
    RightOutlined,
} from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import ProductsFilter from './ProductsFilter';
import { useAuthStore } from '../../store';
import { formatDate } from 'date-fns';
import { ICategory, IProduct } from '../../types';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getProducts } from '../../http/api';
import { useState } from 'react';
import { PAGE_SIZE } from '../../constants';

const columns: TableProps<IProduct>['columns'] = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (_, { image, name }) => {
            return (
                <>
                    <Space>
                        <Image src={image} width={50} />
                        <Typography.Text>{name}</Typography.Text>
                    </Space>
                </>
            );
        },
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: '30%',
    },
    {
        title: 'Category',
        key: 'categoryId',
        dataIndex: 'category',
        render: (category: ICategory) => {
            return <Typography.Text>{category.name}</Typography.Text>;
        },
    },
    {
        title: 'Status',
        dataIndex: 'isPublished',
        key: 'isPublished',
        render: (status: boolean) => {
            let color;
            if (status === true) {
                color = 'green';
            } else {
                color = 'purple';
            }
            return (
                <Tag
                    color={color}
                    style={{
                        textTransform: 'capitalize',
                        borderRadius: '12px',
                        padding: '4px',
                        width: '80px',
                        textAlign: 'center',
                    }}
                >
                    {status ? 'Published' : 'Draft'}
                </Tag>
            );
        },
    },
    {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => (
            <Typography.Text>
                {formatDate(new Date(text), 'E dd MMM, yyyy')}
            </Typography.Text>
        ),
    },
];

const getProductList = async (queryString: string) => {
    try {
        const { data } = await getProducts(queryString);
        console.log(data);
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
};

const Products = () => {
    const { user } = useAuthStore();
    const [filterForm] = Form.useForm();
    const [queryParams, setQueryParams] = useState({
        currentPage: 1,
        pageSize: PAGE_SIZE,
    });

    const {
        data: productsData,
        isFetching,
        isError,
        error,
    } = useQuery({
        queryKey: ['get-products', queryParams],
        queryFn: () => {
            const filteredParams = Object.fromEntries(
                Object.entries(queryParams).filter((item) => !!item[1]),
            );
            const queryString = new URLSearchParams(
                filteredParams as unknown as Record<string, string>,
            ).toString();
            return getProductList(queryString);
        },
        placeholderData: keepPreviousData,
    });

    if (!user || user.role !== 'admin') {
        message.error('Authorized Access!');
        return <Navigate to='/' replace={true} />;
    }
    return (
        <>
            <Flex justify='space-between'>
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[
                        {
                            title: <Link to='/'>Home</Link>,
                        },
                        {
                            title: <Link to='/products'>Products</Link>,
                        },
                    ]}
                />
                {isFetching && (
                    <Spin size='default' indicator={<LoadingOutlined />} />
                )}
                {isError && (
                    <Typography.Text type='danger'>
                        {error.message}
                    </Typography.Text>
                )}
            </Flex>

            <Form form={filterForm} onFieldsChange={() => {}}>
                <ProductsFilter>
                    <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        onClick={() => {}}
                    >
                        Add Product
                    </Button>
                </ProductsFilter>
            </Form>

            {productsData && (
                <Table
                    columns={[
                        ...columns,
                        {
                            title: 'Action',
                            key: 'action',
                            render: () => (
                                <Space size='large'>
                                    <Button type='link' onClick={() => {}}>
                                        Edit
                                    </Button>
                                    <Button type='link'>Delete</Button>
                                </Space>
                            ),
                        },
                    ]}
                    dataSource={productsData?.data}
                    pagination={{
                        pageSize: queryParams.pageSize,
                        current: queryParams.currentPage,
                        total: productsData?.total,
                        onChange: (page) => {
                            setQueryParams((prev) => ({
                                ...prev,
                                currentPage: page,
                            }));
                        },
                        position: ['bottomCenter'],
                        showTotal: (total: number, range: number[]) =>
                            `Showing ${range[0]}-${range[1]} of ${total} items`,
                    }}
                    style={{ marginTop: '20px', textAlignLast: 'center' }}
                    rowKey={'_id'}
                    size='middle'
                />
            )}
        </>
    );
};

export default Products;
