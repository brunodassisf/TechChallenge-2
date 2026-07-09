export class PostNotFoundError extends Error {
    constructor() {
        super("Post não encontrado");
        this.name = "PostNotFoundError";
    }
}
