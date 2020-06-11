import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

import { EventosComponent } from './modules/eventos/eventos.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { PalestrantesComponent } from './modules/palestrantes/palestrantes.component';
import { UserComponent } from './modules/user/user.component';
import { LoginComponent } from './modules/user/login/login.component';
import { RegistroComponent } from './modules/user/registro/registro.component';
import { EventoEditComponent } from './modules/eventos/evento-edit/evento-edit.component';

const routes: Routes = [
    {   path: 'user',         
        component: UserComponent, 
        children: [
            { path: 'login',        component: LoginComponent },
            { path: 'registro',     component: RegistroComponent },
        ]
    },

    { path: 'dashboard',    component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'eventos',      component: EventosComponent, canActivate: [AuthGuard] },
    { path: 'evento/:id/edit',      component: EventoEditComponent, canActivate: [AuthGuard] },
    { path: 'palestrantes', component: PalestrantesComponent, canActivate: [AuthGuard] },
    { path: '',             redirectTo: 'dashboard', pathMatch: 'full' },
    { path: '**',           redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }