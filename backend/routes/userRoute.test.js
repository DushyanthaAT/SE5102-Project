import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './userRoute';
import User from '../models/userModel';

// Initialize the Express app
const app = express();
app.use(express.json());
app.use('/routes/users', userRoutes);

// Connect to an in-memory MongoDB server for testing
beforeAll(async () => {
  const url = `mongodb://127.0.0.1/test_database`;
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

// Test Cases

// User Registration Tests
describe('User Registration', () => {
  test('should register a user successfully', async () => {
    const response = await request(app)
      .post('/routes/users/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('token');
  },10000);
});
//   test('should fail to register a user with existing email', async () => {
//     await request(app)
//       .post('/routes/users/register')
//       .send({
//         name: 'Existing User',
//         email: 'existinguser@example.com',
//         password: 'password123',
//       });

//     const response = await request(app)
//       .post('/routes/users/register')
//       .send({
//         name: 'Another User',
//         email: 'existinguser@example.com', // Same email as before
//         password: 'password1234',
//       });

//     expect(response.status).toBe(401);
//     expect(response.body.message).toBe('Invalid User Data.');
//   }, 10000);
// });

// // User Sign-In Tests
// describe('User Sign-In', () => {
//   test('should sign in a user with valid credentials', async () => {
//     const response = await request(app)
//       .post('/api/users/signin')
//       .send({
//         email: 'testuser@example.com',
//         password: 'password123',
//       });

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('token');
//   });

//   test('should fail sign-in with incorrect credentials', async () => {
//     const response = await request(app)
//       .post('/api/users/signin')
//       .send({
//         email: 'testuser@example.com',
//         password: 'wrongpassword',
//       });

//     expect(response.status).toBe(401);
//     expect(response.body.message).toBe('Invalid Email or Password.');
//   });
// });

// // Update User Profile Tests
// describe('Update User Profile', () => {
//   test('should update user profile', async () => {
//     const userResponse = await request(app)
//       .post('/api/users/register')
//       .send({
//         name: 'Test User',
//         email: 'updateuser@example.com',
//         password: 'password123',
//       });

//     const userId = userResponse.body._id;

//     const response = await request(app)
//       .put(`/api/users/${userId}`)
//       .send({
//         name: 'Updated Name',
//         email: 'updatedemail@example.com',
//         password: 'newpassword123',
//       });

//     expect(response.status).toBe(200);
//     expect(response.body.name).toBe('Updated Name');
//   });

//   test('should return 404 if user not found', async () => {
//     const response = await request(app)
//       .put('/api/users/invalidId')
//       .send({
//         name: 'Name',
//         email: 'email@example.com',
//         password: 'password123',
//       });

//     expect(response.status).toBe(404);
//     expect(response.body.message).toBe('User Not Found');
//   });
// });

// Admin Creation Test
// describe('Create Admin', () => {
//   test('should create an admin user', async () => {
//     const response = await request(app).get('/api/users/createadmin');

//     expect(response.status).toBe(200);
//     expect(response.body.isAdmin).toBe(true);
//   });
// });
