const handleHttpError = require("../utils/handleError");

const checkRol = (roles) => (req, res, next) => {
    try {
        const { user } = req;
        const userRol = user.rol;
        const checkValueRol = roles.some(rol => userRol.includes(rol)); // Check if at least one of the user roles is in the roles
        if (!checkValueRol) {
            handleHttpError(res, "NOT_ALLOWED", 403);
            return;
        }
        next();
    } catch (err) {
        handleHttpError(res, "ERROR_PERMISSIONS", 403);
    }
};


module.exports = { checkRol };
