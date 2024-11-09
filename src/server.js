import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { getAllContacts, getContactById } from './services/contacts.js';

export const initMongoConnection = async () => {
  try {
    const user = env('MONGODB_USER');
    const pwd = env('MONGODB_PASSWORD');
    const url = env('MONGODB_URL');
    const db = env('MONGODB_DB');

    await mongoose.connect(`mongodb+srv://${user}:${pwd}@${url}/${db}`);
    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.error('Error connecting to MongoDB:', e);
    throw e;
  }
};

export function setupServer() {
  const app = express();

  app.use(pino());
  app.use(cors());

  // Routes
  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    if (!contacts.length) {
      return res.status(404).json({
        status: 404,
        message: 'Contacts not found',
        error: 'Database is empty',
      });
    }
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
        error: `Contact with id ${contactId} not found`,
      });
    }
    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      status: 404,
      message: 'Not found',
      error: `The requested resource ${req.url} was not found`,
    });
  });

  app.use((error, req, res, next) => {
    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      error: error.message,
    });
  });

  const PORT = Number(env('PORT', 3000));
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

async function bootstrap() {
  await initMongoConnection();
  setupServer();
}

bootstrap();
