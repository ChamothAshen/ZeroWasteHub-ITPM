import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
dotenv.config();
mongoose.connect(
  process.env.MONGOUrl).then(() => {
  console.log('connected to mongodb');
}).catch((err) => {
  console.log(err);
})

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
app.use('/api/user', userRoutes);