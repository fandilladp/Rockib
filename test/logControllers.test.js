const request = require('supertest');
const express = require('express');
const logRoutes = require('../routes/logRoutes');
const Log = require('../models/db');
const connectDB = require('../config/configDB');
const mongoose = require('mongoose');

// Mock the Utilitor post function to prevent actual network calls
jest.mock('../controllers/logControllers', () => ({
  ...jest.requireActual('../controllers/logControllers'),
  postUtilizationData: jest.fn().mockResolvedValueOnce(), // Ensure the mock resolves properly
}));

// Inisialisasi aplikasi Express
const app = express();
app.use(express.json());
app.use('/api', logRoutes);

describe('Log Management System API', () => {
  // Connect to the database using the existing config
  beforeAll(async () => {
    await connectDB(); // Use the real database connection
  }, 30000); // Add a 30 seconds timeout

  // Clean up after tests
  afterAll(async () => {
    await mongoose.connection.close();
  }, 30000); // Add a 30 seconds timeout

  describe('POST /api/addLog', () => {
    it('should add a new log', async () => {
      Log.prototype.save = jest.fn().mockResolvedValueOnce(true);

      const response = await request(app)
        .post('/api/addLog')
        .send({
          app: 'testApp',
          section: 'testSection',
          subsection: 'testSubsection',
          data: { key: 'value' },
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Log added successfully');
      expect(Log.prototype.save).toHaveBeenCalled();
    });
  });

  describe('GET /api/getData', () => {
    it('should retrieve logs by app name', async () => {
      const mockLogs = [
        {
          _id: '123',
          app: 'testApp',
          section: 'testSection',
          subsection: 'testSubsection',
          data: { key: 'value' },
          createdAt: new Date(),
        },
      ];

      // Mock the Log.find().sort().exec() chain
      Log.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(mockLogs), // Mock logs return
      });

      const response = await request(app).get('/api/getData?app=testApp');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].app).toBe('testApp');
      expect(Log.find).toHaveBeenCalledWith({ app: 'testApp' });
    });

    it('should return 400 if app parameter is missing', async () => {
      const response = await request(app).get('/api/getData');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('App parameter is required');
    });

    it('should return 500 if an error occurs', async () => {
      // Simulate an error during log retrieval
      Log.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValueOnce(new Error('Database error')),
      });

      const response = await request(app).get('/api/getData?app=testApp');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Server error');
    });
  });
});
