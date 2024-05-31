import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import { useAuthStore } from '../store';

const PublicLayout = () => {
    const { user } = useAuthStore();
    const location = useLocation();

    if (user !== null) {
        const redirect =
            new URLSearchParams(location.search).get('redirect') || '/';
        return <Navigate to={redirect} replace={true} />;
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
