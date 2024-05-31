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
import { getUsers, createUser } from '../../http/api';
import { FieldData, IUser, TCreateUser } from '../../types';
import { useAuthStore } from '../../store';
import UsersFilter from './UsersFilter';
import { useState, useMemo } from 'react';
import UserForm from './UserForm';
import { PAGE_SIZE } from '../../constants';
import { debounce } from 'lodash';

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

const User = () => {
    const { user } = useAuthStore();
    const [form] = Form.useForm();
    const [filterForm] = Form.useForm();
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [queryParams, setQueryParams] = useState({
        currentPage: 1,
        pageSize: PAGE_SIZE,
    });
    const {
        token: { colorBgLayout },
    } = theme.useToken();

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

    const { mutate: newUserMutate, isPending } = useMutation({
        mutationKey: ['user'],
        mutationFn: createNewUser,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['get-users'] });
            messageApi.open({
                type: 'success',
                content: 'New User Created!',
            });
        },
        onError: async (error) => {
            messageApi.open({
                type: 'error',
                content: error?.message,
            });
        },
    });

    if (!user || user.role !== 'admin') {
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
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => new Date(text).toLocaleDateString(),
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
    ];

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            newUserMutate(values);
            if (!isPending) {
                form.resetFields();
                setDrawerOpen(false);
            }
        });
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
            {contextHolder}
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
                    columns={columns}
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
                    }}
                    style={{ marginTop: '20px' }}
                    rowKey={'id'}
                    size='middle'
                />
            )}

            <Drawer
                title='Create User'
                placement='right'
                size={'large'}
                styles={{ body: { backgroundColor: colorBgLayout } }}
                closable={true}
                onClose={() => {
                    form.resetFields();
                    setDrawerOpen(false);
                }}
                open={drawerOpen}
                destroyOnClose={true}
                extra={
                    <Space>
                        <Button
                            onClick={() => {
                                form.resetFields();
                                setDrawerOpen(false);
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
                            Create
                        </Button>
                    </Space>
                }
            >
                <Form layout='vertical' autoComplete='off' form={form}>
                    <UserForm />
                </Form>
            </Drawer>
        </>
    );
};

export default User;
