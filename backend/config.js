module.exports = {
  MONGO_URI: 'mongodb://localhost:27017/student-management',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production',
  PORT: 5001,
};