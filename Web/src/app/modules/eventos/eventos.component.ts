import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from 'src/app/services/evento.service';
import { Evento } from 'src/app/models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  titulo = "Eventos";

  evento: Evento;
  eventos: Evento[];
  eventosFiltrados: Evento[];
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = true;
  registerForm: FormGroup;
  modoSalvar = 'post';
  _filtroLista = '';
  bodyDeletarEvento = '';
  file: File;
  fileNameToUpdate: string;
  dataAtual: string;

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private localeService: BsLocaleService,
    private toastr: ToastrService) {
    this.localeService.use('pt-br');
  }

  get filtroLista(): string {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEvento(this.filtroLista) : this.eventos;
  }

  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  /**
   * Mostrar imagem na tabela de eventos
   */
  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  /**
   * Filtrar busca de eventos
   */
  filtrarEvento(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  /**
   * Busca e lista eventos
   */
  getEventos() {
    this.dataAtual = new Date().getMilliseconds().toString();
    
    this.eventoService.getAllEvento().subscribe(
      (resp: Evento[]) => {
        this.eventos = resp;
        this.eventosFiltrados = resp;
      }, error => {
        this.toastr.error('Erro ao carregar eventos!');
      }
    );
  }

  /**
   * Validação dos campos do formulário
   */
  validation() {
    this.registerForm = this.formBuilder.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(500)]],
      imagemUrl: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    })
  }

  /**
   * Abre modal formulário evento
   */
  openModal(template: any) {
    this.registerForm.reset();
    template.show();
  }

  /**
   * Abre modal para edição de evento
   */
  editarEvento(evento: Evento, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = Object.assign({}, evento);
    this.fileNameToUpdate = evento.imagemUrl.toString();
    this.evento.imagemUrl = '';
    this.registerForm.patchValue(this.evento);
  }

  /**
   * Abre modal para cadastro de evento
   */
  novoEvento(template: any) {
    this.modoSalvar = 'post';
    this.openModal(template);
  }
  
  /**
   * Salvar imagem
   */
  onFileChange(event) {
    const reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      this.file = event.target.files;
    }
  }

  /**
   * Upload da imagem
   */
  uploadImagem() {
    if (this.modoSalvar === 'post') { 
      const nomeImagem = this.evento.imagemUrl.split('\\', 3);
      this.evento.imagemUrl = nomeImagem[2];
  
      this.eventoService.upload(this.file, nomeImagem[2])
        .subscribe(
          () => {
            this.dataAtual = new Date().getMilliseconds().toString();
            this.getEventos();
          }
        );
    } else {
      this.evento.imagemUrl = this.fileNameToUpdate;
      this.eventoService.upload(this.file, this.fileNameToUpdate)
        .subscribe(
          () => {
            this.dataAtual = new Date().getMilliseconds().toString();
            this.getEventos();
          }
        );
    }
  }

  /**
   * Salva alterações de edição evento ou cadastra novo evento
   */
  salvarAlteracao(template: any) {
    if (this.registerForm.valid) {
      if (this.modoSalvar === 'post') {
        this.evento = Object.assign({}, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.createEvento(this.evento).subscribe(
          (resp: Evento) => {
            template.hide();
            this.getEventos();
            this.toastr.success('Evento cadastrado com sucesso!');
          }, error => {
            this.toastr.error('Erro ao cadastrar evento!');
          }
        );
      } else {
        this.evento = Object.assign({ id: this.evento.id }, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.editEvento(this.evento).subscribe(
          (resp: Evento) => {
            template.hide();
            this.getEventos();
            this.toastr.success('Evento editado com sucesso!');
          }, error => {
            this.toastr.error('Erro ao editar evento!');
          }
        );
      }
    }
  }

  /**
   * Abre modal para excluir evento
   */
  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Deseja excluir o Evento: ${evento.tema}, Código: #${evento.id}`;
  }

  /**
   * Confirmar exclusão de evento
   */
  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      (resp) => {
        template.hide();
        this.getEventos();
        this.toastr.success('Evento excluído com sucesso!');
      }, error => {
        this.toastr.error('Erro ao excluir evento!');
      }
    );
  }

}
