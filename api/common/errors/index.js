/**
 * Custom Errors for use in the API. They can help clarify promise chains by catching specific
 * Errors.
 * @module common/errors
 */
import ExtendableError from 'es6-error';

/**
 * Custom error class for address lookup errors.
 */
class AddressLookupError extends ExtendableError {
}

/**
 * Custom error class for authentication errors.
 */
class AuthenticationError extends ExtendableError {
}

/**
 * Custom error class for validation errors.
 */
class ValidationError extends ExtendableError {
}

/**
 * Custom error class for unauthorized errors.
 */
class UnauthorizedError extends ExtendableError {
  /**
   * Custom constructor that stores the unauthorized user in the object.
   * @param {string} user Unauthorized user
   */
  constructor(user) {
    super(`${user}`);
    this.user = user;
  }
}

/**
 * Custom error class for verification errors.
 */
class VerificationError extends ExtendableError {
}

/**
 * Custom error class for weekly notification errors.
 */
class WeeklyNotificationError extends ExtendableError {
}

export {
  AddressLookupError,
  AuthenticationError,
  UnauthorizedError,
  ValidationError,
  VerificationError,
  WeeklyNotificationError,
};
