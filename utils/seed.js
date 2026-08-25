console.log('🚀 SEED SCRIPT STARTED...');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Category = require('../models/Category');
const Event = require('../models/Event');

const connectDB = require('../config/db');

const seedDatabase = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected.');

    console.log('🗑️ Dropping database...');
    await mongoose.connection.db.dropDatabase();
    console.log('✅ Database dropped.');

    console.log('👤 Creating admin user...');
    // No need to manually hash – the pre-save hook does it
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@eventpulse.com',
      password: 'Admin@123',
      role: 'admin',
    });
    console.log('✅ Admin created.');

    console.log('📂 Creating categories...');
    const categories = await Category.insertMany([
      { name: 'Music', description: 'Live music and concerts' },
      { name: 'Technology', description: 'Tech conferences and hackathons' },
      { name: 'Art', description: 'Art exhibitions and galleries' },
      { name: 'Sports', description: 'Sports tournaments and marathons' },
    ]);
    console.log(`✅ ${categories.length} categories created.`);

    console.log('🎪 Creating events...');
    await Event.insertMany([
      {
        title: 'Summer Music Fest',
        description: 'A huge outdoor music festival with top artists.',
        date: new Date('2026-08-20'),
        city: 'New York',
        venue: 'Central Park',
        capacity: 500,
        category: categories[0]._id,
        organizer: admin._id,
      },
      {
        title: 'Tech Expo 2026',
        description: 'Latest innovations in AI, blockchain, and cloud.',
        date: new Date('2026-09-15'),
        city: 'San Francisco',
        venue: 'Moscone Center',
        capacity: 300,
        category: categories[1]._id,
        organizer: admin._id,
      },
      {
        title: 'Art Night Downtown',
        description: 'Modern art showcase featuring local artists.',
        date: new Date('2026-10-05'),
        city: 'Chicago',
        venue: 'Art Institute',
        capacity: 150,
        category: categories[2]._id,
        organizer: admin._id,
      },
      {
        title: 'City Marathon',
        description: 'Annual city marathon open to all runners.',
        date: new Date('2026-11-10'),
        city: 'Boston',
        venue: 'Boston Common',
        capacity: 1000,
        category: categories[3]._id,
        organizer: admin._id,
      },
    ]);
    console.log('✅ Events created.');

    console.log('🌱 🌟 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();