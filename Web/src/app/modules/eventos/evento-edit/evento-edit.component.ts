import { Component, OnInit } from '@angular/core';
import { EventoService } from 'src/app/services/evento.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { BsLocaleService, DateFormatter } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { ActivatedRoute } from '@angular/router';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-evento-edit',
  templateUrl: './evento-edit.component.html',
  styleUrls: ['./evento-edit.component.css']
})
export class EventoEditComponent implements OnInit {
  titulo = "Edição de Evento";
  registerForm: FormGroup;
  evento: Evento = new Evento();
  imagemUrl = 'assets/img/upload.png';
  fileNameToUpdate: string;
  dataAtual: string;
  file: File;

  get lotes() : FormArray {
    return <FormArray>this.registerForm.get('lotes');
  }

  get redes() : FormArray {
    return <FormArray>this.registerForm.get('redes');
  }

  constructor(
    private eventoService: EventoService,
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    private localeService: BsLocaleService,
    private toastr: ToastrService) {
    this.localeService.use('pt-br');
  }

  ngOnInit() {
    this.validation();
    this.carregarEvento();
  }

  /**
  * Validação dos campos do formulário
  */
  validation() {
    this.registerForm = this.formBuilder.group({
      id: [],
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(500)]],
      imagemUrl: [''],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lotes: this.formBuilder.array([]),
      redes: this.formBuilder.array([])
    });
  }

  criaLote(lote: any): FormGroup {
    return this.formBuilder.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim]
    });
  }

  criaRede(rede: any): FormGroup {
    return this.formBuilder.group({
      id: [rede.id],
      nome: [rede.nome, Validators.required],
      urlRede: [rede.urlRede, Validators.required]
    });
  }
  
  adicionarLote() {
    this.lotes.push(this.criaLote({ id: 0 }));
  }

  adicionarRede() {
    this.redes.push(this.criaRede({ id: 0 }));
  }

  removerLote(id: number) {
    this.lotes.removeAt(id);
  }

  removerRede(id: number) {
    this.redes.removeAt(id);
  }

  carregarEvento() {
    const idEvento = +this.router.snapshot.paramMap.get('id');
    this.eventoService.getEventoById(idEvento)
      .subscribe(
        (evento: Evento) => {
          this.evento = Object.assign({}, evento);
          this.fileNameToUpdate = evento.imagemUrl.toString();
          this.imagemUrl = `http://localhost:5000/resources/images/${this.evento.imagemUrl}?_ts=${this.dataAtual}`
          this.evento.imagemUrl = '';
          this.registerForm.patchValue(this.evento);

          this.evento.lotes.forEach(lote => {
            this.lotes.push(this.criaLote(lote));
          });

          this.evento.redes.forEach(rede => {
            this.redes.push(this.criaRede(rede));
          });
        }
      );
  }

  /**
   * Salvar imagem
   */
  onFileChange(file: FileList) {
    const reader = new FileReader();
    reader.onload = (event: any) => this.imagemUrl = event.target.result;
    if (event.target['files']) {
      this.file = event.target['files'];
    }
    reader.readAsDataURL(file[0]);
  }

  /**
   * Upload da imagem
   */
  uploadImagem() {
    if (this.registerForm.get('imagemUrl').value !== '') {
      this.eventoService.upload(this.file, this.fileNameToUpdate)
        .subscribe(
          () => {
            this.dataAtual = new Date().getMilliseconds().toString();
            this.imagemUrl = `http://localhost:5000/resources/images/${this.evento.imagemUrl}?_ts=${this.dataAtual}`
          }
        );
    }
  }

  salvarEvento() {
    this.evento = Object.assign({ id: this.evento.id }, this.registerForm.value);
    this.evento.imagemUrl = this.fileNameToUpdate;
    this.uploadImagem();

    this.eventoService.editEvento(this.evento).subscribe(
      (resp: Evento) => {
        this.toastr.success('Evento editado com sucesso!');
      }, error => {
        this.toastr.error('Erro ao editar evento!');
      }
    );
  }
}
