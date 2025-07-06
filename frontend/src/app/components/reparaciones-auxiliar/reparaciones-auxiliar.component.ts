import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

interface Reparacion {
  id: number;
  moto_id: number;
  fecha_ingreso: string;
  diagnostico?: string;
  estado: string;
  placa?: string;
  marca?: string;
  modelo?: string;
  cliente_nombre?: string;
  mano_obra?: number;
}

interface Repuesto {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-reparaciones-auxiliar',
  templateUrl: './reparaciones-auxiliar.component.html',
  styleUrls: ['./reparaciones-auxiliar.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ReparacionesAuxiliarComponent implements OnInit {
  reparaciones: Reparacion[] = [];
  repuestos: Repuesto[] = [];
  totalRepuestos: number = 0;
  totalReparacion: number = 0;
  selectedReparacion: Reparacion | null = null;
  diagnostico: string = '';
  repuestoForm: Partial<Repuesto> = {};
  isLoading = false;
  error: string | null = null;
  errorRepuesto: string | null = null;
  successMessage: string | null = null;
  motos: any[] = [];
  showNewForm: boolean = false;
  newReparacionForm: { moto_id?: number } = {};
  motoSearchText: string = '';
  filteredMotos: any[] = [];
  manoObra: any = 0;
  manoObraTimeout: any = null;
  filtroFecha: string = '';
  reparacionesFiltradas: Reparacion[] = [];
  menuMotosAbierto: boolean = false;

  constructor(private apiService: ApiService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadReparaciones();
    this.loadMotos();
  }

  loadReparaciones(): void {
    console.log('Iniciando carga de reparaciones...');
    this.isLoading = true;
    this.error = null;
    const userId = this.getAuxiliarId();
    console.log('ID del auxiliar obtenido:', userId);
    if (!userId) {
      this.error = 'No se pudo obtener el ID del auxiliar.';
      this.isLoading = false;
      return;
    }
    console.log('Llamando a API con userId:', userId);
    this.apiService.getReparacionesByAuxiliar(userId).subscribe({
      next: (data) => {
        console.log('Respuesta de API reparaciones:', data);
        this.reparaciones = data;
        this.filtrarPorFecha();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar reparaciones:', error);
        this.error = 'Error al cargar reparaciones.';
        this.isLoading = false;
      }
    });
  }

  getAuxiliarId(): number | null {
    // Decodifica el token para obtener el ID del usuario actual
    const token = this.authService.getToken();
    console.log('Token obtenido:', token ? 'Sí' : 'No');
    if (token) {
      try {
        const payload: any = JSON.parse(atob(token.split('.')[1]));
        console.log('Payload del token:', payload);
        return payload.id;
      } catch (e) {
        console.error('Error al decodificar token:', e);
        return null;
      }
    }
    return null;
  }

  seleccionarReparacion(reparacion: Reparacion): void {
    this.selectedReparacion = reparacion;
    this.diagnostico = reparacion.diagnostico || '';
    this.loadRepuestos(reparacion.id);
    this.loadTotal(reparacion.id);
    this.manoObra = reparacion.mano_obra || 0;
    this.successMessage = null;
    this.error = null;
  }

  registrarDiagnostico(): void {
    if (!this.selectedReparacion) return;
    this.isLoading = true;
    this.apiService.registrarDiagnostico(this.selectedReparacion.id, this.diagnostico).subscribe({
      next: () => {
        this.successMessage = 'Diagnóstico registrado correctamente';
        this.loadReparaciones();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error al registrar el diagnóstico.';
        this.isLoading = false;
      }
    });
  }

  loadRepuestos(reparacionId: number): void {
    this.apiService.getRepuestosByReparacion(reparacionId).subscribe({
      next: (data) => {
        this.repuestos = data;
      },
      error: () => {
        this.repuestos = [];
      }
    });
  }

  loadTotal(reparacionId: number): void {
    this.apiService.getTotalReparacion(reparacionId).subscribe({
      next: (data) => {
        this.totalReparacion = data.total;
        this.totalRepuestos = data.totalRepuestos;
        this.manoObra = data.manoObra;
      },
      error: () => {
        this.totalReparacion = 0;
        this.totalRepuestos = 0;
      }
    });
  }

  agregarRepuesto(): void {
    if (!this.selectedReparacion || !this.repuestoForm.nombre || !this.repuestoForm.precio) {
      this.errorRepuesto = 'Nombre y precio del repuesto son requeridos.';
      return;
    }
    this.apiService.createRepuesto(this.selectedReparacion.id, this.repuestoForm).subscribe({
      next: () => {
        this.successMessage = 'Repuesto agregado correctamente';
        this.errorRepuesto = null;
        this.loadRepuestos(this.selectedReparacion!.id);
        this.loadTotal(this.selectedReparacion!.id);
        this.repuestoForm = {};
      },
      error: (err) => {
        this.errorRepuesto = err?.error?.message || 'Error al agregar el repuesto.';
      }
    });
  }

  eliminarRepuesto(repuesto: Repuesto): void {
    if (!this.selectedReparacion) return;
    if (!confirm('¿Seguro que deseas eliminar este repuesto?')) return;
    this.apiService.deleteRepuesto(repuesto.id).subscribe({
      next: () => {
        this.errorRepuesto = null;
        this.successMessage = 'Repuesto eliminado correctamente';
        this.loadRepuestos(this.selectedReparacion!.id);
        this.loadTotal(this.selectedReparacion!.id);
      },
      error: (err) => {
        this.errorRepuesto = err?.error?.message || 'Error al eliminar el repuesto.';
      }
    });
  }

  loadMotos(): void {
    this.apiService.getMotos().subscribe({
      next: (data) => {
        this.motos = data;
        this.filteredMotos = data;
      },
      error: () => {
        this.motos = [];
        this.filteredMotos = [];
      }
    });
  }

  onMotoSearchChange(): void {
    const lower = this.motoSearchText.toLowerCase();
    this.filteredMotos = this.motos.filter(m =>
      m.placa.toLowerCase().includes(lower) ||
      m.marca.toLowerCase().includes(lower) ||
      m.modelo.toLowerCase().includes(lower) ||
      (m.cliente_nombre && m.cliente_nombre.toLowerCase().includes(lower))
    );
  }

  selectMoto(moto: any): void {
    this.newReparacionForm.moto_id = moto.id;
    this.motoSearchText = `${moto.placa} - ${moto.marca} - ${moto.modelo} (${moto.cliente_nombre})`;
    this.filteredMotos = [];
    this.menuMotosAbierto = false;
  }

  onBlurMotoSearch(): void {
    setTimeout(() => { this.menuMotosAbierto = false; }, 200);
  }

  abrirFormularioNuevaReparacion(): void {
    this.showNewForm = true;
    this.newReparacionForm = {};
    this.motoSearchText = '';
    this.filteredMotos = this.motos;
    this.successMessage = null;
    this.error = null;
  }

  cancelarNuevaReparacion(): void {
    this.showNewForm = false;
    this.newReparacionForm = {};
  }

  crearNuevaReparacion(): void {
    if (this.selectedReparacion) {
      this.error = 'Ya tienes una reparación seleccionada. Solo puedes crear una nueva si no hay ninguna seleccionada.';
      return;
    }
    const moto_id = this.newReparacionForm.moto_id;
    const auxiliar_id = this.getAuxiliarId();
    const mano_obra = Number(this.manoObra) || 0;
    if (!moto_id || !auxiliar_id || mano_obra < 0) {
      this.error = 'Datos inválidos para crear la reparación. Verifica que tienes motos registradas, el auxiliar es válido y la mano de obra es positiva.';
      return;
    }
    this.isLoading = true;
    this.apiService.createReparacion({
      moto_id,
      auxiliar_id,
      mano_obra
    }).subscribe({
      next: () => {
        this.successMessage = 'Reparación creada correctamente';
        this.loadReparaciones();
        this.newReparacionForm = {};
        this.motoSearchText = '';
        this.filteredMotos = this.motos;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error al crear la reparación.';
        this.isLoading = false;
      }
    });
  }

  get totalConManoObra(): number {
    return this.totalReparacion;
  }

  onManoObraChange(): void {
    let manoObraStr = this.manoObra;
    if (typeof manoObraStr === 'string') {
      manoObraStr = String(manoObraStr).replace(',', '.');
    }
    this.manoObra = Number(manoObraStr) || 0;
    if (!this.selectedReparacion) return;
    if (this.manoObraTimeout) clearTimeout(this.manoObraTimeout);
    this.manoObraTimeout = setTimeout(() => {
      this.apiService.updateManoObra(this.selectedReparacion!.id, this.manoObra).subscribe({
        next: () => {
          this.successMessage = 'Mano de obra actualizada';
          this.loadTotal(this.selectedReparacion!.id);
        },
        error: (err) => {
          this.error = err?.error?.message || 'Error al actualizar mano de obra';
        }
      });
    }, 600);
  }

  deseleccionarReparacion(): void {
    this.selectedReparacion = null;
    this.diagnostico = '';
    this.repuestos = [];
    this.totalRepuestos = 0;
    this.manoObra = 0;
    this.successMessage = null;
    this.error = null;
  }

  filtrarPorFecha(): void {
    if (!this.filtroFecha) {
      this.reparacionesFiltradas = [...this.reparaciones];
      return;
    }
    this.reparacionesFiltradas = this.reparaciones.filter(rep => {
      const fecha = rep.fecha_ingreso ? rep.fecha_ingreso.substring(0, 10) : '';
      return fecha === this.filtroFecha;
    });
  }
} 