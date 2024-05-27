import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../store';
import { useEffect, useState } from 'react';
import { Layout, Spin } from 'antd';

const Root = () => {
    const { fetchUser } = useAuthStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            await fetchUser();
            setLoading(false);
        };
        loadUser();
    }, [fetchUser]);

    if (loading) {
        return (
            <Layout
                style={{
                    minHeight: '100vh',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Spin size='large' />
            </Layout>
        );
    }
    return <Outlet />;
};

export default Root;
