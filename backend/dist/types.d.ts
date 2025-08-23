import z from "zod";
export declare const UserCheck: z.ZodObject<{
    username: z.ZodEmail;
    password: z.ZodString;
    fname: z.ZodString;
    lname: z.ZodString;
}, z.core.$strip>;
export declare const MessageCheck: z.ZodObject<{
    text: z.ZodString;
}, z.core.$strip>;
