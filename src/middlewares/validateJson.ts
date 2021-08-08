import { ErrorHandler } from '@src/@types/ExpressFns';
import { invalidJson } from '@utils/problems';

const validateJson: ErrorHandler = (err, req, res, next) => {
  const isInvalidJsonErr = err instanceof SyntaxError && err.status === 400 && 'body' in err;
  if (isInvalidJsonErr) return invalidJson.send(res);
  return next();
};

export default validateJson;
