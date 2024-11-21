// src/app/models/author-response.dto.ts
export interface Author {
  id: number;
  name: string;
  nationality: string;
  birthDate: string;  // Utilizando string para representar la fecha en formato ISO
}
