const mongoose = require('mongoose');

const healthCheck = async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      name: mongoose.connection.name || 'N/A'
    },
    uptime: process.uptime()
  });
};

module.exports = { healthCheck };