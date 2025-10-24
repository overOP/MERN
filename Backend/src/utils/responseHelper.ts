import { Response } from "express";

export const sendErrorResponse = (
  res: Response,
  massage: string,
  statusCode: number
) => {
  return res.status(statusCode).json({ message: massage });
};

export const sendSuccessResponse = (
  res: Response,
  massage: string,
  data: any,
  statusCode: number
) => {
  return res.status(statusCode).json({  message: massage, data });
};
