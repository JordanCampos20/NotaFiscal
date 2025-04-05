import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'app-nao-encontrado',
  imports: [
    ButtonDirective,
    RouterLink
  ],
  template: `
  <div class="card">
    <h2 class="text-2xl font-bold text-center mb-4">Página não encontrada</h2>
    <a pButton routerLink="/" label="Voltar" class="w-full p-button-primary"></a>
  </div>
  `
})
export class NaoEncontradoComponent {
}
