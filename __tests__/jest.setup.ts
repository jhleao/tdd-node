import connection from '@tests/connection';

beforeAll(async () => {
  await connection.create();
});

beforeEach(async () => {
  await connection.clear();
});

afterAll(async () => {
  await connection.close();
});
