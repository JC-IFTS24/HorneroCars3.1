import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
     children: [ // Los hijos de 'home' se cargan dentro de HomePage
      {path: 'reservar', loadComponent: () => import('./pages/reservar/reservar.page').then(m => m.ReservarPage),//canActivate: [authGuard], 
      },
      {
        path: 'mis-reservas',
        loadComponent: () => import('./pages/mis-reservas/mis-reservas.page').then(m => m.MisReservasPage), //canActivate: [authGuard],

      },
      {
        path: 'perfil', loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage), //canActivate: [authGuard],
      },
      {
        path: '',
        redirectTo: 'perfil', // Redirige a 'perfil' si solo se accede a /home
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },

  
];
