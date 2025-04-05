import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Component, OnInit } from '@angular/core';
import { NotaService } from '../../../services/nota.service';
import { ItemNota, Nota } from '../../../types/nota';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ProdutoService } from '../../../services/produto.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ItemNotaComponent } from './item-nota/item-nota.component';
import { Produto } from '../../../types/produto';

@Component({
  selector: 'app-nota',
  imports: [
    Tag,
    TableModule,
    ButtonModule,
    ProgressSpinner,
    CommonModule,
    InputNumberModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    ItemNotaComponent,
  ],
  template: `
    <div class="card">
      <div class="flex justify-start items-center gap-3 p-2">
        <button
          pButton
          pRipple
          icon="pi pi-pencil"
          label="Criar Nota"
          class="p-button-primary"
          (click)="mostraDialogoCriaNota()"
        ></button>
        <button
          pButton
          pRipple
          icon="pi pi-spinner"
          label="Recarregar Notas"
          class="p-button-warn"
          (click)="carregaNotas()"
        ></button>
      </div>

      <div
        class="flex justify-center items-center"
        *ngIf="carregandoNotas; else tabela_notas"
      >
        <p-progressSpinner
          styleClass="w-16 h-16"
          strokeWidth="4"
          fill="var(--surface-ground)"
          animationDuration=".5s"
        ></p-progressSpinner>
      </div>

      <ng-template #tabela_notas>
        <p-table [value]="notas" dataKey="id" [expandedRowKeys]="expandedRows">
          <ng-template #header>
            <tr>
              <th></th>
              <th>Id</th>
              <th>Status</th>
              <th></th>
            </tr>
          </ng-template>
          <ng-template #body let-nota let-expanded="expanded">
            <tr>
              <td>
                <p-button
                  type="button"
                  pRipple
                  [pRowToggler]="nota"
                  [text]="true"
                  [rounded]="true"
                  [plain]="true"
                  [icon]="
                    expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'
                  "
                />
              </td>
              <td>{{ nota.id }}</td>
              <td>
                <p-tag
                  [value]="pegaStatusNome(nota.status)"
                  [severity]="pegaStatusSeverity(nota.status)"
                />
              </td>
              <td class="text-center">
                <div class="flex justify-center space-x-2">
                  <button
                    *ngIf="nota.status === 1"
                    pButton
                    pRipple
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-warning p-button-sm"
                    (click)="mostraDialogoEditaNota(nota)"
                    pTooltip="Editar"
                  ></button>
                  <button
                    *ngIf="nota.status === 1"
                    pButton
                    pRipple
                    icon="pi pi-print"
                    class="p-button-rounded p-button-success p-button-sm"
                    (click)="mostraDialogoImprimirNota(nota)"
                    pTooltip="Imprimir nota"
                  ></button>
                  <button
                    *ngIf="nota.status === 1"
                    pButton
                    pRipple
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-danger p-button-sm"
                    (click)="mostraDialogoDeletaNota(nota)"
                    pTooltip="Excluir"
                  ></button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template #expandedrow let-nota>
            <tr>
              <td colspan="4">
                <div class="px-4">
                  <p-table [value]="nota.produtos" dataKey="id">
                    <ng-template #header>
                      <tr>
                        <th>Id</th>
                        <th>Produto</th>
                        <th>Quantidade</th>
                      </tr>
                    </ng-template>
                    <ng-template #body let-nota>
                      <tr>
                        <td>{{ nota.id }}</td>
                        <td>{{ pegaProduto(nota.produtoId) }}</td>
                        <td>{{ nota.quantidade }}</td>
                      </tr>
                    </ng-template>
                    <ng-template #emptymessage>
                      <tr>
                        <td colspan="4">
                          Não foi encontrado notas para essa nota.
                        </td>
                      </tr>
                    </ng-template>
                  </p-table>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </ng-template>
    </div>

    <p-dialog
      [(visible)]="visivelDialogoNota"
      [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }"
      [style]="{ width: '50vw' }"
      [draggable]="false"
      [resizable]="false"
      [header]="editandoNota ? 'Editar Nota' : 'Novo Nota'"
      [modal]="true"
      styleClass="p-fluid"
      [dismissableMask]="true"
      (onHide)="escondeDialogoNota()"
    >
      <ng-template pTemplate="content">
        <form [formGroup]="notaForm" class="p-fluid" autocomplete="off">
          <input type="hidden" formControlName="id" />
          <input type="hidden" formControlName="status" />

          <app-item-nota
            [notaForm]="notaForm"
            [produtos]="produtos"
            [produtosSelect]="produtosSelect"
            (adicionarProdutoEvent)="produtos.push($event)"
            (removerProdutoEvent)="produtos.removeAt($event)"
          >
          </app-item-nota>
        </form>
      </ng-template>

      <ng-template pTemplate="footer">
        <button
          pButton
          pRipple
          label="Cancelar"
          icon="pi pi-times"
          class="p-button-text p-button-secondary"
          (click)="escondeDialogoNota()"
        ></button>
        <button
          pButton
          pRipple
          label="Salvar"
          icon="pi pi-check"
          class="p-button-primary"
          [disabled]="notaForm.invalid"
          (click)="salvaNota()"
        ></button>
      </ng-template>
    </p-dialog>
  `,
  providers: [NotaService],
})
export class NotaComponent implements OnInit {
  expandedRows = {};

