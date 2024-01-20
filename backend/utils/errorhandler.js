class ErrorHandler extends Error {
    constructor(message, statusCode) {
      super(message); // Call the constructor of the parent class (Error)
      this.statusCode = statusCode; // Set the HTTP status code for the error
      
  
      // Capture the current stack trace
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = ErrorHandler;
  