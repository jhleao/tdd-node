import { Middleware } from '@src/@types/ExpressFns';
import { notLoggedIn, invalidToken } from '@utils/problems';
import jwt from 'jsonwebtoken';

const authOnly: Middleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return notLoggedIn.send(res);

  const [, token] = authHeader.split(' ');

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    req.userId = id;
    return next();
  } catch (e) {
    return invalidToken.send(res);
  }
};

export default authOnly;
