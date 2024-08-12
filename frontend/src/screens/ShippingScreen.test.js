import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useHistory } from 'react-router-dom';
import ShippingScreen from './ShippingScreen';
import '@testing-library/jest-dom'; 

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(),
}));

describe('ShippingScreen', () => {
  const mockHistory = { push: jest.fn() };

  beforeEach(() => {
    useHistory.mockReturnValue(mockHistory);
    jest.clearAllMocks();
  });

  test('renders ShippingScreen component', () => {
    render(<ShippingScreen />);
    expect(screen.getByRole('heading', { name: /shipping/i })).toBeInTheDocument();
  });

  test('displays error messages for empty fields on submit', () => {
    render(<ShippingScreen />);

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    expect(screen.getByText(/address is required/i)).toBeInTheDocument();
    expect(screen.getByText(/city is required/i)).toBeInTheDocument();
    expect(screen.getByText(/postal code is required/i)).toBeInTheDocument();
    expect(screen.getByText(/country is required/i)).toBeInTheDocument();
  });

  test('redirects to payment page on successful form submission', () => {
    render(<ShippingScreen />);

    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'Anytown' } });
    fireEvent.change(screen.getByLabelText(/postal code/i), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText(/country/i), { target: { value: 'Countryland' } });

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    expect(mockHistory.push).toHaveBeenCalledWith('/payment');
  });
});
