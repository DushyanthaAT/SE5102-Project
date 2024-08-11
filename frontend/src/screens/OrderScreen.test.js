import React from 'react'; 
import { render, screen, fireEvent } from '@testing-library/react';
import OrderScreen from './OrderScreen';
import '@testing-library/jest-dom'; 

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('OrderScreen Component', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  test('renders OrderScreen component', async () => {
    const orderData = {
      shipping: {
        address: '123 Main St',
        city: 'Anytown',
        postalCode: '12345',
        country: 'USA',
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(orderData),
    });

    render(<OrderScreen match={{ params: { id: '1' } }} history={{ push: jest.fn() }} />);

    // Use findBy to wait for the element to appear
    expect(await screen.findByText(/Shipping/i)).toBeInTheDocument();
    expect(await screen.findByText(/123 Main St/i)).toBeInTheDocument();
  });

  test('displays error message when order details fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    render(<OrderScreen match={{ params: { id: '1' } }} history={{ push: jest.fn() }} />);

    // Use findBy to check for the error message
    expect(await screen.findByText(/Error/i)).toBeInTheDocument();
    expect(await screen.findByText(/Failed to fetch order/i)).toBeInTheDocument();
  });

  test('handles payment success', async () => {
    const orderData = {
      shipping: {
        address: '123 Main St',
        city: 'Anytown',
        postalCode: '12345',
        country: 'USA',
      },
    };
    const historyMock = { push: jest.fn() };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(orderData),
    });

    render(<OrderScreen match={{ params: { id: '1' } }} history={historyMock} />);

    // Use findBy to check for the shipping text
    expect(await screen.findByText(/Shipping/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Pay Now/i));
    expect(historyMock.push).toHaveBeenCalledWith('/profile');
  });
});
