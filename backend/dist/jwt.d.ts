import { Response } from "express";
import { MyJwtPayload } from "./jwtpayload";
export declare function SignJWT(username: string, id: number, res: Response): null | undefined;
export declare function Verify(token: string): boolean;
export declare function Decode(token: string): MyJwtPayload | null;
