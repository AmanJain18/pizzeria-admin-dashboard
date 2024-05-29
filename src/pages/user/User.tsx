import { Breadcrumb, Table, TableProps, Tag } from 'antd';
import { Link, Navigate } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../http/api';
import { IUser } from '../../types';
import { useAuthStore } from '../../store';
import UsersFilter from './UsersFilter';

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

    const { data, isLoading, isError, error } = useQuery({
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

            <UsersFilter />

            {isLoading && <p>Loading...</p>}
            {isError && <p>Error: {error as unknown as string}</p>}
            {data && (
                <Table
                    columns={columns}
                    dataSource={data.map((user: IUser) => ({
                        ...user,
                        key: user.id,
                    }))}
                    style={{ marginTop: '20px' }}
                />
            )}
        </>
    );
};

export default User;
