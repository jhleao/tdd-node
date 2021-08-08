import request from 'supertest';
import app from '@src/app';

describe('Validation', () => {
  it('should return RFC error when receiving invalid JSON format', async () => {
    const response = await request(app)
      .post('/auth/login')
      .set({ 'Content-Type': 'application/json' })
      .send(`{
        "email": test@ndo.tudo,
        password: 'senha',
      }`);

    expect(response.status).toBe(400);
    expect(response.body.title).toBe('Invalid JSON format.');
  });
});
