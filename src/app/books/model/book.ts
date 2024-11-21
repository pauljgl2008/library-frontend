// Interface para representar un libro
export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  status: string;
  publication_date: string;  // Podría ser Date, dependiendo de cómo quieras manejarlo en tu código
}

// Interface para representar los parámetros de paginación
export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

// Interface para la respuesta principal que incluye los libros y la paginación
export interface PaginatedBooksResponse {
  content: Book[];           // Array de libros
  pageable: Pageable;        // Paginación
  last: boolean;             // Si es la última página
  totalPages: number;        // Total de páginas
  totalElements: number;     // Total de elementos (libros)
  size: number;              // Tamaño de la página
  number: number;            // Número de la página actual
  sort: Sort;                // Información de orden
  first: boolean;            // Si es la primera página
  numberOfElements: number;  // Número de elementos en la página actual
  empty: boolean;            // Si no hay elementos
}
