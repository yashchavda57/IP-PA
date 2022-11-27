import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AuthGuard } from './_auth/guards/auth.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';

/*
* Routing for the items feature are stored in the items module file
*/

const routes: Routes = [

    { path: 'dashboard', component: DashboardComponent  },
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '',  redirectTo: '/dashboard', pathMatch: 'full' }, // catch all route

];
export const routingModule: ModuleWithProviders<any> = RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' });
