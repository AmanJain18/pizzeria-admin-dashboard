import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';

const PublicLayout = () => {
    return (
        <Layout>
            <Layout.Content>
                <Outlet />
            </Layout.Content>
        </Layout>
    );
};

export default PublicLayout;
