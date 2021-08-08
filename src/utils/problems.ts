import Problem from 'api-problem';

export const emailNotFound = new Problem(401, 'Email not found.');
export const usernameNotFound = new Problem(401, 'Username not found.');
export const invalidPassword = new Problem(401, 'Invalid password.');
export const notLoggedIn = new Problem(401, 'Not logged in.');
export const invalidToken = new Problem(401, 'Invalid token.');
export const invalidJson = new Problem(400, 'Invalid JSON format.');
export const somethingWentWrong = new Problem(400, 'Something went wrong.');
