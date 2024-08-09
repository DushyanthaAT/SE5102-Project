// import express from 'express';
// import request from 'supertest'; // To test the express routes
// import multer from 'multer';
// import multerS3 from 'multer-s3';
// import aws from 'aws-sdk';
// import router from './orderRoute'; // Adjust the path to your router file

// jest.mock('aws-sdk');
// jest.mock('multer-s3');

// const app = express();
// app.use(express.json());
// app.use('/api/upload', router);

// describe('POST /api/upload/s3', () => {
//     it('should upload a file to S3 and return its location', async () => {
//       const mockFile = Buffer.from('test image content');
//       const mockLocation = 'https://unsplash.com/photos/a-person-sitting-at-a-table-with-a-laptop-and-a-mouse-eSRI3iTPkBc';
  
//       aws.S3.mockImplementation(() => ({
//         upload: jest.fn().mockReturnValue({
//           promise: jest.fn().mockResolvedValue({ Location: mockLocation }),
//         }),
//       }));
  
//       multerS3.mockImplementation(() => ({
//         _handleFile: jest.fn((req, file, cb) => {
//           cb(null, { location: mockLocation });
//         }),
//         _removeFile: jest.fn((req, file, cb) => cb(null)),
//       }));
  
//       const response = await request(app)
//         .post('/api/upload/s3')
//         .attach('image', mockFile, 'test.jpg');
  
//       expect(response.status).toBe(200);
//       expect(response.text).toBe(mockLocation);
//     });
//   });
  