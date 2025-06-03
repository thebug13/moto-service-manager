import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Formulario de Contacto</h2>
      
      <div class="card">
        <div class="card-body">
          <form (ngSubmit)="enviarMensaje()">
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre</label>
              <input type="text" class="form-control" id="nombre" [(ngModel)]="mensaje.nombre" name="nombre" required>
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" [(ngModel)]="mensaje.email" name="email" required>
            </div>
            <div class="mb-3">
              <label for="asunto" class="form-label">Asunto</label>
              <input type="text" class="form-control" id="asunto" [(ngModel)]="mensaje.asunto" name="asunto" required>
            </div>
            <div class="mb-3">
              <label for="mensaje" class="form-label">Mensaje</label>
              <textarea class="form-control" id="mensaje" rows="5" [(ngModel)]="mensaje.mensaje" name="mensaje" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Enviar Mensaje</button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ContactoComponent {
  mensaje: any = {
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  };

  constructor(private apiService: ApiService) {}

  enviarMensaje() {
    this.apiService.enviarMensaje(this.mensaje).subscribe({
      next: () => {
        alert('Mensaje enviado correctamente');
        this.limpiarFormulario();
      },
      error: (error) => {
        console.error('Error al enviar mensaje:', error);
        alert('Error al enviar el mensaje');
      }
    });
  }

  limpiarFormulario() {
    this.mensaje = {
      nombre: '',
      email: '',
      asunto: '',
      mensaje: ''
    };
  }
} 