import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SigninScreen from './SigninScreen'; 

describe('SigninScreen', () => {
    const mockOnSubmit = jest.fn();

    beforeEach(() => {
        render(<SigninScreen onSubmit={mockOnSubmit} />);
    });

    test('renders Sign In form', () => {
        expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    test('allows users to fill out the form', () => {
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'password123' },
        });

        expect(screen.getByLabelText(/email/i).value).toBe('test@example.com');
        expect(screen.getByLabelText(/password/i).value).toBe('password123');
    });

    test('renders the link to the registration page', () => {
        const link = screen.getByRole('link', { name: /register/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/register');
    });
    
    

});
