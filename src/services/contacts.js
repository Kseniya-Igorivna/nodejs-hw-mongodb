import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import { ContactsCollection } from '../db/models/contacts.js';

export async function getAllContacts() {
  try {
    const contacts = await ContactsCollection.find({});
    return contacts;
  } catch (error) {
    throw new Error(`Error fetching contacts: ${error.message}`);
  }
}

export async function getContactById(contactId) {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createHttpError(400, `Invalid contact ID: ${contactId}`);
  }

  const contact = await ContactsCollection.findById(contactId);
  if (!contact) {
    throw createHttpError(404, `Contact with ID ${contactId} not found`);
  }

  return contact;
}

export async function createContact(payload) {
  try {
    const contact = await ContactsCollection.create(payload);
    return contact;
  } catch (error) {
    throw new Error(`Error creating contact: ${error.message}`);
  }
}

export async function updateContact(contactId, updatedData) {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createHttpError(400, `Invalid contact ID: ${contactId}`);
  }

  const updatedContact = await ContactsCollection.findByIdAndUpdate(
    contactId,
    updatedData,
    { new: true, runValidators: true }
  );

  if (!updatedContact) {
    throw createHttpError(404, `Contact with ID ${contactId} not found`);
  }

  return updatedContact;
}

export async function deleteContact(contactId) {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createHttpError(400, `Invalid contact ID: ${contactId}`);
  }

  const contact = await ContactsCollection.findByIdAndDelete(contactId);
  if (!contact) {
    throw createHttpError(404, `Contact with ID ${contactId} not found`);
  }

  return contact;
}