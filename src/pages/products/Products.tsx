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
    Drawer,
    theme,
} from 'antd';
import {
    PlusOutlined,
    LoadingOutlined,
    RightOutlined,
    SaveFilled,
} from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import ProductsFilter from './ProductsFilter';
import { useAuthStore } from '../../store';
import { formatDate } from 'date-fns';
import { FieldData, ICategory, IProduct } from '../../types';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getProducts } from '../../http/api';
import { useMemo, useState } from 'react';
import { PAGE_SIZE } from '../../constants';
import { debounce } from 'lodash';
import ProductForm from './forms/ProductForm';

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
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
};

const Products = () => {
    const { user } = useAuthStore();
    const [form] = Form.useForm();
    const [filterForm] = Form.useForm();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedRowProduct, setSelectedRowProduct] = useState<IProduct | null>(
        null,
    );
    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: PAGE_SIZE,
        tenantId: user!.role === 'manager' ? user!.tenant?.id : undefined,
    });
    const {
        token: { colorBgLayout },
    } = theme.useToken();

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

    if (!user || user.role === 'customer') {
        message.error('Authorized Access!');
        return <Navigate to='/' replace={true} />;
    }

    const handleSubmit = async () => {
        await form.validateFields();
        // const inEditMode = !!selectedRowProduct;
        // if (inEditMode) {
        //     updateUserMutation(form.getFieldsValue());
        // } else {
        //     createUserMutation(form.getFieldsValue());
        // }
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const debounceSearch = useMemo(() => {
        return debounce((value: string | undefined) => {
            setQueryParams((prev) => ({ ...prev, q: value, page: 1 }));
        }, 500);
    }, []);

    const filterChange = (onFieldsChange: FieldData[]) => {
        const fieldsValues = onFieldsChange
            .map((field) => ({
                [field.name[0]]: field.value,
            }))
            .reduce((acc, curr) => {
                return { ...acc, ...curr };
            }, {});

        if ('q' in fieldsValues) {
            debounceSearch(fieldsValues.q);
        } else {
            setQueryParams((prev) => ({
                ...prev,
                ...fieldsValues,
                page: 1,
            }));
        }
    };
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

            <Form form={filterForm} onFieldsChange={filterChange}>
                <ProductsFilter>
                    <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        onClick={() => setDrawerOpen(true)}
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
                        pageSize: queryParams.limit,
                        current: queryParams.page,
                        total: productsData?.total,
                        onChange: (page) => {
                            setQueryParams((prev) => ({
                                ...prev,
                                page: page,
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

            <Drawer
                title={selectedRowProduct ? 'Edit Product' : 'Add New Product'}
                placement='right'
                size={'large'}
                styles={{ body: { backgroundColor: colorBgLayout } }}
                closable={true}
                onClose={() => {
                    form.resetFields();
                    setDrawerOpen(false);
                    setSelectedRowProduct(null);
                }}
                open={drawerOpen}
                destroyOnClose={true}
                extra={
                    <Space>
                        <Button
                            onClick={() => {
                                form.resetFields();
                                setDrawerOpen(false);
                                setSelectedRowProduct(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type='primary'
                            icon={<SaveFilled />}
                            onClick={handleSubmit}
                            // loading={isPending}
                        >
                            {selectedRowProduct ? 'Update' : 'Create'}
                        </Button>
                    </Space>
                }
            >
                <Form layout='vertical' autoComplete='off' form={form}>
                    <ProductForm inEditMode={!!selectedRowProduct} />
                </Form>
            </Drawer>
        </>
    );
};

export default Products;
