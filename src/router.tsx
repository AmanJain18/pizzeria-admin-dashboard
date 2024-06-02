import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/login/loginPage';
import Dashboard from './layouts/Dashboard';
import PublicLayout from './layouts/PublicLayout';
import Root from './layouts/Root';
import Users from './pages/users/Users';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '',
                element: <Dashboard />,
                children: [
                    { path: '', element: <HomePage /> },
                    { path: 'users', element: <Users /> },
                ],
            },
            {
                path: '/auth',
                element: <PublicLayout />, // Add the correct element name
                children: [
                    {
                        path: 'login',
                        element: <LoginPage />,
                    },
                ],
            },
        ],
    },
]);
