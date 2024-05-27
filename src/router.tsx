import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/login/loginPage';
import Categories from './pages/Categories';
import Dashboard from './layouts/Dashboard';
import PublicLayout from './layouts/PublicLayout';
import Root from './layouts/Root';

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
                    { path: 'categories', element: <Categories /> },
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
