import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../store';
import { useEffect } from 'react';
import { Layout, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { self } from '../http/api';
import { AxiosError } from 'axios';

const getSelf = async () => {
    try {
        const { data } = await self();
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
};

const Root = () => {
    const { setUser } = useAuthStore();

    const { data, isLoading } = useQuery({
        queryKey: ['self'],
        queryFn: getSelf,
        retry: (failureCount: number, error) => {
            if (
                error instanceof AxiosError &&
                error?.response?.status === 401
            ) {
                return false;
            }
            return failureCount < 3;
        },
    });

    useEffect(() => {
        if (data) {
            setUser(data);
        }
    }, [data, setUser]);

    if (isLoading) {
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
