const express = require('express');
const connectDB = require('./config/configDB');
const logRoutes = require('./routes/logRoutes');
require('dotenv').config();

const app = express();``
connectDB();

app.use(express.json());
app.use('/api', logRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
