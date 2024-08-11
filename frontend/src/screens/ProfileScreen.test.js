import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileScreen from './ProfileScreen';

describe('ProfileScreen', () => {
  const user = { name: 'John Doe', email: 'john@example.com' };

  test('renders user profile with initial values', () => {
    render(<ProfileScreen user={user} />);

    // Get the input elements directly
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);

    // Check the initial values of the input fields
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
  });

  test('updates profile on form submission', () => {
    render(<ProfileScreen user={user} />);

    // Update the input fields
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'newpassword' } });

    // Click the update button
    fireEvent.click(screen.getByText(/update/i));

    // Check the updated values of the input fields
    expect(screen.getByLabelText(/name/i).value).toBe('Jane Doe');
    expect(screen.getByLabelText(/email/i).value).toBe('jane@example.com');
  });
});
