import { useState } from 'react';
import Icon from '@ant-design/icons';
import {
    Avatar,
    Badge,
    Dropdown,
    Flex,
    Layout,
    Menu,
    Space,
    theme,
} from 'antd';
import type { MenuProps } from 'antd';
import { Outlet, Navigate, NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import Logo from '../components/icons/Logo';
import {
    MdHome,
    MdShoppingBasket,
    MdRestaurant,
    MdPeople,
    MdDiscount,
    MdLogout,
} from 'react-icons/md';
import { FaClipboardList, FaBell } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import { logout } from '../http/api';

const { Header, Content, Footer, Sider } = Layout;

const getMenuItems = (role: string) => {
    const baseItems = [
        {
            key: '/',
            priority: 1,
            icon: <Icon component={MdHome} style={{ fontSize: '20px' }} />,
            label: <NavLink to='/'>Home</NavLink>,
        },
        {
            key: '/orders',
            priority: 2,
            icon: (
                <Icon
                    component={FaClipboardList}
                    style={{ fontSize: '20px' }}
                />
            ),
            label: <NavLink to='/orders'>Orders</NavLink>,
            path: '/orders',
        },
        {
            key: '/products',
            priority: 3,
            icon: (
                <Icon
                    component={MdShoppingBasket}
                    style={{ fontSize: '20px' }}
                />
            ),
            label: <NavLink to='/products'>Products</NavLink>,
            path: '/products',
        },
        {
            key: '/promos',
            priority: 6,
            icon: <Icon component={MdDiscount} style={{ fontSize: '20px' }} />,
            label: 'Promos',
            path: '/promos',
        },
    ];

    if (role === 'admin') {
        return [
            ...baseItems,
            {
                key: '/users',
                priority: 4,
                icon: (
                    <Icon component={MdPeople} style={{ fontSize: '20px' }} />
                ),
                label: <NavLink to='/users'>Users</NavLink>,
                path: '/users',
            },
            {
                key: '/restaurants',
                priority: 5,
                icon: (
                    <Icon
                        component={MdRestaurant}
                        style={{ fontSize: '20px' }}
                    />
                ),
                label: <NavLink to='/restaurants'>Restaurants</NavLink>,
                path: '/restaurants',
            },
        ].sort((a, b) => a.priority - b.priority);
    }

    return baseItems.sort((a, b) => a.priority - b.priority);
};

const avatarItems: MenuProps['items'] = [
    {
        key: '1',
        icon: <Icon component={MdLogout} style={{ fontSize: '20px' }} />,
        label: 'Logout',
    },
];

const Dashboard = () => {
    const { user, logoutUser } = useAuthStore();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, colorPrimary },
    } = theme.useToken();

    const { mutate: logoutMutate } = useMutation({
        mutationKey: ['logout'],
        mutationFn: logout,
        onSuccess: async () => {
            logoutUser();
            return;
        },
    });

    if (user === null) {
        return (
            <Navigate
                to={`/auth/login?redirect=${location.pathname}`}
                replace={true}
            />
        );
    }

    const sidebarItems: MenuProps['items'] = getMenuItems(user.role);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                theme='light'
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <div style={{ padding: '20px 24px' }}>
                    <Logo />
                </div>
                <Menu
                    theme='light'
                    defaultSelectedKeys={[location.pathname]}
                    mode='inline'
                    items={sidebarItems}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: '0 16px',
                        background: colorBgContainer,
                    }}
                >
                    <Flex align='center' justify='space-between'>
                        <Badge
                            text={
                                user.role === 'admin'
                                    ? 'You are an admin'
                                    : user.tenant?.name
                            }
                            status={
                                user.role === 'admin' ? 'success' : 'processing'
                            }
                        />
                        <Space size={18}>
                            <Badge dot={true}>
                                <Icon
                                    component={FaBell}
                                    style={{ fontSize: '18px' }}
                                />
                            </Badge>
                            <Dropdown
                                menu={{
                                    items: avatarItems,
                                    onClick: ({ key }) => {
                                        if (key === '1') {
                                            logoutMutate();
                                        }
                                    },
                                }}
                                placement='bottomLeft'
                                arrow
                            >
                                <Avatar
                                    style={{
                                        float: 'right',
                                        backgroundColor: colorPrimary,
                                    }}
                                >
                                    {user.firstName[0]}
                                </Avatar>
                            </Dropdown>
                        </Space>
                    </Flex>
                </Header>
                <Content style={{ margin: '16px' }}>
                    <Outlet />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Pizzeria ©{new Date().getFullYear()}
                </Footer>
            </Layout>
        </Layout>
    );
};

export default Dashboard;
