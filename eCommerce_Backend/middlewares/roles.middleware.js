import ApiError from "../utils/ApiError.js";

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role || !allowedRoles.includes(req.user.role)) {
            return next(new ApiError(403, "Forbidden: You're not allowed to access this resource"));
        }
        next();
    };
};

export default authorizeRoles;
