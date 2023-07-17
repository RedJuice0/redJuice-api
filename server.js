import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import cors from 'cors';

dotenv.config();
const app = express();

connectDb();

app.use(express.json());
app.use(cors());

const Schema = mongoose.Schema;
const AddressSchema = new Schema(
  {
    name: String,
    address: String,
  },
  { timestamps: true }
);

const Address = mongoose.model('Address', AddressSchema);


app.get('/api/v1', async (req, res) => {
  try {
    const names = await Address.find();
    res.json(names);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/v1', async (req, res) => {
  try {
    const { name, address } = req.body;
    const newAddress = new Address({ name, address });
    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/v1/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const deletedAddress = await Address.findOneAndDelete({ address });

    if (!deletedAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
