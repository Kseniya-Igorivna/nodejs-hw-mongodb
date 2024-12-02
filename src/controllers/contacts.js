import createHttpError from 'http-errors';
import { sortByList  } from '../db/models/contacts.js'
import {
  getContactById,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams, parseSortParams,parseContactFilterParams } from '../utils/parseContactParams.js';
import { ContactsCollection as Contact } from '../models/contact.js';

export const getContactsController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
    const filter = parseContactFilterParams(req.query);

    const searchCriteria = { ...filter, userId };

    const contacts = await Contact.find(searchCriteria)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalContacts = await Contact.countDocuments(searchCriteria);

    res.status(200).json({
      status: 'success',
      message: 'Successfully found contacts!',
      data: {
        contacts,
        total: totalContacts,
        page,
        perPage,
        totalPages: Math.ceil(totalContacts / perPage),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    next(createHttpError(404, `Contact with id ${contactId} was not found`));
    return;
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user; 
    const newContact = await Contact.create({
      ...req.body,
      userId,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const updatedContact = await updateContact(contactId, req.body);
    if (!updatedContact) {
      return next(createHttpError(404, `Contact with id ${contactId} was not found`));
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const upsertContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body, { upsert: true });
  if (!result) {
    next(createHttpError(404, `Contact with id ${contactId} was not found`));
    return;
  }
  const status = result.isNew ? 201 : 200;
  res.status(status).json({
    status,
    message: `Successfully upserted a contact!`,
    data: result.data,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);
  if (!contact) {
    next(createHttpError(404, `Contact with id ${contactId} was not found`));
    return;
  }
  res.status(204).send();
};