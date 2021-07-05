import { IncomingMessage } from 'http';
import getRawBody from 'raw-body';
import { decodeUrlToParams } from './url.helper';

export const getParsedBody = async <TBody>(
  req: IncomingMessage
): Promise<TBody> => {
  const bodyBuffer = await getRawBody(req);

  try {
    return JSON.parse(bodyBuffer.toString('utf-8'));
  } catch {
    return decodeUrlToParams(bodyBuffer.toString('utf-8')) as TBody;
  }
};
