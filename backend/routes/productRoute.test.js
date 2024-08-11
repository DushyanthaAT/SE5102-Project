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

it('should return 404 when posting a review to a non-existing product', async () => {
  const res = await request(app)
    .post('/api/products/60c72b2f5f1b2f1b3c8a4c2f/reviews')
    .send({
      name: 'Jane Doe',
      rating: 4,
      comment: 'Nice product!',
    });
  expect(res.statusCode).toBe(404);
  expect(res.body.message).toBe('Product Not Found');
});

it('should fetch products sorted by price in ascending order', async () => {
  const product1 = new Product({
    name: 'Cheap Product',
    price: 50,
    image: 'cheap.jpg',
    brand: 'Cheap Brand',
    category: 'Cheap Category',
    countInStock: 10,
    description: 'Cheap description',
  });

  const product2 = new Product({
    name: 'Expensive Product',
    price: 500,
    image: 'expensive.jpg',
    brand: 'Expensive Brand',
    category: 'Expensive Category',
    countInStock: 5,
    description: 'Expensive description',
  });

  await product1.save();
  await product2.save();

  const res = await request(app).get('/api/products?sortOrder=lowest');
  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveLength(2);
  expect(res.body[0].name).toBe('Cheap Product');
});

it('should fetch products with search keyword', async () => {
  const product = new Product({
    name: 'Unique Product',
    price: 150,
    image: 'unique.jpg',
    brand: 'Unique Brand',
    category: 'Unique Category',
    countInStock: 10,
    description: 'Unique description',
  });
  await product.save();

  const res = await request(app).get('/api/products?searchKeyword=Unique');
  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveLength(1);
  expect(res.body[0].name).toBe('Unique Product');
});

it('should fetch products with category filter', async () => {
  const product1 = new Product({
    name: 'Product 1',
    price: 100,
    image: 'product1.jpg',
    brand: 'Brand 1',
    category: 'Category 1',
    countInStock: 10,
    description: 'Description 1',
  });

  const product2 = new Product({
    name: 'Product 2',
    price: 200,
    image: 'product2.jpg',
    brand: 'Brand 2',
    category: 'Category 2',
    countInStock: 20,
    description: 'Description 2',
  });

  await product1.save();
  await product2.save();

  const res = await request(app).get('/api/products?category=Category 1');
  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveLength(1);
  expect(res.body[0].category).toBe('Category 1');
});

it('should return 404 when posting a review to a non-existing product', async () => {
  const res = await request(app)
    .post('/api/products/60c72b2f5f1b2f1b3c8a4c2f/reviews')
    .send({
      name: 'Jane Doe',
      rating: 4,
      comment: 'Nice product!',
    });
  expect(res.statusCode).toBe(404);
  expect(res.body.message).toBe('Product Not Found');
});




describe('Additional Product Route Tests', () => {
  it('should return 500 when trying to update a non-existing product', async () => {
    const res = await request(app)
      .put('/api/products/60c72b2f5f1b2f1b3c8a4c2f')
      .send({
        name: 'Non-Existing Product',
        price: 200,
        image: 'non-existing.jpg',
        brand: 'Non-Existing Brand',
        category: 'Non-Existing Category',
        countInStock: 0,
        description: 'Description for a non-existing product',
      });
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe(' Error in Updating Product.');
  });
  
});
