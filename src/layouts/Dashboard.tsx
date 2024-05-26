import { Outlet, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { useAuthStore } from '../store';

const Dashboard = () => {
    const { user } = useAuthStore();

    if (user === null) {
        return <Navigate to='/auth/login' replace={true} />;
    }

    return (
        <Layout>
            <Layout.Content>
                <Outlet />
            </Layout.Content>
        </Layout>
    );
};

export default Dashboard;
