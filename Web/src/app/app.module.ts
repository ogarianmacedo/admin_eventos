import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxMaskModule } from 'ngx-mask';
import { NgxCurrencyModule } from 'ngx-currency';

import { DateTimeFormatPipe } from './helps/DateTimeFormatPipe.pipe';
import { AuthInterceptor } from './auth/auth.interceptor';

import { AppComponent } from './app.component';
import { EventosComponent } from './modules/eventos/eventos.component';
import { PalestrantesComponent } from './modules/palestrantes/palestrantes.component';
import { SidemenuComponent } from './shared/sidemenu/sidemenu.component';
import { TitleComponent } from './shared/title/title.component';
import { UserComponent } from './modules/user/user.component';
import { LoginComponent } from './modules/user/login/login.component';
import { RegistroComponent } from './modules/user/registro/registro.component';
import { EventoEditComponent } from './modules/eventos/evento-edit/evento-edit.component';

@NgModule({
   declarations: [
      DateTimeFormatPipe,
      AppComponent,
      EventosComponent,
      PalestrantesComponent,
      SidemenuComponent,
      TitleComponent,
      UserComponent,
      LoginComponent,
      RegistroComponent,
      EventoEditComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      BrowserAnimationsModule,
      ReactiveFormsModule,
      BsDropdownModule.forRoot(),
      BsDatepickerModule.forRoot(),
      TooltipModule.forRoot(),
      ModalModule.forRoot(),
      ToastrModule.forRoot(),
      TabsModule.forRoot(),
      NgxMaskModule.forRoot(),
      NgxCurrencyModule
   ],
   providers: [
      { 
         provide: HTTP_INTERCEPTORS, 
         useClass: AuthInterceptor,
         multi: true
      }
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
