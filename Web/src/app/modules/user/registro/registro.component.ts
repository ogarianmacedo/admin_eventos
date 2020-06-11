import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  registerForm: FormGroup;
  user: User;

  constructor(
    private authService: AuthService,
    public router: Router,
    public fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.validation();
  }

  validation() {
    this.registerForm = this.fb.group({
      fullName : ['', Validators.required],
      email : ['', [Validators.required, Validators.email]],
      userName : ['', Validators.required],
      passwords : this.fb.group({
        password : ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword : ['', Validators.required]
      }, { validator : this.compararPasswords })
    });
  }

  compararPasswords(fb: FormGroup) {
    const confirmPasswordCtrl = fb.get('confirmPassword');

    if(confirmPasswordCtrl.errors === null || 'mismatch' in confirmPasswordCtrl.errors) {
      if(fb.get('password').value !== confirmPasswordCtrl.value) {
        confirmPasswordCtrl.setErrors({ mismatch: true });
      } else {
        confirmPasswordCtrl.setErrors(null);
      }
    }
  }

  cadastrarUsuario() {
    if (this.registerForm.valid) {
      this.user = Object.assign(
        {password: this.registerForm.get('passwords.password').value},
        this.registerForm.value
      );

      this.authService.registro(this.user).subscribe(
        () => {
          this.router.navigate(['/user/login']);
          this.toastr.success('Usuário cadastrado com sucesso!');
        },
        error => {
          const erro = error.error;
          erro.forEach(element =>{
            switch (element.code) {
              case 'DuplicateUserName':
                this.toastr.error('Usuário duplicado!');
                break;
              default:
                this.toastr.error('Error ao cadastrar usuário! CODE: ' + element.code);
                break;
            }
          });
        }
      )
    }
  }

}
