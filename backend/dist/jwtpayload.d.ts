import type { JwtPayload } from "jsonwebtoken";
export interface MyJwtPayload extends JwtPayload {
    username: string;
    id?: number;
}
//# sourceMappingURL=jwtpayload.d.ts.map