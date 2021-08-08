import request from 'supertest';
import app from '@src/app';
import * as create from '@tests/factories';
import { User } from '@src/models/User';

describe('Authentication', () => {
  it('should return 200 status when receiving valid credentials', async () => {
    const user = create.user({ username: 'Testao', password: 'senha' });
    await user.save();

    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'Testao',
        password: 'senha',
      });

    expect(response.status).toBe(200);
  });

  it('should return 401 status when receiving invalid username', async () => {
    const user = create.user({ username: 'Testao', password: 'senha' });
    await user.save();

    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'Testaooo',
        password: 'senhaaa',
      });

    expect(response.status).toBe(401);
  });

  it('should return 401 status when receiving valid username with invalid password', async () => {
    const user = create.user({ username: 'Testao', password: 'senha' });
    await user.save();

    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'Testao',
        password: 'senhaaa',
      });

    expect(response.status).toBe(401);
  });

  it('should return JWT, user data and token expiry when sent correct credentials', async () => {
    const user = create.user({ username: 'Testao', password: 'senha' });
    await user.save();

    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'Testao',
        password: 'senha',
      });

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('expiresIn');
  });

  it('should set refreshToken cookie when sent correct credentials', async () => {
    const user = create.user({ username: 'Testao', password: 'senha' });
    await user.save();

    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'Testao',
        password: 'senha',
      });

    expect(response.header['set-cookie'][0]).toBeTruthy();
  });

  it('should not return JWT when sent incorrect credentials', async () => {
    const user = create.user({ username: 'Testao', password: 'senha' });
    await user.save();

    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'Testao',
        password: 'senhaa',
      });

    expect(response.body).not.toHaveProperty('token');
  });

  it('should not set refreshToken cookie when sent incorrect credentials', async () => {
    const user = create.user({ username: 'Testao', password: 'senha' });
    await user.save();

    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'Testao',
        password: 'senhaa',
      });

    expect(response.header['set-cookie']).toBeFalsy();
  });

  it('should send a new JWT, user details and expiry when refreshing a valid token', async () => {
    const user = create.user({ username: 'Testao', password: 'senha' });
    await user.save();

    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'Testao',
        password: 'senha',
      });

    const cookieHeader = response.header['set-cookie'][0];

    expect(cookieHeader).toBeTruthy();

    const [, refreshToken] = cookieHeader.split('=');

    const response2 = await request(app)
      .post('/auth/refresh')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .send();

    expect(response2.body).toHaveProperty('token');
    expect(response2.body).toHaveProperty('user');
    expect(response2.body).toHaveProperty('expiresIn');
  });

  it('should be able to register user and return token, user data and token expiry', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'roberval',
        email: 'teste@email.com',
        password: 'senha',
      });

    const user = await User.findOne({ where: { email: 'teste@email.com' } });
  
    expect(user.getUsername()).toBe('roberval');
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.username).toBe('roberval');
    expect(response.body).toHaveProperty('expiresIn');
  });

  it('should be able to access protected routes when sent a valid JWT', async () => {
    const user = create.user({ username: 'Testao', password: 'senha' });
    await user.save();

    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'Testao',
        password: 'senha',
      });

    const { token } = response.body;

    const response2 = await request(app)
      .get('/profile')
      .set({ Authorization: `Bearer ${token}` })
      .send();

    expect(response2.status).toBe(200);
  });

  it('should not be able to access protected routes when not sent a JWT', async () => {
    const user = create.user({ username: 'Testao', password: 'senha' });
    await user.save();

    const response = await request(app)
      .get('/profile')
      .send();

    expect(response.status).toBe(401);
  });

  it('should not be able to access protected routes when sent a invalid JWT', async () => {
    const user = create.user({ username: 'Testao', password: 'senha' });
    await user.save();

    const response = await request(app)
      .get('/profile')
      .set({ Authorization: 'Bearer 123123' })
      .send();

    expect(response.status).toBe(401);
  });

  it('should return correct profile info when getting /profile', async () => {
    const user = create.user({ username: 'Testao', email: 'test@ndo.tudo', password: 'senha' });
    await user.save();

    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'Testao',
        password: 'senha',
      });

    const { token } = response.body;

    const response2 = await request(app)
      .get('/profile')
      .set({ Authorization: `Bearer ${token}` })
      .send();

    const profile = response2.body;

    expect(profile.username).toBe('Testao');
    expect(profile.email).toBe('test@ndo.tudo');
  });
});
