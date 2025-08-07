import z from "zod";
export declare const UserCheck: z.ZodObject<{
    username: z.ZodEmail;
    password: z.ZodString;
    fname: z.ZodString;
    lname: z.ZodString;
}, z.z.core.$strip>;
//# sourceMappingURL=types.d.ts.map