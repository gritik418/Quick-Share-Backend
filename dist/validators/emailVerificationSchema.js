import vine from "@vinejs/vine";
const EmailVerificationSchema = vine.object({
    email: vine.string(),
    secretKey: vine.string().minLength(6).maxLength(6),
});
export default EmailVerificationSchema;
//# sourceMappingURL=emailVerificationSchema.js.map