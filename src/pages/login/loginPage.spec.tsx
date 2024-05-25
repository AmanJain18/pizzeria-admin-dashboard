import { render, screen } from '@testing-library/react';
import { it, describe, expect } from 'vitest';
import LoginPage from './loginPage';

describe('Login Page', () => {
    it('should render the login page with required fields', () => {
        render(<LoginPage />);
        // getBy -> throws an error
        // findBy -> Async
        // queryBy -> null
        expect(screen.getByText('Log In')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(
            screen.getByRole('checkbox', { name: 'Remember me' }),
        ).toBeInTheDocument();
        expect(screen.getByText('Forgot Password')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Log in' }),
        ).toBeInTheDocument();
    });
});
