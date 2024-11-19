import mongoose from 'mongoose';
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
    throw new Error(`Invalid contact ID: ${contactId}`);
  }
  try {
    const contact = await ContactsCollection.findById(contactId);
    if (!contact) throw new Error(`Contact with ID ${contactId} not found`);
    return contact;
  } catch (error) {
    throw new Error(`Error fetching contact by ID: ${error.message}`);
  }
}

export async function createContact(payload) {
  try {
    const contact = await ContactsCollection.create(payload);
    return contact;
  } catch (error) {
    throw new Error(`Error creating contact: ${error.message}`);
  }
}

export async function updateContact(contactId, payload, options = {}) {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw new Error(`Invalid contact ID: ${contactId}`);
  }
  try {
    const contact = await ContactsCollection.findByIdAndUpdate(
      contactId,
      payload,
      { new: true, upsert: options.upsert }
    );
    return {
      contact,
      isNew: Boolean(contact && options.upsert),
    };
  } catch (error) {
    throw new Error(`Error updating contact: ${error.message}`);
  }
}

export async function deleteContact(contactId) {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw new Error(`Invalid contact ID: ${contactId}`);
  }
  try {
    const contact = await ContactsCollection.findOneAndDelete({ _id: contactId });
    if (!contact) throw new Error(`Contact with ID ${contactId} not found`);
    return contact;
  } catch (error) {
    throw new Error(`Error deleting contact: ${error.message}`);
  }
}