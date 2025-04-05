import { environment } from '../environments/environnment';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nota } from '../types/nota';

@Injectable({
  providedIn: 'root'
})
export class NotaService {
  private apiUrl = `${environment.notaUrlApi}`;

  get defaultHttpOptions() {
    return {
      headers: new HttpHeaders({"Content-Type": "application/json"}),
      responseType: 'json' as 'json'
    };
  }

  private readonly _httpClient = inject(HttpClient);

  getNota(id: number): Observable<Nota> {
    return this._httpClient.get<Nota>(`${this.apiUrl}/Nota/${id}`, this.defaultHttpOptions);
  }

  getNotas(): Observable<Nota[]> {
    return this._httpClient.get<Nota[]>(`${this.apiUrl}/Nota`, this.defaultHttpOptions);
  }

  createNota(nota: any): Observable<Nota> {
    return this._httpClient.post<Nota>(`${this.apiUrl}/Nota`, nota, this.defaultHttpOptions);
  }

  patchNota(id: number, nota: any): Observable<Nota> {
    return this._httpClient.patch<Nota>(`${this.apiUrl}/Nota/${id}`, nota, this.defaultHttpOptions);
  }

  deleteNota(id: number): Observable<boolean> {
    return this._httpClient.delete<boolean>(`${this.apiUrl}/Nota/${id}`, this.defaultHttpOptions);
  }

  printNota(id: number): Observable<boolean> {
    return this._httpClient.post<boolean>(`${this.apiUrl}/Nota/Imprimir/${id}`, this.defaultHttpOptions);
  }
}
