export class BookResponseDto {
  id: number;
  title: string;
  author: number;
  isbn: string;
  publicationDate: string;
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
