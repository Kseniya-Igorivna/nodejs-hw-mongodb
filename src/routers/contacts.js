import { Router } from 'express';
import {
  getContactByIdController,
  getContactsController,
  createContactController,
  patchContactController,
  upsertContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { contactSchema} from '../db/models/validationSchemas.js';
import { authenticate } from '../middlewares/authenticate.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';

const router = Router();

router.use(authenticate);

router.get('/contacts', ctrlWrapper(getContactsController));
router.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.post('/contacts', validateBody(contactSchema), ctrlWrapper(createContactController));
router.patch(
  '/contacts/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController)
);
router.put('/contacts/:contactId', isValidId, validateBody(createContactSchema), ctrlWrapper(upsertContactController));
router.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactController));
export default router;
