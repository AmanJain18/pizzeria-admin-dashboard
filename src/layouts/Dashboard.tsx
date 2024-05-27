import { useState } from 'react';
import Icon from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import type { MenuProps } from 'antd';
import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { useAuthStore } from '../store';
import Logo from '../components/icons/Logo';
import { MdHome, MdShoppingBasket, MdRestaurant, MdPeople, MdDiscount } from 'react-icons/md';
import { FaClipboardList } from 'react-icons/fa';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: '1',
        icon: <Icon component={MdHome} style={{ fontSize: '20px' }} />,
        label: <NavLink to='/'>Home</NavLink>,
    },
    {
        key: '2',
        icon: <Icon component={FaClipboardList} style={{ fontSize: '20px' }} />,
        label: <NavLink to='/orders'>Orders</NavLink>,
    },
    {
        key: '3',
        icon: <Icon component={MdShoppingBasket} style={{ fontSize: '20px' }} />,
        label: <NavLink to='/products'>Products</NavLink>,
    },
    {
        key: '4',
        icon: (
            <Icon
                component={MdPeople}
                style={{ fontSize: '20px' }}
            />
        ),
        label: <NavLink to='/users'>Users</NavLink>,
    },
    {
        key: '5',
        icon: (
            <Icon
                component={MdRestaurant}
                style={{ fontSize: '20px' }}
            />
        ),
        label: <NavLink to='/restaurants'>Restaurants</NavLink>,
    },
    {
        key: '6',
        icon: <Icon component={MdDiscount} style={{ fontSize: '20px' }} />,
        label: 'Promos',
    },
];

const Dashboard = () => {
    const { user } = useAuthStore();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    if (user === null) {
        return <Navigate to='/auth/login' replace={true} />;
    }

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
                    defaultSelectedKeys={['1']}
                    mode='inline'
                    items={items}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                />
                <Content style={{ margin: '0 16px' }}>
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
