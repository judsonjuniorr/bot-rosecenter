import 'dotenv/config';
import mongoose from 'mongoose';

const host = process.env.MONGODB_HOST;
const port = process.env.MONGODB_PORT;
const database = process.env.MONGODB_DATABASE;

mongoose.connect(`mongodb://${host}:${port}/${database}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
