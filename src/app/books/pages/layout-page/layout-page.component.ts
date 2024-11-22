import { Component } from "@angular/core";

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: []
})
export class LayoutPageComponent {

  public sidebarItems = [
    { label: 'Dashboard', icon: 'bi bi-house-door', url: './list' },
    { label: 'Libros', icon: 'bi bi-book', url: './list' },
    { label: 'Autores', icon: 'bi bi-person', url: './list' },
    { label: 'Préstamos', icon: 'bi bi-journal-bookmark', url: './list' },
    { label: 'Añadir', icon: 'bi bi-plus-circle', url: './new-book' },
    { label: 'Buscar', icon: 'bi bi-search', url: './search' },
  ];
  
  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.contains('d-none') 
        ? sidebar.classList.remove('d-none') 
        : sidebar.classList.add('d-none');
    }
  }

}
