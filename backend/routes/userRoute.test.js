import express from 'express';
import request from 'supertest'; // To test the express routes
import User from '../models/userModel'; 
import { getToken, isAuth } from '../util';
import router from './userRoute'; // Adjust the path to your router file

jest.mock('../models/userModel');
jest.mock('../util');

const app = express();
app.use(express.json()); // Middleware to parse JSON requests
app.use('/api/users', router);

describe('PUT /api/users/:id', () => {
  it('should update user details if user is authenticated', async () => {
    const mockUser = {
      _id: 'userId',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
      save: jest.fn().mockResolvedValue({
        _id: 'userId',
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        isAdmin: false,
      }),
    };

    User.findById.mockResolvedValue(mockUser);
    isAuth.mockImplementation((req, res, next) => next());
    getToken.mockReturnValue('mockToken');

    const response = await request(app)
      .put('/api/users/userId')
      .send({ name: 'Jane Doe', email: 'janedoe@example.com' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Jane Doe');
    expect(response.body.token).toBe('mockToken');
  });

  it('should return 404 if user is not found', async () => {
    User.findById.mockResolvedValue(null);
    isAuth.mockImplementation((req, res, next) => next());

    const response = await request(app)
      .put('/api/users/userId')
      .send({ name: 'Jane Doe' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User Not Found');
  });
});

describe('POST /api/users/signin', () => {
  it('should sign in user with valid credentials', async () => {
    const mockUser = {
      _id: 'userId',
      name: 'John Doe',
      email: 'johndoe@example.com',
      isAdmin: false,
    };

    User.findOne.mockResolvedValue(mockUser);
    getToken.mockReturnValue('mockToken');

    const response = await request(app)
      .post('/api/users/signin')
      .send({ email: 'johndoe@example.com', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body.email).toBe('johndoe@example.com');
    expect(response.body.token).toBe('mockToken');
  });

  it('should return 401 if credentials are invalid', async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post('/api/users/signin')
      .send({ email: 'wrongemail@example.com', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid Email or Password.');
  });
});

describe('POST /api/users/register', () => {
  it('should register a new user with valid data', async () => {
    const mockUser = {
      _id: 'userId',
      name: 'John Doe',
      email: 'johndoe@example.com',
      isAdmin: false,
    };

    User.prototype.save = jest.fn().mockResolvedValue(mockUser);
    getToken.mockReturnValue('mockToken');

    const response = await request(app)
      .post('/api/users/register')
      .send({ name: 'John Doe', email: 'johndoe@example.com', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body.email).toBe('johndoe@example.com');
    expect(response.body.token).toBe('mockToken');
  });

  it('should return 401 if user data is invalid', async () => {
    User.prototype.save = jest.fn().mockResolvedValue(null);

    const response = await request(app)
      .post('/api/users/register')
      .send({ name: 'John Doe', email: 'johndoe@example.com', password: 'password' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid User Data.');
  });
});

describe('GET /api/users/createadmin', () => {
  it('should create an admin user successfully', async () => {
    const mockUser = {
      _id: 'userId',
      name: 'Basir',
      email: 'admin@example.com',
      isAdmin: true,
    };

    User.prototype.save = jest.fn().mockResolvedValue(mockUser);

    const response = await request(app).get('/api/users/createadmin');

    expect(response.status).toBe(200);
    expect(response.body.email).toBe('admin@example.com');
    expect(response.body.isAdmin).toBe(true);
  });

  it('should return error message if there is an error', async () => {
    User.prototype.save = jest.fn().mockRejectedValue(new Error('Error creating admin'));

    const response = await request(app).get('/api/users/createadmin');

    expect(response.status).toBe(200); // Express doesn't specify a status for errors in this route
    expect(response.body.message).toBe('Error creating admin');
  });
});

test('should update user password if provided', async () => {
  const mockUser = {
    _id: 'userId',
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: 'oldPassword',
    save: jest.fn().mockResolvedValue({
      _id: 'userId',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'newPassword',
      isAdmin: false,
    }),
  };

  User.findById.mockResolvedValue(mockUser);
  isAuth.mockImplementation((req, res, next) => next());

  const response = await request(app)
    .put('/api/users/userId')
    .send({ password: 'newPassword' });

  expect(response.status).toBe(200);
  expect(response.body.name).toBe('John Doe');
  expect(mockUser.save).toHaveBeenCalled();
  expect(mockUser.password).toBe('newPassword');
});


describe('Security Tests', () => {
  it('should block access to PUT /api/users/:id if not authenticated', async () => {
    isAuth.mockImplementation((req, res, next) => {
      res.status(401).send({ message: 'Unauthorized' });
    });

    const response = await request(app)
      .put('/api/users/userId')
      .send({ name: 'Jane Doe' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });
});


