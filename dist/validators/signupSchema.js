import vine from "@vinejs/vine";
const SignupSchema = vine.object({
    first_name: vine.string().minLength(3),
    last_name: vine.string(),
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(32).confirmed(),
});
export default SignupSchema;
//# sourceMappingURL=signupSchema.js.map