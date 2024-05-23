import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Categories from './pages/Categories';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/auth/login',
        element: <Login />,
    },
    {
        path: '/categories',
        element: <Categories />,
    }
]);
