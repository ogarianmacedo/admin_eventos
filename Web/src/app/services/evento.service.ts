import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/Evento';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  baseUrl = environment.api_url + 'evento';

  constructor(private http: HttpClient) { }

  /**
   * Busca todos os eventos
   */
  getAllEvento(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseUrl);
  }

  /**
   * Busca evento por tema
   */
  getEventoByTema(tema: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/getEventoByTema${tema}`);
  }

  /**
   * Busca evento por id
   */
  getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseUrl}/getEventoById/${id}`);
  }

  /**
   * Cadastrar novo evento
   */
  createEvento(evento: Evento) {
    return this.http.post(this.baseUrl, evento);
  }

  /**
   * Edita evento selecionado
   */
  editEvento(evento: Evento) {
    return this.http.put(`${this.baseUrl}/${evento.id}`, evento);
  }

  /**
   * Exclui evento selecionado
   */
  deleteEvento(id: number) {
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
