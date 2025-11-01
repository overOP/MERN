import { Request, Response, NextFunction, RequestHandler } from "express";

const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err:Error) => {
      return res.status(500).json({ 
        message: "Something went wrong",
        error: err.message
      });
    });
  };
};

export default catchAsync;
