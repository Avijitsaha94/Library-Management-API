import { Response } from 'express';

export const sendResponse = (
  res: Response,
  data: any,
  message = 'Success',
  statusCode = 200
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
