import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/session.js';
import { UsersCollection as User } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  console.log('Authorization header:', authHeader);

  if (!authHeader.startsWith('Bearer ')) {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(createHttpError(401, 'Token not provided'));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const session = await SessionCollection.findOne({ accessToken: token });
    if (!session) {
      return next(createHttpError(401, 'Session not found'));
    }
    const isAccessTokenExpired = new Date() > new Date(session.accessTokenValidUntil);
    if (isAccessTokenExpired) {
      return next(createHttpError(401, 'Access token expired'));
    }

    const user = await User.findById(payload.id || session.userId);

    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return next(createHttpError(401, 'Invalid token or authorization failed'));
  }
};