import vine from "@vinejs/vine";
import { Infer } from "@vinejs/vine/types";

const LoginSchema = vine.object({
  email: vine.string(),
  password: vine.string().minLength(8).maxLength(32).confirmed(),
});

export type LoginSchemaType = Infer<typeof LoginSchema>;

export default LoginSchema;