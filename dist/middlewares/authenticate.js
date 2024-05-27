import jwt from "jsonwebtoken";
const authenticate = (req, res, next) => {
    try {
        const authToken = req.cookies.token;
        if (!authToken) {
            throw new Error("Authentication failed.");
        }
        const verify = jwt.verify(authToken, process.env.JWT_SECRET);
        if (!verify) {
            throw new Error("Authentication failed.");
        }
        req.params.id = verify.id;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            status: 400,
            message: "Please Login.",
        });
    }
};
export default authenticate;
//# sourceMappingURL=authenticate.js.map