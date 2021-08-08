import { Controller } from '@src/@types/ExpressFns';
import { User } from '@src/models/User';

export const getProfile: Controller = async (req, res) => {
  const { userId } = req;
  const profile = await User.findOne({ where: { id: userId } }).then((u) => u.get());
  return res.status(200).json(profile);
};
