import { BookResponseDto } from './book-response-dto';

export interface Loan {
  id: number;
  loanDate: string;
  returnDate: string;
  status: string;
  book: BookResponseDto;
}
