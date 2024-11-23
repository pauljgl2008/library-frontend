export class BookRequestDto {
  id: number;
  title: string;
  author: number;
  isbn: string;
  publicationDate: string; // Usamos string porque es más fácil de manejar en JSON
  status: string;

  constructor(
    id: number,
    title: string,
    author: number,
    isbn: string,
    publicationDate: string,
    status: string
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.publicationDate = publicationDate;
    this.status = status;
  }
}
