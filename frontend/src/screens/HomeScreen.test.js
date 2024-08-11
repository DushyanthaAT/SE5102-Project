import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import HomeScreen from './HomeScreen'; 
import * as actions from '../actions/productActions';
import '@testing-library/jest-dom';


jest.mock('../actions/productActions'); 

describe('HomeScreen Component', () => {
  const mockDispatch = jest.fn();
  const mockState = {
    productList: {
      products: [],
      loading: false,
      error: null,
    },
  };

  beforeEach(() => {
    actions.listProducts.mockClear(); 
  });

  test('renders HomeScreen component', () => {
    render(
      <Provider store={{ getState: () => mockState, subscribe: jest.fn(), dispatch: mockDispatch }}>
        <Router>
          <HomeScreen match={{ params: { id: '' } }} />
        </Router>
      </Provider>
    );

    expect(screen.getByPlaceholderText(/search products.../i)).toBeInTheDocument();
    expect(screen.getByText(/sort by/i)).toBeInTheDocument();
  });

  test('displays loading state', () => {
    const loadingState = {
      productList: {
        products: [],
        loading: true,
        error: null,
      },
    };

    render(
      <Provider store={{ getState: () => loadingState, subscribe: jest.fn(), dispatch: mockDispatch }}>
        <Router>
          <HomeScreen match={{ params: { id: '' } }} />
        </Router>
      </Provider>
    );

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  test('displays error message', () => {
    const errorState = {
      productList: {
        products: [],
        loading: false,
        error: 'Something went wrong',
      },
    };

    render(
      <Provider store={{ getState: () => errorState, subscribe: jest.fn(), dispatch: mockDispatch }}>
        <Router>
          <HomeScreen match={{ params: { id: '' } }} />
        </Router>
      </Provider>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  test('submits search form and dispatches action', () => {
    render(
      <Provider store={{ getState: () => mockState, subscribe: jest.fn(), dispatch: mockDispatch }}>
        <Router>
          <HomeScreen match={{ params: { id: '' } }} />
        </Router>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/search products.../i), {
      target: { value: 'test product' },
    });
    fireEvent.click(screen.getByText(/search/i));

    expect(actions.listProducts).toHaveBeenCalledWith('', 'test product', '');
  });

  test('changes sort order and dispatches action', () => {
    render(
      <Provider store={{ getState: () => mockState, subscribe: jest.fn(), dispatch: mockDispatch }}>
        <Router>
          <HomeScreen match={{ params: { id: '' } }} />
        </Router>
      </Provider>
    );

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'lowest' },
    });

    expect(actions.listProducts).toHaveBeenCalledWith('', '', 'lowest');
  });
});
