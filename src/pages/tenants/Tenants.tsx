import {
    Breadcrumb,
    Button,
    Drawer,
    Flex,
    Form,
    Space,
    Spin,
    Table,
    TableProps,
    Typography,
    message,
    theme,
} from 'antd';
import { PlusOutlined, SaveFilled, LoadingOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { getTenants, createTenant, updateTenant } from '../../http/api';
import { FieldData, ITenant, TTenantData } from '../../types';
import { useAuthStore } from '../../store';
import RestaurantFilter from './TenantsFilter';
import { useState, useMemo, useEffect } from 'react';
import RestaurantForm from './forms/TenantForm';
import { PAGE_SIZE } from '../../constants';
import { debounce } from 'lodash';
import { formatDate } from 'date-fns';
import axios from 'axios';

const columns: TableProps<ITenant>['columns'] = [
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        sortDirections: ['ascend', 'descend', 'ascend'],
        sorter: {
            compare: (a, b) => a.id - b.id,
        },
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => formatDate(new Date(text), 'E dd MMM, yyyy'),
    },
];

const getAllTenants = async (queryString: string) => {
    try {
        const { data } = await getTenants(queryString);
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
};

const createNewTenant = async (newTenantData: TTenantData) => {
    try {
        const { data } = await createTenant(newTenantData);
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
};

const updateSelectedTenant = async (
    updateTenantData: TTenantData,
    tenantId: number,
) => {
    try {
        const { data } = await updateTenant(updateTenantData, tenantId);
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
};

const Tenants = () => {
    const { user } = useAuthStore();
    const [form] = Form.useForm();
    const [filterForm] = Form.useForm();
    const queryClient = useQueryClient();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedRowTenant, setSelectedRowTenant] = useState<ITenant | null>(
        null,
    );
    const [queryParams, setQueryParams] = useState({
        currentPage: 1,
        pageSize: PAGE_SIZE,
    });
    const {
        token: { colorBgLayout },
    } = theme.useToken();

    useEffect(() => {
        if (selectedRowTenant) {
            form.setFieldsValue(selectedRowTenant);
            setDrawerOpen(true);
        }
    }, [selectedRowTenant, form]);

    const {
        data: tenantsData,
        isFetching,
        isError,
        error,
    } = useQuery({
        queryKey: ['get-tenants', queryParams],
        queryFn: () => {
            const filteredParams = Object.fromEntries(
                Object.entries(queryParams).filter((item) => !!item[1]),
            );
            const queryString = new URLSearchParams(
                filteredParams as unknown as Record<string, string>,
            ).toString();
            return getAllTenants(queryString);
        },
        placeholderData: keepPreviousData,
    });

    const { mutate: createTenantMutation, isPending } = useMutation({
        mutationKey: ['tenant'],
        mutationFn: createNewTenant,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['get-tenants'] });
            message.success('New Tenant Created!');
            form.resetFields();
            setDrawerOpen(false);
            setSelectedRowTenant(null);
            return;
        },
        onError: async (error) => {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data.errors?.[0]?.msg ||
                    'An unexpected error occurred';
                message.error(errorMessage);
            } else {
                message.error(error?.message || 'An unexpected error occurred');
            }
            return;
        },
    });

    const { mutate: updateTenantMutation } = useMutation({
        mutationKey: ['update-tenant'],
        mutationFn: (data: TTenantData) => {
            return updateSelectedTenant(data, selectedRowTenant!.id);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get-tenants'],
            });
            message.success('Tenant Updated!');
            form.resetFields();
            setDrawerOpen(false);
            setSelectedRowTenant(null);
            return;
        },
        onError: async (error) => {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data.errors?.[0]?.msg ||
                    'An unexpected error occurred';
                message.error(errorMessage);
            } else {
                message.error(error?.message || 'An unexpected error occurred');
            }
            return;
        },
    });

    if (!user || user.role !== 'admin') {
        message.error('Authorized Access!');
        return <Navigate to='/' replace={true} />;
    }

    const handleSubmit = async () => {
        await form.validateFields();
        const inEditMode = !!selectedRowTenant;
        if (inEditMode) {
            updateTenantMutation(form.getFieldsValue());
        } else {
            createTenantMutation(form.getFieldsValue());
        }
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const debounceSearch = useMemo(() => {
        return debounce((value: string | undefined) => {
            setQueryParams((prev) => ({ ...prev, q: value }));
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
                currentPage: 1,
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
                            title: <Link to='/restaurants'>Tenants</Link>,
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
                <RestaurantFilter>
                    <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        onClick={() => setDrawerOpen(true)}
                    >
                        Add Tenant
                    </Button>
                </RestaurantFilter>
            </Form>

            {tenantsData && (
                <Table
                    columns={[
                        ...columns,
                        {
                            title: 'Action',
                            key: 'action',
                            render: (record: ITenant) => (
                                <Space size='large'>
                                    <Button
                                        type='link'
                                        onClick={() => {
                                            setSelectedRowTenant(record);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button type='link'>Delete</Button>
                                </Space>
                            ),
                        },
                    ]}
                    dataSource={tenantsData?.data}
                    pagination={{
                        pageSize: queryParams.pageSize,
                        current: queryParams.currentPage,
                        total: tenantsData?.total,
                        onChange: (page) => {
                            setQueryParams((prev) => ({
                                ...prev,
                                currentPage: page,
                            }));
                        },
                        position: ['bottomCenter'],
                        showTotal: (total: number, range: number[]) =>
                            `Showing ${range[0]} - ${range[1]} of ${total} items`,
                    }}
                    style={{ marginTop: '20px', textAlignLast: 'center' }}
                    rowKey={'id'}
                    size='middle'
                />
            )}

            <Drawer
                title={selectedRowTenant ? 'Edit Tenant' : 'Create New Tenant'}
                placement='right'
                size={'large'}
                styles={{ body: { backgroundColor: colorBgLayout } }}
                closable={true}
                onClose={() => {
                    form.resetFields();
                    setDrawerOpen(false);
                    setSelectedRowTenant(null);
                }}
                open={drawerOpen}
                destroyOnClose={true}
                extra={
                    <Space>
                        <Button
                            onClick={() => {
                                form.resetFields();
                                setDrawerOpen(false);
                                setSelectedRowTenant(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type='primary'
                            icon={<SaveFilled />}
                            onClick={handleSubmit}
                            loading={isPending}
                        >
                            {selectedRowTenant ? 'Update' : 'Create'}
                        </Button>
                    </Space>
                }
            >
                <Form layout='vertical' autoComplete='off' form={form}>
                    <RestaurantForm />
                </Form>
            </Drawer>
        </>
    );
};

export default Tenants;
