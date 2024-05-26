import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';

const Dashboard = () => {
    return (
        <Layout>
            <Layout.Content>
                <Outlet />
            </Layout.Content>
        </Layout>
    );
};

export default Dashboard;
