import { Controller } from '@src/@types/ExpressFns';
import { User } from '@src/models/User';
import { invalidPassword, invalidToken, usernameNotFound } from '@src/utils/problems';
import jwt from 'jsonwebtoken';

export const login: Controller = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  if (!user) return usernameNotFound.send(res);
  if (!(await user.comparePassword(password))) return invalidPassword.send(res);

  const token = user.generateToken();
  const refreshToken = user.generateRefreshToken();

  const expiresIn = process.env.JWT_EXPIRY;

  res.cookie('refreshToken', refreshToken);
  return res.status(200).json({ token, expiresIn, user: user.get() });
};

export const register: Controller = async (req, res) => {
  const { username, email, password } = req.body;

  const user = new User();
  user.setUsername(username);
  user.setEmail(email);
  user.setPassword(password);
  await user.save();

  const token = user.generateToken();
  const refreshToken = user.generateRefreshToken();

  const expiresIn = process.env.JWT_EXPIRY;

  res.cookie('refreshToken', refreshToken);
  return res.status(200).json({ token, expiresIn, user: user.get() });
};

export const refresh: Controller = async (req, res) => {
  const { refreshToken } = req.cookies;

  try {
    const { id: userId } = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
    ) as { id: string };
    const user = await User.findOne({ where: { id: userId } });
    const token = user.generateToken();
    const expiresIn = process.env.JWT_EXPIRY;
  
    return res.status(200).json({ token, expiresIn, user: user.get() });
  } catch {
    return invalidToken.send(res);
  }
};

export const logout: Controller = async (req, res) => {
  res.cookie('refreshToken', '', { maxAge: 0 });
  return res.sendStatus(200);
};
