class GenericError extends Error {
    constructor(error) {
        super(error);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

exports.UnauthorizedError = class UnauthorizedError extends GenericError {};
exports.InsufficientRoleError = class InsufficientRoleError extends GenericError {};
