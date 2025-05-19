module.exports = {
  port: 5000,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/ai-job-match',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  jwtExpiration: '24h',
  openaiApiKey: process.env.OPENAI_API_KEY
};