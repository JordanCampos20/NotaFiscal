import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Component, OnInit } from '@angular/core';
import { ProdutoService } from '../../../services/produto.service';
import { Produto } from '../../../types/produto';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-produto',
  imports: [
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
  ],
  template: `
    <div class="card">
      <div class="flex justify-start items-center gap-3 p-2">
        <button
          pButton
          pRipple
          icon="pi pi-pencil"
          label="Criar Produto"
          class="p-button-primary"
          (click)="mostraDialogoCriaProduto()"
        ></button>
        <button
          pButton
          pRipple
          icon="pi pi-spinner"
          label="Recarregar Produtos"
          class="p-button-warn"
          (click)="carregaProdutos()"
        ></button>
      </div>

      <div
        class="flex justify-center items-center"
        *ngIf="carregandoProdutos; else tabela_produtos"
      >
        <p-progressSpinner
          styleClass="w-16 h-16"
          strokeWidth="4"
          fill="var(--surface-ground)"
          animationDuration=".5s"
        ></p-progressSpinner>
      </div>

      <ng-template #tabela_produtos>
        <p-table [value]="produtos">
          <ng-template #header>
            <tr>
              <th>Id</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Saldo</th>
              <th>Descrição</th>
              <th></th>
            </tr>
          </ng-template>
          <ng-template #body let-produto>
            <tr>
              <td>{{ produto.id }}</td>
              <td>{{ produto.nome }}</td>
              <td>{{ produto.preco | currency : 'BRL' }}</td>
              <td>{{ produto.saldo }}</td>
              <td>{{ produto.descricao }}</td>
              <td class="text-center">
                <div class="flex justify-center space-x-2">
                  <button
                    pButton
                    pRipple
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-warning p-button-sm"
                    (click)="mostraDialogoEditaProduto(produto)"
                    pTooltip="Editar"
                  ></button>
                  <button
                    pButton
                    pRipple
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-danger p-button-sm"
                    (click)="mostraDialogoDeletaProduto(produto)"
                    pTooltip="Excluir"
                  ></button>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </ng-template>
    </div>

    <p-dialog
      [(visible)]="visivelDialogoProduto"
      [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }"
      [style]="{ width: '50vw' }"
      [draggable]="false"
      [resizable]="false"
      [header]="editandoProduto ? 'Editar Produto' : 'Novo Produto'"
      [modal]="true"
      styleClass="p-fluid"
      [dismissableMask]="true"
      (onHide)="escondeDialogoProduto()"
    >
      <ng-template pTemplate="content">
        <form [formGroup]="produtoForm" class="p-fluid" autocomplete="off">
          <input type="hidden" formControlName="id" />

          <div class="field mb-4">
            <label for="nome" class="text-sm font-medium block mb-1"
              >Nome</label
            >
            <input
              type="text"
              pInputText
              id="nome"
              formControlName="nome"
              placeholder="Nome do produto"
              class="w-full"
            />
            <small
              *ngIf="
                produtoForm.get('nome')?.errors?.['required'] &&
                produtoForm.get('nome')?.touched
              "
              class="text-red-500"
              >Nome é obrigatório</small
            >
          </div>

          <div class="field mb-4">
            <label for="preco" class="text-sm font-medium block mb-1"
              >Preço (R$)</label
            >
            <p-inputNumber
              mode="decimal"
              inputmode="decimal"
              id="preco"
              formControlName="preco"
              locale="pt-BR"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              placeholder="Ex: 150.00"
              class="w-full"
            />
            <small
              *ngIf="
                produtoForm.get('preco')?.errors?.['required'] &&
                produtoForm.get('preco')?.touched
              "
              class="text-red-500"
              >Preço é obrigatório e deve ser maior que zero</small
            >
          </div>

          <div class="field mb-4">
            <label for="saldo" class="text-sm font-medium block mb-1"
              >Saldo</label
            >
            <p-inputNumber
              mode="decimal"
              inputmode="decimal"
              id="saldo"
              formControlName="saldo"
              locale="pt-BR"
              [minFractionDigits]="0"
              [maxFractionDigits]="0"
              placeholder="Ex: 10"
              class="w-full"
            />
            <small
              *ngIf="
                produtoForm.get('saldo')?.errors?.['required'] &&
                produtoForm.get('saldo')?.touched
              "
              class="text-red-500"
              >Saldo é obrigatório e deve ser maior que zero</small
            >
          </div>

          <div class="field mb-4">
            <label for="descricao" class="text-sm font-medium block mb-1"
              >Descrição</label
            >
            <textarea
              pTextarea
              id="descricao"
              formControlName="descricao"
              rows="3"
              placeholder="Detalhes sobre este produto"
              class="w-full"
            ></textarea>
            <small
              *ngIf="
                produtoForm.get('descricao')?.errors?.['required'] &&
                produtoForm.get('descricao')?.touched
              "
              class="text-red-500"
              >Descrição é obrigatório</small
            >
          </div>
        </form>
      </ng-template>

      <ng-template pTemplate="footer">
        <button
          pButton
          pRipple
          label="Cancelar"
          icon="pi pi-times"
          class="p-button-text p-button-secondary"
          (click)="escondeDialogoProduto()"
        ></button>
        <button
          pButton
          pRipple
          label="Salvar"
          icon="pi pi-check"
          class="p-button-primary"
          [disabled]="produtoForm.invalid"
          (click)="salvaProduto()"
        ></button>
      </ng-template>
    </p-dialog>
  `,
  providers: [ProdutoService],
})
export class ProdutoComponent implements OnInit {
  carregandoProdutos: boolean = false;
  visivelDialogoProduto: boolean = false;
  editandoProduto: boolean = false;

