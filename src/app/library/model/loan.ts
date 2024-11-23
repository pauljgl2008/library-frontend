import { BookResponseDto } from './book-response-dto';

export interface LoanResponseDto {
  id: number;
  loanDate: string;
  returnDate: string;
  status: string;
  book: BookResponseDto;
}
