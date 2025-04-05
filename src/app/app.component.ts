import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuComponent } from "./components/shared/menu/menu.component";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MenuComponent,
    ConfirmDialogModule,
    Toast
  ],
  template: `
    <app-menu
      (inicioEvent)="inicioHandler()"
      (notaEvent)="notaHandler()"
      (produtoEvent)="produtoHandler()"
    ></app-menu>
    <router-outlet />
    <p-toast [breakpoints]="{ '920px': { width: '100%', right: '0', left: '0' } }" [baseZIndex]="5000" />
    <p-confirmDialog
      [style]="{ width: '450px' }"
      acceptLabel="Sim"
      rejectLabel="Não"
    ></p-confirmDialog>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Nota Fiscal';

  constructor(private router: Router) { }

  inicioHandler() {
    this.router.navigate(['/']);
  }
  notaHandler() {
    this.router.navigate(['/nota']);
  }
  produtoHandler() {
    this.router.navigate(['/produto']);
  }
}
