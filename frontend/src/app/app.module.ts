import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
// import { LoginComponent } from './login/login.component'; // LoginComponent es standalone, ya no necesita ser importado aquí para declaración

@NgModule({
  declarations: [
    // LoginComponent // Eliminar LoginComponent de las declaraciones
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    RouterModule
  ],
})
export class AppModule { } 