import { Component, OnInit } from '@angular/core';
import { PalestranteService } from 'src/app/services/palestrante.service';
import { Palestrante } from 'src/app/models/Palestrante';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-palestrantes',
  templateUrl: './palestrantes.component.html',
  styleUrls: ['./palestrantes.component.css']
})
export class PalestrantesComponent implements OnInit {
  titulo = "Palestrantes";
  palestrante: Palestrante;
  palestrantes: Palestrante[];
  palestrantesFiltrados: Palestrante[];
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = true;
  registerForm: FormGroup;
  modoSalvar = 'post';
  _filtroLista = '';
  bodyDeletarPalestrante = '';
  file: File;
  fileNameToUpdate: string;
  dataAtual: string;

  constructor(
    private palestranteService: PalestranteService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder) { }

  get filtroLista(): string {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.palestrantesFiltrados = this.filtroLista ? this.filtrarPalestrante(this.filtroLista) : this.palestrantes;
  }

  get redes() : FormArray {
    return <FormArray>this.registerForm.get('redes');
  }

  ngOnInit() {
    this.validation();
    this.getPalestrantes();
  }

   /**
   * Filtrar busca de palestrantes
   */
  filtrarPalestrante(filtrarPor: string): Palestrante[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.palestrantes.filter(
      palestrante => palestrante.nome.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  /**
   * Busca todos os palestrantes
   */
  getPalestrantes() {
    this.palestranteService.getAllPalestrante().subscribe(
      (resp: Palestrante[]) => {
        this.palestrantes = resp;
        this.palestrantesFiltrados = resp;
      }, error => {
        this.toastr.error('Erro ao carregar palestrantes!');
      }
    );
  }

  /**
   * Validação dos campos do formulário
   */
  validation() {
    this.registerForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      descricao: ['', Validators.required],
      imagemUrl: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      redes: this.formBuilder.array([])
    })
  }

  /**
   * Mostrar imagem na tabela de eventos
   */
  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  /**
   * Abre modal formulário evento
   */
  openModal(template: any) {
    this.registerForm.reset();
    template.show();
  }

  /**
   * Abre modal para cadastrar novo palestrante
   */
  novoPalestrante(template: any) {
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  /**
   * Abre modal para edição de palestrante
   */
  editarPalestrante(palestrante: Palestrante, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.palestrante = Object.assign({}, palestrante);
    this.fileNameToUpdate = palestrante.imagemUrl.toString();
    this.palestrante.imagemUrl = '';
    this.registerForm.patchValue(this.palestrante);
  }

  /**
   * Abre modal para excluir palestrante
   */
  excluirPalestrante(palestrante: Palestrante, template: any) {
    this.openModal(template);
    this.palestrante = palestrante;
    this.bodyDeletarPalestrante = `Deseja excluir o Palestrante: ${palestrante.nome}, Código: #${palestrante.id}`;
  }

  /**
   * Confirmar exclusão de palestrante
   */
  confirmeDelete(template: any) {
    this.palestranteService.deletePalestrante(this.palestrante.id).subscribe(
      (resp) => {
        template.hide();
        this.getPalestrantes();
        this.toastr.success('Palestrante excluído com sucesso!');
      }, error => {
        this.toastr.error('Erro ao excluir palestrante!');
      }
    );
  }

  /**
   * Salva alterações de edição palestrante ou cadastra novo palestrante
   */
  salvarAlteracao(template: any) {
    if (this.registerForm.valid) {
      if (this.modoSalvar === 'post') {
        this.palestrante = Object.assign({}, this.registerForm.value);

        this.uploadImagem();

        this.palestranteService.createPalestrante(this.palestrante).subscribe(
          (resp: Palestrante) => {
            template.hide();
            this.getPalestrantes();
            this.toastr.success('Palestrante cadastrado com sucesso!');
          }, error => {
            this.toastr.error('Erro ao cadastrar palestrante!');
          }
        );
      } else {
        this.palestrante = Object.assign({ id: this.palestrante.id }, this.registerForm.value);

        this.uploadImagem();

        this.palestranteService.editPalestrante(this.palestrante).subscribe(
          (resp: Palestrante) => {
            template.hide();
            this.getPalestrantes();
            this.toastr.success('Palestrante editado com sucesso!');
          }, error => {
            this.toastr.error('Erro ao editar palestrante!');
          }
        );
      }
    }
  }

  /**
   * Upload da imagem
   */
  uploadImagem() {
    if (this.modoSalvar === 'post') { 
      const nomeImagem = this.palestrante.imagemUrl.split('\\', 3);
      this.palestrante.imagemUrl = nomeImagem[2];
  
      this.palestranteService.upload(this.file, nomeImagem[2])
        .subscribe(
          () => {
            this.dataAtual = new Date().getMilliseconds().toString();
            this.getPalestrantes();
          }
        );
    } else {
      this.palestrante.imagemUrl = this.fileNameToUpdate;
      this.palestranteService.upload(this.file, this.fileNameToUpdate)
        .subscribe(
          () => {
            this.dataAtual = new Date().getMilliseconds().toString();
            this.getPalestrantes();
          }
        );
    }
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

  criaRede(rede: any): FormGroup {
    return this.formBuilder.group({
      id: [rede.id],
      nome: [rede.nome, Validators.required],
      urlRede: [rede.urlRede, Validators.required]
    });
  }

  adicionarRede() {
    this.redes.push(this.criaRede({ id: 0 }));
  }

  removerRede(id: number) {
    this.redes.removeAt(id);
  }
}
