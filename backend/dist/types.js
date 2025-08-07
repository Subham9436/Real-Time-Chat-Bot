import z from "zod";
export const UserCheck = z.object({
    username: z.email(),
    password: z.string().min(6),
    fname: z.string(),
    lname: z.string(),
});
//# sourceMappingURL=types.js.map