  carregandoNotas: boolean = false;
  visivelDialogoNota: boolean = false;
  editandoNota: boolean = false;

  notas: Nota[] = [];
  produtosSelect: Produto[] = [];

  notaForm: FormGroup;

  constructor(
    private notaService: NotaService,
    private produtoService: ProdutoService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.notaForm = this.formBuilder.group({
      id: [null],
      status: [1],
      produtos: this.formBuilder.array([]),
    });
  }

  ngOnInit() {
    this.carregaProdutos();
    this.carregaNotas();
  }


  get produtos(): FormArray {
    return this.notaForm.get('produtos') as FormArray;
  }

  carregaNotas() {
    this.carregandoNotas = true;
    this.notaService.getNotas()
    .subscribe((notas: Nota[]) => {
      this.notas = notas;
      this.carregandoNotas = false;
    });
  }

  carregaProdutos() {
    this.produtoService.getProdutos()
    .subscribe((produtos: Produto[]) => {
      this.produtosSelect = produtos;
    });
  }

  mostraDialogoCriaNota() {
    this.visivelDialogoNota = true;
    this.editandoNota = false;
  }

  mostraDialogoEditaNota(nota: Nota) {
    this.visivelDialogoNota = true;
    this.editandoNota = true;
    this.notaForm.patchValue(nota);

    nota.produtos?.forEach((item: ItemNota) => {
      const produto = this.formBuilder.group({
        produtoId: [item.produtoId, Validators.required],
        quantidade: [item.quantidade, Validators.required]
      });
      this.produtos.push(produto);
    });
  }

  escondeDialogoNota() {
    this.visivelDialogoNota = false;
    this.editandoNota = false;
    this.produtos.clear();
    this.notaForm.reset();
  }

  mostraDialogoDeletaNota(nota: Nota) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir a nota ${nota.id}?`,
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deletaNota(nota);
      },
    });
  }

  mostraDialogoImprimirNota(nota: Nota) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja imprimir a nota ${nota.id}?`,
      header: 'Confirmar finalização',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.imprimirNota(nota);
      },
    });
  }

  salvaNota() {
    if (this.notaForm.valid) {
      this.notaForm.patchValue({'status': 1});
      const nota: Nota = this.notaForm.value;
      if (this.editandoNota) {
        this.notaService.patchNota(Number(nota.id), nota)
        .subscribe(() => {
          this.carregaNotas();
          this.escondeDialogoNota();
          this.notaForm.reset();
          this.produtos.clear();
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: 'Nota atualizado com sucesso!',
          });
        });
      } else {
        this.notaService.createNota(nota)
        .subscribe(() => {
          this.carregaNotas();
          this.escondeDialogoNota();
          this.notaForm.reset();
          this.produtos.clear();
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: 'Nota cadastrado com sucesso!',
          });
        });
      }
    }
  }

  deletaNota(nota: Nota) {
    this.notaService.deleteNota(Number(nota.id))
    .subscribe(() => {
      this.carregaNotas();
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso!',
        detail: 'Nota deletado com sucesso!',
      });
    });
  }

  imprimirNota(nota: Nota) {
    this.notaService.printNota(Number(nota.id)).subscribe(() => {
      this.carregaNotas();
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso!',
        detail: 'Nota está gerando a impressão com sucesso!',
      });
    });
  }

  pegaProduto(produtoId: string) {
    const produto = this.produtosSelect.find((p) => p.id === produtoId);
    if (produto) {
      return `${produto.id} - ${produto.nome}`;
    }
    return '';
  }

  pegaStatusNome(status: number) {
    switch (status) {
      case 1:
        return 'Aberta';
      case 2:
        return 'Fechada (Processando)';
      case 3:
        return 'Aprovada';
      case 4:
        return 'Rejeitada';
    }

    return '';
  }

  pegaStatusSeverity(status: number) {
    switch (status) {
      case 1:
        return 'info';
      case 2:
        return 'warn';
      case 3:
        return 'success';
      case 4:
        return 'danger';
    }

    return 'contrast';
  }
}
