import { Navigate, Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import { useAuthStore } from '../store';

const PublicLayout = () => {
    const { user } = useAuthStore();

    if (user !== null) {
        return <Navigate to='/' replace={true} />;
    }
    return (
        <Layout>
            <Layout.Content>
                <Outlet />
            </Layout.Content>
        </Layout>
    );
};

export default PublicLayout;
