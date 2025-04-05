import { Routes } from '@angular/router';
import { NotaComponent } from './components/nota/nota.component';
import { ProdutoComponent } from './components/produto/produto.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { NaoEncontradoComponent } from './components/nao-encontrado/nao-encontrado.component';

export const routes: Routes = [
  {
    path: '',
    component: InicioComponent
  },
  {
    path: 'nota',
    component: NotaComponent
  },
  {
    path: 'produto',
    component: ProdutoComponent
  },
  {
    path: '**',
    component: NaoEncontradoComponent
  },
];
