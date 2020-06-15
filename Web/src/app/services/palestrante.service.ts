import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Palestrante } from '../models/Palestrante';

@Injectable({
  providedIn: 'root'
})
export class PalestranteService {

  baseUrl = 'http://localhost:5000/api/palestrante';

  constructor(private http: HttpClient) { }

  /**
   * Busca todos os palestrantes
   */
  getAllPalestrante(): Observable<Palestrante[]> {
    return this.http.get<Palestrante[]>(this.baseUrl);
  }

  /**
   * Busca palestrante por nome
   */
  getPalestranteByNome(nome: string): Observable<Palestrante[]> {
    return this.http.get<Palestrante[]>(`${this.baseUrl}/getPalestranteByNome/${nome}`);
  }

  /**
   * Busca palestrante por id
   */
  getPalestranteById(id: number): Observable<Palestrante> {
    return this.http.get<Palestrante>(`${this.baseUrl}/getPalestranteById/${id}`);
  }

  /**
   * Cadastrar novo palestrante
   */
  createPalestrante(palestrante: Palestrante) {
    return this.http.post(this.baseUrl, palestrante);
  }

  /**
   * Edita palestrante selecionado
   */
  editPalestrante(palestrante: Palestrante) {
    return this.http.put(`${this.baseUrl}/${palestrante.id}`, palestrante);
  }

  /**
   * Exclui palestrante selecionado
   */
  deletePalestrante(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Upload de imagem
   */
  upload(file: File, nomeImagem: string) {
    const fileToUpload = <File>file[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, nomeImagem);

    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

}
