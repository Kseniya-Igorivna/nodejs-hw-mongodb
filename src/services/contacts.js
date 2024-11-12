import { ContactsCollection } from '../db/models/contacts.js';
import createHttpError from 'http-errors';

export async function getAllContacts() {
  const contacts = await ContactsCollection.find({});
  return contacts;
}

export async function getContactById(contactId) {
  const contact = await ContactsCollection.findById(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
}

export async function createContact(payload) {
  const contact = await ContactsCollection.create(payload);
  return contact;
}

export async function updateContact(contactId, payload) {
  const updatedContact = await ContactsCollection.findByIdAndUpdate(
    contactId,
    payload,
    { new: true },
  );

  if (!updatedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  return updatedContact;
}

export async function deleteContact(contactId) {
  const deletedContact = await ContactsCollection.findByIdAndDelete(contactId);
  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }
  return deletedContact;
}
