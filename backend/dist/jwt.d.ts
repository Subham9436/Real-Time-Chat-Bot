import type { Response } from "express";
import type { MyJwtPayload } from "./jwtpayload.js";
export declare function SignJwt(username: string, id: number, res: Response): null | undefined;
export declare function Verify(token: string): boolean;
export declare function Decode(token: string): MyJwtPayload | null;
//# sourceMappingURL=jwt.d.ts.map