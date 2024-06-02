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
    Tag,
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
import { getUsers, createUser, updateUser } from '../../http/api';
import { FieldData, IUser, TCreateUser, TUpdateUser } from '../../types';
import { useAuthStore } from '../../store';
import UsersFilter from './UsersFilter';
import { useState, useMemo, useEffect } from 'react';
import UserForm from './forms/UserForm';
import { PAGE_SIZE } from '../../constants';
import { debounce } from 'lodash';
import { formatDate } from 'date-fns';
import axios from 'axios';

const getAllUsers = async (queryString: string) => {
    try {
        const { data } = await getUsers(queryString);
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
};

const createNewUser = async (newUserData: TCreateUser) => {
    try {
        const { data } = await createUser(newUserData);
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
};

const updateSelectedUser = async (
    updateUserData: TUpdateUser,
    userId: number,
) => {
    try {
        const { data } = await updateUser(updateUserData, userId);
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
};

const Users = () => {
    const { user } = useAuthStore();
    const [form] = Form.useForm();
    const [filterForm] = Form.useForm();
    const queryClient = useQueryClient();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedRowUser, setSelectedRowUser] = useState<IUser | null>(null);
    const [queryParams, setQueryParams] = useState({
        currentPage: 1,
        pageSize: PAGE_SIZE,
    });
    const {
        token: { colorBgLayout },
    } = theme.useToken();

    useEffect(() => {
        if (selectedRowUser) {
            form.setFieldsValue({
                ...selectedRowUser,
                tenantId: selectedRowUser.tenant?.id,
            });
            setDrawerOpen(true);
        }
    }, [selectedRowUser, form]);

    const {
        data: userData,
        isFetching,
        isError,
        error,
    } = useQuery({
        queryKey: ['get-users', queryParams],
        queryFn: () => {
            const filteredParams = Object.fromEntries(
                Object.entries(queryParams).filter((item) => !!item[1]),
            );
            const queryString = new URLSearchParams(
                filteredParams as unknown as Record<string, string>,
            ).toString();
            return getAllUsers(queryString);
        },
        placeholderData: keepPreviousData,
    });

    const { mutate: createUserMutation, isPending } = useMutation({
        mutationKey: ['user'],
        mutationFn: createNewUser,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['get-users'] });
            message.success('New User Created!');
            form.resetFields();
            setDrawerOpen(false);
            setSelectedRowUser(null);
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
        },
    });

    const { mutate: updateUserMutation } = useMutation({
        mutationKey: ['update-user'],
        mutationFn: (data: TUpdateUser) => {
            return updateSelectedUser(data, selectedRowUser!.id);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get-users'],
            });
            message.success('User Updated!');
            form.resetFields();
            setDrawerOpen(false);
            setSelectedRowUser(null);
        },
        onError: async (error) => {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data.errors?.[0]?.msg ||
                    'An unexpected error occurred';
                message.error(errorMessage);
                return;
            } else {
                message.error(error?.message || 'An unexpected error occurred');
            }
        },
    });

    if (!user || user.role !== 'admin') {
        message.error('Authorized Access!');
        return <Navigate to='/' replace={true} />;
    }

    const columns: TableProps<IUser>['columns'] = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            render: (text: number) => <Link to={`/users/${text}`}>{text}</Link>,
            sortDirections: ['ascend', 'descend', 'ascend'],
            sorter: {
                compare: (a, b) => a.id - b.id,
            },
        },
        {
            title: 'Name',
            dataIndex: 'firstName',
            key: 'firstName',
            render: (_, { firstName, lastName }) => {
                return `${firstName} ${lastName}`;
            },
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            key: 'role',
            dataIndex: 'role',
            filters: [
                {
                    text: 'Admin',
                    value: 'admin',
                },
                {
                    text: 'Manager',
                    value: 'manager',
                },
                {
                    text: 'Customer',
                    value: 'customer',
                },
            ],
            onFilter: (value, record) =>
                record.role.indexOf(value as string) === 0,
            filterDropdown: ({ setSelectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Tag
                        key={'customer'}
                        color='blue'
                        onClick={() => {
                            setSelectedKeys(['customer']);
                            confirm();
                        }}
                        style={{
                            cursor: 'pointer',
                            marginBottom: 8,
                            borderRadius: '12px',
                        }}
                    >
                        Customer
                    </Tag>
                    <Tag
                        key={'admin'}
                        color='green'
                        onClick={() => {
                            setSelectedKeys(['admin']);
                            confirm();
                        }}
                        style={{
                            cursor: 'pointer',
                            marginBottom: 8,
                            borderRadius: '12px',
                        }}
                    >
                        Admin
                    </Tag>
                    <Tag
                        key={'manager'}
                        color='purple'
                        onClick={() => {
                            setSelectedKeys(['manager']);
                            confirm();
                        }}
                        style={{
                            cursor: 'pointer',
                            marginBottom: 8,
                            borderRadius: '12px',
                        }}
                    >
                        Manager
                    </Tag>
                    <Tag
                        key={'clear'}
                        color='red'
                        onClick={() => {
                            clearFilters?.();
                            confirm();
                        }}
                        style={{
                            cursor: 'pointer',
                            marginBottom: 8,
                            borderRadius: '12px',
                        }}
                    >
                        Clear
                    </Tag>
                </div>
            ),
            render: (_, { role }) => {
                let color;
                if (role === 'admin') {
                    color = 'green';
                } else if (role === 'customer') {
                    color = 'blue';
                } else {
                    color = 'purple';
                }
                return (
                    <Tag
                        color={color}
                        key={role}
                        style={{
                            textTransform: 'capitalize',
                            borderRadius: '12px',
                            padding: '4px',
                            width: '80px',
                            textAlign: 'center',
                        }}
                    >
                        {role}
                    </Tag>
                );
            },
        },
        {
            title: 'Restaurants',
            dataIndex: 'tenant',
            key: 'tenant',
            render: (tenant) => {
                if (tenant) {
                    return tenant.name;
                }
                return 'N/A';
            },
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) =>
                formatDate(new Date(text), 'E dd MMM, yyyy'),
        },
    ];

    const handleSubmit = async () => {
        await form.validateFields();
        const inEditMode = !!selectedRowUser;
        if (inEditMode) {
            console.log(form.getFieldsValue());
            updateUserMutation(form.getFieldsValue());
        } else {
            createUserMutation(form.getFieldsValue());
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
                            title: <Link to='/users'>Users</Link>,
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
                <UsersFilter>
                    <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        onClick={() => setDrawerOpen(true)}
                    >
                        Add User
                    </Button>
                </UsersFilter>
            </Form>

            {userData && (
                <Table
                    columns={[
                        ...columns,
                        {
                            title: 'Action',
                            key: 'action',
                            render: (record: IUser) => (
                                <Space size='large'>
                                    <Button
                                        type='link'
                                        onClick={() => {
                                            setSelectedRowUser(record);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button type='link'>Delete</Button>
                                </Space>
                            ),
                        },
                    ]}
                    dataSource={userData?.data}
                    pagination={{
                        pageSize: queryParams.pageSize,
                        current: queryParams.currentPage,
                        total: userData?.totalCount,
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
                    rowKey={'id'}
                    size='middle'
                />
            )}

            <Drawer
                title={selectedRowUser ? 'Edit User' : 'Create New User'}
                placement='right'
                size={'large'}
                styles={{ body: { backgroundColor: colorBgLayout } }}
                closable={true}
                onClose={() => {
                    form.resetFields();
                    setDrawerOpen(false);
                    setSelectedRowUser(null);
                }}
                open={drawerOpen}
                destroyOnClose={true}
                extra={
                    <Space>
                        <Button
                            onClick={() => {
                                form.resetFields();
                                setDrawerOpen(false);
                                setSelectedRowUser(null);
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
                            {selectedRowUser ? 'Update' : 'Create'}
                        </Button>
                    </Space>
                }
            >
                <Form layout='vertical' autoComplete='off' form={form}>
                    <UserForm inEditMode={!!selectedRowUser} />
                </Form>
            </Drawer>
        </>
    );
};

export default Users;
