import jwt from "jsonwebtoken";
const JWTPass = process.env.JWTPASS || "";
export function SignJwt(username, id, res) {
    try {
        const isemailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!isemailRegex.test(username)) {
            return null;
        }
        const payload = { username, id };
        const token = jwt.sign(payload, JWTPass, { expiresIn: "7d" });
        res.cookie("Bearer", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
        });
    }
    catch (err) {
        console.log("Error generating token", err);
        res.status(500).json("Internal server error");
    }
}
export function Verify(token) {
    try {
        jwt.verify(token, JWTPass);
        return true;
    }
    catch (err) {
        console.log("Error verifying token", err);
        throw err;
    }
}
export function Decode(token) {
    try {
        const decode = jwt.decode(token);
        if (!decode || typeof decode === "string") {
            return null;
        }
        return decode;
    }
    catch (err) {
        console.log("Error decoding token", err);
        throw err;
    }
}
//# sourceMappingURL=jwt.js.map