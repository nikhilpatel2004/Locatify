class ExpressError extends Error {
    // Keep construction convenient: (message, statusCode)
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;