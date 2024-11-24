import createHttpError from 'http-errors';
import { ContactsCollection as Contact } from '../db/models/contacts.js'
import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';


export const getContactsController = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc' } = req.query;

    const skip = (Number(page) - 1) * Number(perPage);
    const totalItems = await Contact.countDocuments();
    const contacts = await Contact.find()
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(perPage));

    if (!contacts.length) {
      return next(createHttpError(404, 'Contacts not found'));
    }

    const totalPages = Math.ceil(totalItems / perPage);

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        page: Number(page),
        perPage: Number(perPage),
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await ContactsCollection.findById(contactId);

    if (!contact) {
      throw createHttpError(404, `Contact with ID ${contactId} not found`);
    }

    res.status(200).json({
      status: 200,
      message: "Contact retrieved successfully",
      data: contact,
    });
  } catch (error) {
    next(error); 
  }
};

export const createContactController = async (req, res, next) => {
  try {
    const contact = await createContact(req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully created contact!',
      data: contact,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updatedData = req.body;

    const updatedContact = await updateContact(contactId, updatedData);

    res.status(200).json({
      status: 200,
      message: `Successfully updated contact with ID ${contactId}`,
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const upsertContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body, { upsert: true });

    const status = result.isNew ? 201 : 200;
    res.status(status).json({
      status,
      message: `Successfully upserted a contact!`,
      data: result.contact,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await deleteContact(contactId);

    if (!deletedContact) {
      return next(createHttpError(404, `Contact with id ${contactId} was not found`));
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    next(error);
  }
};