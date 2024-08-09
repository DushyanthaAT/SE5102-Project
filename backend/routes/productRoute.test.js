import request from 'supertest';
import express from 'express';
import productRoutes from './productRoute';
import mongoose from 'mongoose';
import Product from '../models/productModel';

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

// Mock isAuth and isAdmin middleware for testing
jest.mock('../util', () => ({
  isAuth: (req, res, next) => next(),
  isAdmin: (req, res, next) => next(),
}));

beforeAll(async () => {
  // Connect to the in-memory MongoDB database before all tests
  await mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });
});

afterEach(async () => {
  // Clean up the database after each test
  await Product.deleteMany({});
});

afterAll(async () => {
  // Disconnect from the database after all tests
  await mongoose.connection.close();
});

describe('Product Routes', () => {
  it('should fetch all products', async () => {
    const product = new Product({
      name: 'Sample Product',
      price: 100,
      image: 'sample.jpg',
      brand: 'Sample Brand',
      category: 'Sample Category',
      countInStock: 10,
      description: 'Sample description',
    });
    await product.save();

    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Sample Product');
  });

  it('should fetch a product by id', async () => {
    const product = new Product({
      name: 'Sample Product',
      price: 100,
      image: 'sample.jpg',
      brand: 'Sample Brand',
      category: 'Sample Category',
      countInStock: 10,
      description: 'Sample description',
    });
    await product.save();

    const res = await request(app).get(`/api/products/${product._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Sample Product');
  });

  it('should return 404 for a non-existing product', async () => {
    const res = await request(app).get('/api/products/60c72b2f5f1b2f1b3c8a4c2f');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Product Not Found.');
  });

  it('should create a new product', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({
        name: 'New Product',
        price: 150,
        image: 'sample.jpg',
        brand: 'Brand A',
        category: 'Category A',
        countInStock: 10,
        description: 'Sample description',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.name).toBe('New Product');
  });

  it('should update an existing product', async () => {
    const product = new Product({
      name: 'Old Product',
      price: 100,
      image: 'sample.jpg',
      brand: 'Old Brand',
      category: 'Old Category',
      countInStock: 10,
      description: 'Old description',
    });
    await product.save();

    const res = await request(app)
      .put(`/api/products/${product._id}`)
      .send({
        name: 'Updated Product',
        price: 200,
        image: 'updated.jpg',
        brand: 'Updated Brand',
        category: 'Updated Category',
        countInStock: 15,
        description: 'Updated description',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe('Updated Product');
  });

  it('should delete a product', async () => {
    const product = new Product({
      name: 'Product to Delete',
      price: 100,
      image: 'sample.jpg',
      brand: 'Brand to Delete',
      category: 'Category to Delete',
      countInStock: 10,
      description: 'Description to Delete',
    });
    await product.save();

    const res = await request(app).delete(`/api/products/${product._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Product Deleted');
  });

  it('should post a review for a product', async () => {
    const product = new Product({
      name: 'Product for Review',
      price: 100,
      image: 'sample.jpg',
      brand: 'Brand for Review',
      category: 'Category for Review',
      countInStock: 10,
      description: 'Description for Review',
    });
    await product.save();

    const res = await request(app)
      .post(`/api/products/${product._id}/reviews`)
      .send({
        name: 'John Doe',
        rating: 5,
        comment: 'Great product!',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Review saved successfully.');
  });
});