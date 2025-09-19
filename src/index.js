const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); 
const port = 5000;
 
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); 


// Route imports
const authRoutes = require('./routes/authRoutes');
const partnerRoutes = require('./routes/partnerRoutes'); 
const tokenRoutes = require('./routes/tokenRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const gAuth = require('./routes/gAuthRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/auth', gAuth);
app.use('/api/partners', partnerRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Daneshwari Server is running!',
    timestamp: new Date().toISOString(),
    database: 'Azure PostgreSQL',
    version: '1.0.0'
  });
});

// Default root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Daneshwari API. Please visit /api for API documentation.'
  });
}); 

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
module.exports = app;
