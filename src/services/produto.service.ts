import { environment } from '../environments/environnment';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../types/produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = `${environment.produtoUrlApi}`;

  get defaultHttpOptions() {
    return {
      headers: new HttpHeaders({"Content-Type": "application/json"}),
      responseType: 'json' as 'json'
    };
  }

  private readonly _httpClient = inject(HttpClient);

  getProduto(id: number): Observable<Produto> {
    return this._httpClient.get<Produto>(`${this.apiUrl}/Produto/${id}`, this.defaultHttpOptions);
  }

  getProdutos(): Observable<Produto[]> {
    return this._httpClient.get<Produto[]>(`${this.apiUrl}/Produto`, this.defaultHttpOptions);
  }

  createProduto(produto: any): Observable<Produto> {
    return this._httpClient.post<Produto>(`${this.apiUrl}/Produto`, produto, this.defaultHttpOptions);
  }

  patchProduto(id: number, produto: any): Observable<Produto> {
    return this._httpClient.patch<Produto>(`${this.apiUrl}/Produto/${id}`, produto, this.defaultHttpOptions);
  }

  deleteProduto(id: number): Observable<boolean> {
    return this._httpClient.delete<boolean>(`${this.apiUrl}/Produto/${id}`, this.defaultHttpOptions);
  }
}
