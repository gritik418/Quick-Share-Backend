import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const VerificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    secretKey: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        expires: "10m",
    },
});
VerificationSchema.pre("save", async function (next) {
    if (this.isModified("secretKey")) {
        const salt = await bcrypt.genSalt(8);
        const hashedKey = await bcrypt.hash(this.secretKey, salt);
        this.secretKey = hashedKey;
    }
    next();
});
const Verification = mongoose.models.Verification ||
    mongoose.model("Verification", VerificationSchema);
export default Verification;
//# sourceMappingURL=verificationModel.js.map