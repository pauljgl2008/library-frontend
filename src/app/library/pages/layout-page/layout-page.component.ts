import { Component } from "@angular/core";

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html'
})
export class LayoutPageComponent {

  public sidebarItems = [
    { label: 'Dashboard', icon: 'bi bi-house-door', url: './dashboard' },
    { label: 'Libros', icon: 'bi bi-book', url: './books' },
    { label: 'Autores', icon: 'bi bi-person', url: './authors' },
    { label: 'Préstamos', icon: 'bi bi-journal-bookmark', url: './loans' }
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
