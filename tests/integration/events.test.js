const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../server');
const Event = require('../../models/Event');
const Category = require('../../models/Category');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

let mongoServer;
let adminToken;
let categoryId;

const createAdminToken = async () => {
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@test.com',
    password: 'hashedpassword',
    role: 'admin'
  });
  return jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET);
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const category = await Category.create({
    name: 'Test Category',
    description: 'Test description'
  });
  categoryId = category._id;
  adminToken = await createAdminToken();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Events API Integration Tests', () => {
  test('POST /api/events - should create event (admin only)', async () => {
    const eventData = {
      title: 'Test Event',
      description: 'Test event description',
      date: '2026-12-01',
      city: 'Cairo',
      venue: 'Test Venue',
      capacity: 100,
      category: categoryId
    };

    const response = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(eventData);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.data.title).toBe('Test Event');
    expect(response.body.data.category).toBe(categoryId.toString());
  });

  test('POST /api/events - should return 422 for invalid data', async () => {
    const invalidData = {
      // missing title
      description: 'No title',
      date: '2026-12-01',
      city: 'Cairo',
      venue: 'Venue',
      capacity: 100,
      category: categoryId
    };

    const response = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(invalidData);

    expect(response.status).toBe(422);
    expect(response.body.status).toBe('fail');
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors.some(e => e.field === 'title')).toBe(true);
  });

  test('POST /api/events - should return 401 without token', async () => {
    const eventData = {
      title: 'Test',
      description: 'Test desc',
      date: '2026-12-01',
      city: 'Cairo',
      venue: 'Venue',
      capacity: 100,
      category: categoryId
    };

    const response = await request(app)
      .post('/api/events')
      .send(eventData);

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/not authorized/i);
  });
});