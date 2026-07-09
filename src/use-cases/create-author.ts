import { Author } from "@/entities/author.entity";
import { AuthorRepository } from "@/repositories/author.repository";


export class CreateAuthorUseCase {
    constructor(private readonly authorRepository: AuthorRepository) { }

    async handler({ name, email }: Author): Promise<Author | undefined> {
        return this.authorRepository.create({ name, email });
    }
}

export class GetAuthorUseCase {
    constructor(private readonly authorRepository: AuthorRepository) { }

    async handler(): Promise<Author[]> {
        return this.authorRepository.getAuthors();
    }
}