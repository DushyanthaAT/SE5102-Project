import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileScreen from './ProfileScreen';

describe('ProfileScreen', () => {
  const user = { name: 'John Doe', email: 'john@example.com' };

  test('renders user profile with initial values', () => {
    render(<ProfileScreen user={user} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);

    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
  });

  test('updates profile on form submission', () => {
    render(<ProfileScreen user={user} />);


    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'newpassword' } });

    fireEvent.click(screen.getByText(/update/i));

    expect(screen.getByLabelText(/name/i).value).toBe('Jane Doe');
    expect(screen.getByLabelText(/email/i).value).toBe('jane@example.com');
  });
});
