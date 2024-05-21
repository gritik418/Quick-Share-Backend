import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        minLength: 3,
        trim: true,
    },
    last_name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    email_verified: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        minLength: 8,
    },
}, { timestamps: true });
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
//# sourceMappingURL=userModel.js.map