import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import router from './orderRoute'; // Update with the correct path
import Order from '../models/orderModel'; // Update with the correct path
import { isAuth, isAdmin } from '../util'; // Update with the correct path

jest.mock('../models/orderModel');
jest.mock('../util');

const app = express();
app.use(express.json());
app.use('/api/orders', router);

isAuth.mockImplementation((req, res, next) => {
  req.user = { _id: mongoose.Types.ObjectId() };
  next();
});

isAdmin.mockImplementation((req, res, next) => {
  next();
});


//>>Test GET / Route

describe('GET /api/orders', () => {
  it('should return all orders', async () => {
    const mockOrders = [
      { _id: 'order1', user: 'user1' },
      { _id: 'order2', user: 'user2' },
    ];

    // Mock the find method and chain the populate method
    Order.find.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(mockOrders),
    }));

    const response = await request(app).get('/api/orders');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockOrders);
  });
});


//>>Test GET /mine Route

describe('GET /api/orders/mine', () => {
    it('should return orders for the authenticated user', async () => {
      const mockOrders = [{ _id: 'order1', user: 'user1' }];
      Order.find.mockResolvedValue(mockOrders);
  
      const response = await request(app).get('/api/orders/mine');
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockOrders);
    });
  });
  
  
//>>Test GET /:id Route

describe('GET /api/orders/:id', () => {
    it('should return an order by ID', async () => {
      const mockOrder = { _id: 'order1', user: 'user1' };
      Order.findOne.mockResolvedValue(mockOrder);
  
      const response = await request(app).get('/api/orders/order1');
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockOrder);
    });
  
    it('should return 404 if order is not found', async () => {
      Order.findOne.mockResolvedValue(null);
  
      const response = await request(app).get('/api/orders/order1');
  
      expect(response.status).toBe(404);
      expect(response.text).toBe('Order Not Found.');
    });
  });
  

//>>Test DELETE /:id Route

describe('DELETE /api/orders/:id', () => {
    it('should delete an order by ID', async () => {
      const mockOrder = { _id: 'order1', user: 'user1', remove: jest.fn().mockResolvedValue({}) }; // Ensure 'remove' is included
  
      Order.findOne.mockResolvedValue(mockOrder); // Mocking findOne to return the mockOrder
      const response = await request(app).delete('/api/orders/order1'); // Call the endpoint
  
      expect(response.status).toBe(200); // Check for success status
      expect(response.body).toEqual({}); // Check for the returned body
    }, 10000); // Increase timeout if needed
  });


  //>>Test POST / Route

  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      const mockOrder = { _id: 'order1', user: 'user1', orderItems: [] };
      Order.prototype.save = jest.fn().mockResolvedValue(mockOrder);
  
      const response = await request(app)
        .post('/api/orders')
        .send({
          orderItems: [],
          shipping: {},
          payment: {},
          itemsPrice: 100,
          taxPrice: 10,
          shippingPrice: 5,
          totalPrice: 115,
        });
  
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('New Order Created');
      expect(response.body.data).toEqual(mockOrder);
    });
  });
  

  //>>Test PUT /:id/pay Route

  describe('PUT /api/orders/:id/pay', () => {
    it('should mark an order as paid', async () => {
      const mockOrder = { _id: 'order1', user: 'user1', isPaid: false, save: jest.fn() };
      
      Order.findById.mockResolvedValue(mockOrder);
      mockOrder.save.mockResolvedValue({ 
        ...mockOrder, 
        isPaid: true, 
        paidAt: Date.now() 
      });
  
      const response = await request(app)
        .put('/api/orders/order1/pay')
        .send({
          payerID: 'payerID',
          orderID: 'orderID',
          paymentID: 'paymentID',
        });
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Order Paid.');
      expect(response.body.order.isPaid).toBe(true);
      expect(mockOrder.save).toHaveBeenCalled(); // Ensure save method was called
    });
  
    it('should return 404 if order is not found', async () => {
      Order.findById.mockResolvedValue(null);
  
      const response = await request(app).put('/api/orders/order1/pay');
  
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Order not found.');
    });
  });
  
