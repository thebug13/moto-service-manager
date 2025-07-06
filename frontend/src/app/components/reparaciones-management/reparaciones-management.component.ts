import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Reparacion {
  id: number;
  moto_id: number;
  auxiliar_id: number;
  fecha_ingreso: string;
  diagnostico?: string;
  estado: string;
  placa?: string;
  marca?: string;
  modelo?: string;
  cliente_nombre?: string;
  auxiliar_email?: string;
  nombre_auxiliar?: string;
  mano_obra?: number;
}

interface Moto {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  cliente_nombre?: string;
}

interface Auxiliar {
  id: number;
  email: string;
}

@Component({
  selector: 'app-reparaciones-management',
  templateUrl: './reparaciones-management.component.html',
  styleUrls: ['./reparaciones-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ReparacionesManagementComponent implements OnInit {
  reparaciones: Reparacion[] = [];
  filteredReparaciones: Reparacion[] = [];
  motos: Moto[] = [];
  auxiliares: Auxiliar[] = [];
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;
  searchText: string = '';

  // Para crear/editar
  reparacionForm: Partial<Reparacion> = { mano_obra: 0 };
  editMode: boolean = false;
  diagnosticoForm: { id?: number; diagnostico?: string } = {};

  selectedMoto: Moto | null = null;

  isJefeTaller: boolean = false;

  detalleReparacion: any = null;
  detalleRepuestos: any[] = [];
  detalleTotales: any = null;
  mostrarModalDetalle: boolean = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isJefeTaller = this.authService.getUserRole() === 'Jefe de taller';
    this.loadReparaciones();
    this.loadMotos();
    this.loadAuxiliares();
  }

  loadReparaciones(): void {
    this.isLoading = true;
    this.error = null;
    this.apiService.getReparaciones().subscribe({
      next: (data) => {
        this.reparaciones = data;
        this.filteredReparaciones = [...this.reparaciones];
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar reparaciones.';
        this.isLoading = false;
      },
    });
  }

  loadMotos(): void {
    this.apiService.getMotos().subscribe({
      next: (data) => {
        this.motos = data;
      },
      error: () => {
        this.motos = [];
      },
    });
  }

  loadAuxiliares(): void {
    this.apiService.getAuxiliares().subscribe({
      next: (data) => {
        this.auxiliares = data;
      },
      error: () => {
        this.auxiliares = [];
      },
    });
  }

  filterReparaciones(): void {
    if (!this.searchText) {
      this.filteredReparaciones = [...this.reparaciones];
      return;
    }
    const lower = this.searchText.toLowerCase();
    this.filteredReparaciones = this.reparaciones.filter(
      (r) =>
        (r.placa && r.placa.toLowerCase().includes(lower)) ||
        (r.marca && r.marca.toLowerCase().includes(lower)) ||
        (r.modelo && r.modelo.toLowerCase().includes(lower)) ||
        (r.cliente_nombre && r.cliente_nombre.toLowerCase().includes(lower)) ||
        (r.auxiliar_email && r.auxiliar_email.toLowerCase().includes(lower))
    );
  }

  startEdit(reparacion: Reparacion): void {
    this.editMode = true;
    this.reparacionForm = { ...reparacion };
    this.successMessage = null;
    this.error = null;
  }

  cancelEdit(): void {
    this.editMode = false;
    this.reparacionForm = {};
  }

  saveReparacion(): void {
    if (!this.reparacionForm.moto_id || !this.reparacionForm.auxiliar_id) {
      this.error = 'Moto y auxiliar son requeridos.';
      return;
    }
    if (
      this.reparacionForm.mano_obra === undefined ||
      this.reparacionForm.mano_obra === null ||
      this.reparacionForm.mano_obra < 0
    ) {
      this.error =
        'El costo de mano de obra es requerido y debe ser un número positivo';
      return;
    }
    this.isLoading = true;
    this.error = null;
    this.successMessage = null;
    this.apiService.createReparacion(this.reparacionForm).subscribe({
      next: () => {
        this.successMessage = 'Reparación registrada correctamente';
        this.loadReparaciones();
        this.cancelEdit();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error al registrar la reparación.';
        this.isLoading = false;
      },
    });
  }

  newReparacion(): void {
    this.editMode = false;
    if (this.selectedMoto) {
      this.reparacionForm = { moto_id: this.selectedMoto.id, mano_obra: 0 };
    } else {
      this.reparacionForm = { mano_obra: 0 };
    }
    this.successMessage = null;
    this.error = null;
  }

  openDiagnosticoForm(reparacion: Reparacion): void {
    this.diagnosticoForm = {
      id: reparacion.id,
      diagnostico: reparacion.diagnostico,
    };
    this.successMessage = null;
    this.error = null;
  }

  saveDiagnostico(): void {
    if (!this.diagnosticoForm.id || !this.diagnosticoForm.diagnostico) {
      this.error = 'El diagnóstico es requerido.';
      return;
    }
    this.isLoading = true;
    this.error = null;
    this.successMessage = null;
    this.apiService
      .registrarDiagnostico(
        this.diagnosticoForm.id,
        this.diagnosticoForm.diagnostico
      )
      .subscribe({
        next: () => {
          this.successMessage = 'Diagnóstico registrado correctamente';
          this.loadReparaciones();
          this.diagnosticoForm = {};
          this.isLoading = false;
        },
        error: (err) => {
          this.error =
            err?.error?.message || 'Error al registrar el diagnóstico.';
          this.isLoading = false;
        },
      });
  }

  cambiarEstado(reparacion: Reparacion, nuevoEstado: string): void {
    this.isLoading = true;
    this.error = null;
    this.successMessage = null;
    this.apiService
      .cambiarEstadoReparacion(reparacion.id, nuevoEstado)
      .subscribe({
        next: () => {
          this.successMessage = 'Estado actualizado correctamente';
          this.loadReparaciones();
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err?.error?.message || 'Error al actualizar el estado.';
          this.isLoading = false;
        },
      });
  }

  selectMoto(moto: Moto): void {
    this.selectedMoto = moto;
    this.reparacionForm.moto_id = moto.id;
  }

  descargarFacturaPDF(reparacion: any): void {
    this.apiService
      .getRepuestosByReparacion(reparacion.id)
      .subscribe((repuestos) => {
        this.apiService
          .getTotalReparacion(reparacion.id)
          .subscribe((totalData) => {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 20;
            const lineSpacing = 8;
            let y = 20;

            // Encabezado
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(18);
            doc.text('FACTURA DE REPARACIÓN', pageWidth / 2, y, {
              align: 'center',
            });

            y += lineSpacing * 2;
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text('Taller Motos Loaiza', margin, y);
            y += lineSpacing;
            doc.text(
              `Fecha de emisión: ${new Date().toLocaleDateString()}`,
              margin,
              y
            );
            y += lineSpacing * 2;

            // Datos del cliente y moto
            doc.setFont('helvetica', 'bold');
            doc.text('Datos del Cliente', margin, y);
            y += lineSpacing;

            doc.setFont('helvetica', 'normal');
            doc.text(`Nombre: ${reparacion.cliente_nombre || '-'}`, margin, y);
            y += lineSpacing;
            doc.text(
              `Moto: ${reparacion.placa || '-'} - ${
                reparacion.marca || '-'
              } - ${reparacion.modelo || '-'}`,
              margin,
              y
            );
            y += lineSpacing;
            doc.text(
              `Fecha de Ingreso: ${
                reparacion.fecha_ingreso
                  ? new Date(reparacion.fecha_ingreso).toLocaleDateString()
                  : '-'
              }`,
              margin,
              y
            );
            y += lineSpacing * 2;

            // Mano de obra
            doc.setFont('helvetica', 'bold');
            doc.text('Detalle de Mano de Obra', margin, y);
            y += lineSpacing;

            doc.setFont('helvetica', 'normal');
            doc.text(
              `Descripción: ${reparacion.diagnostico || 'Reparación general'}`,
              margin,
              y
            );
            y += lineSpacing;
            doc.text(
              `Valor mano de obra: $${Number(reparacion.mano_obra || 0).toFixed(
                2
              )}`,
              margin,
              y
            );
            y += lineSpacing * 2;

            // Repuestos utilizados
            doc.setFont('helvetica', 'bold');
            doc.text('Repuestos Utilizados', margin, y);
            y += lineSpacing;

            if (repuestos && repuestos.length > 0) {
              autoTable(doc, {
                startY: y,
                head: [['Nombre', 'Cantidad', 'Precio Unitario', 'Subtotal']],
                body: repuestos.map((r: any) => [
                  r.nombre,
                  r.cantidad,
                  `$${Number(r.precio).toFixed(2)}`,
                  `$${(Number(r.precio) * Number(r.cantidad)).toFixed(2)}`,
                ]),
                styles: {
                  fontSize: 10,
                  textColor: [0, 0, 0],
                  lineColor: [0, 0, 0],
                  lineWidth: 0.1,
                  halign: 'center',
                  valign: 'middle',
                },
                headStyles: {
                  fontStyle: 'bold',
                  fillColor: [255, 255, 255],
                  textColor: [0, 0, 0],
                  lineColor: [0, 0, 0],
                  lineWidth: 0.1,
                },
                theme: 'plain',
                margin: { left: margin, right: margin },
              });
              y = (doc as any).lastAutoTable.finalY + lineSpacing;
            } else {
              doc.setFont('helvetica', 'normal');
              doc.text(
                'No se registraron repuestos para esta reparación.',
                margin,
                y
              );
              y += lineSpacing;
            }

            // Totales
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(13);
            doc.text('Resumen de Totales', margin, y);
            y += lineSpacing;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
            doc.text(
              `Total repuestos: $${Number(
                totalData.totalRepuestos || 0
              ).toFixed(2)}`,
              margin,
              y
            );
            y += lineSpacing;
            doc.text(
              `Mano de obra: $${Number(totalData.manoObra || 0).toFixed(2)}`,
              margin,
              y
            );
            y += lineSpacing;

            doc.setFont('helvetica', 'bold');
            doc.text(
              `TOTAL A PAGAR: $${Number(totalData.total || 0).toFixed(2)}`,
              margin,
              y
            );
            y += lineSpacing * 2;

            // Pie de página
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(10);
            doc.text(
              'Gracias por confiar en nuestro taller. Para cualquier duda o reclamo, comuníquese con nosotros.',
              margin,
              doc.internal.pageSize.height - 10
            );

            // Descargar
            const nombreArchivo = `factura_reparacion_${
              reparacion.placa || reparacion.id
            }.pdf`;
            doc.save(nombreArchivo);
          });
      });
  }

  verDetalles(reparacion: any): void {
    this.detalleReparacion = reparacion;
    this.mostrarModalDetalle = true;
    this.apiService.getRepuestosByReparacion(reparacion.id).subscribe(repuestos => {
      this.detalleRepuestos = repuestos;
    });
    this.apiService.getTotalReparacion(reparacion.id).subscribe(totales => {
      this.detalleTotales = totales;
    });
  }

  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.detalleReparacion = null;
    this.detalleRepuestos = [];
    this.detalleTotales = null;
  }
}
