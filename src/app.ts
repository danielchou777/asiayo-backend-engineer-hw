import express from 'express';
import orderRoutes from './routes/orderRoutes.js';

const app = express();

app.use(express.json());
app.use('/api', orderRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
