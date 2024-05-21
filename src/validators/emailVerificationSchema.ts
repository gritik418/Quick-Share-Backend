import vine from "@vinejs/vine";
import { Infer } from "@vinejs/vine/types";

const EmailVerificationSchema = vine.object({
  email: vine.string(),
  secretKey: vine.string().minLength(6).maxLength(6),
});

export type EmailVerificationType = Infer<typeof EmailVerificationSchema>;

export default EmailVerificationSchema;
