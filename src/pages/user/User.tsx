import {
    Breadcrumb,
    Button,
    Drawer,
    Form,
    Space,
    Table,
    TableProps,
    Tag,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../http/api';
import { IUser } from '../../types';
import { useAuthStore } from '../../store';
import UsersFilter from './UsersFilter';
import { useState } from 'react';
import UserForm from './UserForm';

const getAllUsers = async () => {
    try {
        const { data } = await getUsers();
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
};

const User = () => {
    const { user } = useAuthStore();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const {
        data: userData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['getusers'],
        queryFn: getAllUsers,
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

    return (
        <>
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

            <UsersFilter
                onFilterChange={(filterName, filterValue) => {
                    console.log(filterName, filterValue);
                }}
            >
                <Button
                    type='primary'
                    icon={<PlusOutlined />}
                    onClick={() => setDrawerOpen(true)}
                >
                    Add User
                </Button>
            </UsersFilter>

            {isLoading && <p>Loading...</p>}
            {isError && <p>Error: {error as unknown as string}</p>}
            {userData && (
                <Table
                    columns={columns}
                    dataSource={userData}
                    style={{ marginTop: '20px' }}
                    rowKey={'id'}
                />
            )}

            <Drawer
                title='Create User'
                placement='right'
                size={'large'}
                closable={true}
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                destroyOnClose={true}
                extra={
                    <Space>
                        <Button onClick={() => setDrawerOpen(false)}>
                            Cancel
                        </Button>
                        <Button type='primary'>OK</Button>
                    </Space>
                }
            >
                <Form layout='vertical' requiredMark>
                    <UserForm />
                </Form>
            </Drawer>
        </>
    );
};

export default User;
