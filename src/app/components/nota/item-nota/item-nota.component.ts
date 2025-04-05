import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { Produto } from '../../../../types/produto';

@Component({
  selector: 'app-item-nota',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputNumberModule,
    ButtonModule,
    SelectModule
  ],
  template: `
  <div class="flex justify-start items-center mb-4">
    <button
      pButton
      pRipple
      label="Adicionar"
      icon="pi pi-check"
      class="p-button-primary"
      (click)="adicionarProduto()"
    ></button>
  </div>

  <form [formGroup]="notaForm">
    <div formArrayName="produtos">
      <div *ngFor="let produto of produtos.controls; let i = index" [formGroupName]="i">
        <div class="field mb-4">
          <label for="produtoId-{{i}}" class="text-sm font-medium block mb-1"
            >Produto</label
          >
          <p-select
            [id]="'produtoId-' + i"
            formControlName="produtoId"
            [options]="produtosSelect"
            optionLabel="nome"
            optionValue="id"
            placeholder="Selecione um produto"
            appendTo="body"
            [showClear]="false"
            styleClass="w-full"
            >
          </p-select>
          <small
            *ngIf="
              produto.get('produtoId')?.errors?.['required'] &&
              produto.get('produtoId')?.touched
            "
            class="text-red-500"
            >Produto é obrigatório.</small
          >
        </div>
        <div class="field mb-4">
          <label for="quantidade-{{i}}" class="text-sm font-medium block mb-1"
            >Quantidade</label
          >
          <p-inputNumber
            mode="decimal"
            inputmode="decimal"
            [id]="'quantidade-' + i"
            formControlName="quantidade"
            locale="pt-BR"
            [minFractionDigits]="0"
            [maxFractionDigits]="0"
            placeholder="Ex: 10"
            class="w-full"
          />
          <small
            *ngIf="
              produto.get('quantidade')?.errors?.['required'] &&
              produto.get('quantidade')?.touched
            "
            class="text-red-500"
            >Quantidade é obrigatório e deve ser maior que zero</small
          >
        </div>
        <button
          pButton
          pRipple
          label="Remover"
          icon="pi pi-times"
          class="p-button-text p-button-secondary"
          (click)="removerProduto(i)"
        ></button>
      </div>
    </div>
  </form>
  `,
  providers: [],
})
export class ItemNotaComponent {
  @Input() notaForm!: FormGroup;
  @Input() produtos!: FormArray;
  @Input() produtosSelect: Produto[] = [];

  @Output() removerProdutoEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() adicionarProdutoEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder) {}

  adicionarProduto() {
    const produto: any = this.formBuilder.group({
      produtoId: ["", Validators.required],
      quantidade: ["", Validators.required]
    })

    this.adicionarProdutoEvent.emit(produto);
  }

  removerProduto(index: number) {
    this.removerProdutoEvent.emit(index);
  }
}
