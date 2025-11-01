import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import User from "../database/models/userModel";
 
export interface AuthRequest extends Request {
    user?: {
        username: string,
        email: string,
        password: string,
        role: string,
        id: string
    }
}

// enum role
export enum Role {
    Customer = "customer",
    Admin = "admin"
}

class Auth{
    // check if user is authenticated
   async isAuthenticated(req: AuthRequest, res: Response, next: NextFunction) : Promise<void> {
    //  get token 
    const token = req.headers.authorization
    if(!token || token === undefined) {
        res.status(403).json({
            message: "token not found"
        })
        return
    }
    //  verify token
    jwt.verify(token, process.env.JWT_SECRET as string, async (err, decoded: any) => {
        if(err) {
            res.status(403).json({
                message: "token not valid"
            })
            return
        } else {
            // check if that user exist
            try {
                const userData =  await User.findByPk(decoded.id)
                if(!userData) {
                    res.status(404).json({
                        message: "user not found"
                    })
                    return
                }
                req.user = userData
                next()
            } catch (error) {
                res.status(500).json({
                    message: "something went wrong"
                })
            }
        }
    })
   }
   // restictTo
   restrictTo(...roles: Role[]) {
    return(req: AuthRequest, res: Response, next: NextFunction) => {
        let userRole = req.user?.role as Role;
        if(!roles.includes(userRole)){
            res.status(403).json({
                message: "You do not have permission to perform this action"
            })
        }else{
            next()
        }
    }
   }
}

const auth = new Auth()
export default auth