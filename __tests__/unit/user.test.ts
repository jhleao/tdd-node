import { User } from '@src/models/User';
import * as create from '@tests/factories';
import jwt from 'jsonwebtoken';

describe('User CRUD', () => {
  it('should create user with encrypted password', async () => {
    const user = create.user({ password: 'senha' });
    await user.save();
    expect(user.comparePassword('senha')).toBeTruthy();
  });

  it('should correctly change password', async () => {
    const user = create.user({ password: 'senha', username: 'Testivaldo' });
    await user.save();

    expect(user.comparePassword('senha')).toBeTruthy();

    const userv2 = await User.findOne({ where: { username: 'Testivaldo' } });
    userv2.setUsername('Testelt');
    userv2.setPassword('novasenha');
    await userv2.save();

    const userv3 = await User.findOne({ where: { username: 'Testelt' } });

    expect(userv3.comparePassword('novasenha')).toBeTruthy();
  });

  it('should delete user correctly', async () => {
    const user = create.user({ username: 'Testivaldo', email: 'test@ndo.com' });
    await user.save();

    const userv2 = await User.findOne({ where: { username: 'Testivaldo' } });
    expect(userv2.getEmail()).toEqual('test@ndo.com');

    await userv2.remove();

    const queryResults = await User.find({ where: { username: 'Testivaldo' } });
    expect(queryResults.length).toBe(0);
  });

  it('should properly generate jwt with the ID in the payload', async () => {
    const user = create.user();
    await user.save();

    const token = user.generateToken();

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET) as {id: string};
      expect(payload.id).toEqual(user.getId());
    } catch (e) {
      fail('The generated token is invalid.');
    }
  });

  it('should properly generate refresh jwt with the ID in the payload', async () => {
    const user = create.user();
    await user.save();

    const token = user.generateRefreshToken();

    try {
      const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET) as {id: string};
      expect(payload.id).toEqual(user.getId());
    } catch (e) {
      fail('The generated token is invalid.');
    }
  });

  it('should have all the getters and setters working', async () => {
    const username = 'Joao';
    const email = 'joao@email.com';
    const password = '12345';

    const user = create.user();
    user.setUsername(username);
    user.setEmail(email);
    user.setPassword(password);
    await user.save();

    const passwordEquals = await user.comparePassword(password);

    expect(passwordEquals).toBe(true);
    expect(user.getUsername()).toEqual(username);
    expect(user.getEmail()).toEqual(email);
    expect(user.getCreatedAt().getTime()).toEqual(user.getUpdatedAt().getTime());
    expect(user.getUpdatedAt().getTime()).toEqual(user.getCreatedAt().getTime());
  });
});
