import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/reset.css';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';

const queryClient = new QueryClient({});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#1890ff',
                        colorLink: '#1890ff',
                    },
                }}
            >
                <RouterProvider router={router} />
            </ConfigProvider>
        </QueryClientProvider>
    </React.StrictMode>,
);
