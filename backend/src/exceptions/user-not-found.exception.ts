import { NotFoundException } from '@nestjs/common';

/**
 * Defines an HTTP exception for *User with id non found* type error.
 */
export class UserNotFoundException extends NotFoundException {
    /**
     * @param id is user id
     *
     * @example
     * throw new UserNotFoundException(id)
     *
     * @usageNotes
     * The HTTP response status code will be 404
     */
    constructor(id) {
        super(`User with id: '${id}' not found.`);
    }
}