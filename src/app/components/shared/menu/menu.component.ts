import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { Component, EventEmitter, Output } from '@angular/core';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-menu',
  imports: [
    ToastModule,
    Menubar
  ],
  template: `
    <div class="card">
      <p-menubar [model]="items"></p-menubar>
    </div>
  `
})
export class MenuComponent {
  @Output() inicioEvent = new EventEmitter();
  @Output() notaEvent = new EventEmitter();
  @Output() produtoEvent = new EventEmitter();

  items: MenuItem[] = [
    {
      label: 'Início',
      icon: 'pi pi-fw pi-home',
      command: (event: MenuItemCommandEvent) => this.inicioEvent.emit()
    },
    {
      label: 'Notas',
      icon: 'pi pi-fw pi-file',
      command: (event: MenuItemCommandEvent) => this.notaEvent.emit()
    },
    {
      label: 'Produtos',
      icon: 'pi pi-fw pi-cart-plus',
      command: (event: MenuItemCommandEvent) => this.produtoEvent.emit()
    }
  ];

  executeCommand(item: MenuItem, mouseEvent: MouseEvent) {
    if (item.command) {
      item.command({
        originalEvent: mouseEvent,
        item: item,
      });
    }
  }
}
