import jwt from "jsonwebtoken";

export function authenticateUser(req, res, next) {
    try {
        const authHeader = req.headers["authorization"]; // lowercase!

        if (!authHeader) {
            return res.status(401).json({ error: "No token provided" });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Invalid token format" });
        }

        const token = authHeader.split(" ")[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        if (!payload) {
            return res.status(401).json({ error: "Token verification failed" });
        }

        req.user = payload;
        return next(); 
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized: " + err.message });
    }
}
