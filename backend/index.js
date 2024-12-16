const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const authRoutes = require('./routes/userRoute');
const projectRoutes = require('./routes/projectRoute');
const paymentRoutes = require('./routes/paymentRoute');
const app = express();

app.use(cors());
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/payments', paymentRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server Starting On http://localhost:${process.env.PORT}`);
    connectDB();
});