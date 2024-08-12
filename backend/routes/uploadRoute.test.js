import express from 'express';
import request from 'supertest';
import aws from 'aws-sdk';
import uploadRouter from './uploadRoute'; 
import multer from 'multer';


jest.mock('aws-sdk', () => {
  const S3 = jest.fn(() => ({
    upload: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Location: 'https://mock-s3-url.com/image.jpg',
      }),
    }),
  }));

  return {
    config: {
      update: jest.fn(),
    },
    S3,
  };
});

jest.mock('../config', () => ({
  accessKeyId: 'mockAccessKeyId',
  secretAccessKey: 'mockSecretAccessKey',
}));

const app = express();
app.use(express.json());
app.use('/upload', uploadRouter);

describe('File Upload', () => {
  it('should upload a file and return the file path', async () => {
    const response = await request(app)
      .post('/upload/')
      .attach('image', 'test-image.jpg'); 

    expect(response.status).toBe(200);
    expect(response.text).toMatch(/\/uploads[\\/]\d+\.jpg/);
  });

});
