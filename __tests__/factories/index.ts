import { UserFactoryData } from '@src/@types/User';
import { User } from '@src/models/User';
import faker from 'faker';

export const user = (p?: UserFactoryData) => new User(
    p?.username ?? faker.name.findName(),
    p?.email ?? faker.internet.email(),
    p?.password ?? faker.internet.password(),
);
