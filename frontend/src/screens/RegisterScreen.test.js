import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from './RegisterScreen';

describe('Register component', () => {
  test('renders the form with all fields and a submit button', () => {
    render(<Register />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('allows the user to type into the name, email, and password fields', () => {
    render(<Register />);
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    
    expect(screen.getByLabelText(/name/i).value).toBe('John Doe');
    expect(screen.getByLabelText(/email/i).value).toBe('john@example.com');
    expect(screen.getByLabelText(/password/i).value).toBe('password123');
  });

  test('logs the registration data when the form is submitted', () => {
    render(<Register />);
    
    const consoleLogSpy = jest.spyOn(console, 'log');
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(consoleLogSpy).toHaveBeenCalledWith('User registered:', {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    consoleLogSpy.mockRestore();
  });

  test('disables the submit button when the form fields are empty', () => {
    render(<Register />);
    
    const submitButton = screen.getByRole('button', { name: /register/i });
    expect(submitButton).toBeDisabled();
  });

  test('enables the submit button when all fields are filled', () => {
    render(<Register />);
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    
    const submitButton = screen.getByRole('button', { name: /register/i });
    expect(submitButton).toBeEnabled();
  });

  test('clears the input fields after form submission', () => {
    render(<Register />);
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
  
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    expect(screen.getByLabelText(/name/i).value).toBe('');
    expect(screen.getByLabelText(/email/i).value).toBe('');
    expect(screen.getByLabelText(/password/i).value).toBe('');
  });

  
});
