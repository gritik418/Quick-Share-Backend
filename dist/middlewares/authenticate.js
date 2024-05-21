import jwt from "jsonwebtoken";
const authenticate = (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization;
        const authToken = bearerToken?.split(" ")[1];
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
        res.status(401).json({
            success: false,
            status: 400,
            message: "Please Login.",
        });
    }
};
export default authenticate;
//# sourceMappingURL=authenticate.js.map