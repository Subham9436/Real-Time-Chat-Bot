import z from "zod";

export const UserCheck = z.object({
  username: z.email(),
  password: z.string(),
  fname: z.string(),
  lname: z.string(),
});

 export const MessageCheck = z.object({
  text: z.string(),
});