  produtos: Produto[] = [];

  produtoForm: FormGroup;

  constructor(
    private produtoService: ProdutoService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.produtoForm = this.formBuilder.group({
      id: [null],
      nome: ['', [Validators.required]],
      preco: [null, [Validators.required]],
      saldo: [null, [Validators.required]],
      descricao: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.carregaProdutos();
  }

  carregaProdutos() {
    this.carregandoProdutos = true;
    this.produtoService.getProdutos()
    .subscribe((produtos: Produto[]) => {
      this.produtos = produtos;
      this.carregandoProdutos = false;
    });
  }

  mostraDialogoCriaProduto() {
    this.visivelDialogoProduto = true;
    this.editandoProduto = false;
  }

  mostraDialogoEditaProduto(produto: Produto) {
    this.visivelDialogoProduto = true;
    this.editandoProduto = true;
    this.produtoForm.patchValue(produto);
  }

  escondeDialogoProduto() {
    this.visivelDialogoProduto = false;
    this.editandoProduto = false;
    this.produtoForm.reset();
  }

  mostraDialogoDeletaProduto(produto: Produto) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o produto ${produto.nome}?`,
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deletaProduto(produto);
      },
    });
  }

  salvaProduto() {
    if (this.produtoForm.valid) {
      const produto: Produto = this.produtoForm.value;
      if (this.editandoProduto) {
        this.produtoService
          .patchProduto(Number(produto.id), produto)
          .subscribe(() => {
            this.carregaProdutos();
            this.escondeDialogoProduto();
            this.produtoForm.reset();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso!',
              detail: 'Produto atualizado com sucesso!',
            });
          });
      } else {
        this.produtoService.createProduto(produto)
        .subscribe(() => {
          this.carregaProdutos();
          this.escondeDialogoProduto();
          this.produtoForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: 'Produto cadastrado com sucesso!',
          });
        });
      }
    }
  }

  deletaProduto(produto: Produto) {
    this.produtoService.deleteProduto(Number(produto.id))
    .subscribe(() => {
      this.carregaProdutos();
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso!',
        detail: 'Produto deletado com sucesso!',
      });
    });
  }
}
