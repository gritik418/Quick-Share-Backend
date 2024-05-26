import vine from "@vinejs/vine";
const LoginSchema = vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(32),
});
export default LoginSchema;
//# sourceMappingURL=loginSchema.js.map