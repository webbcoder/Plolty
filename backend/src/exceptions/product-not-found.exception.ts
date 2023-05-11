import { NotFoundException } from '@nestjs/common';

/**
 * Defines an HTTP exception for *Product with id non found* type error.
 */
export class ProductNotFoundException extends NotFoundException {
    /**
     * @param id is product id
     *
     * @example
     * throw new ProductNotFoundException(id)
     *
     * @usageNotes
     * The HTTP response status code will be 404
     */
    constructor(id: string) {
        super(`Product with id: '${id}' not found.`);
    }
}