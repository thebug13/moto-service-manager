import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReparacionDetalle {
  id: number;
  fecha_ingreso: string;
  diagnostico?: string;
  estado: string;
  mano_obra: number;
  placa: string;
  marca: string;
  modelo: string;
  cliente_nombre: string;
  cliente_telefono: string;
}

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.css'],
})
export class PayrollComponent implements OnInit {
  desde: string = '';
  hasta: string = '';
  porcentaje: number = 30; // Porcentaje por defecto
  resultados: any[] = [];
  cargando: boolean = false;
  error: string = '';
  detallesAuxiliar: ReparacionDetalle[] = [];
  auxiliarSeleccionado: any = null;
  cargandoDetalles: boolean = false;
  cargandoDesprendible: { [auxiliarId: number]: boolean } = {};

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Establecer fechas por defecto (mes actual)
    const hoy = new Date();
    const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    this.desde = primerDia.toISOString().split('T')[0];
    this.hasta = ultimoDia.toISOString().split('T')[0];
  }

  calcularNomina(): void {
    console.log('Función calcularNomina llamada');
    console.log('Fechas:', this.desde, this.hasta);
    console.log('Porcentaje:', this.porcentaje);

    if (!this.desde || !this.hasta) {
      this.error = 'Debe seleccionar las fechas desde y hasta';
      console.log('Error: fechas faltantes');
      return;
    }

    if (this.porcentaje <= 0 || this.porcentaje > 100) {
      this.error = 'El porcentaje debe estar entre 1 y 100';
      console.log('Error: porcentaje inválido');
      return;
    }

    this.cargando = true;
    this.error = '';
    console.log('Iniciando llamada a API...');

    this.apiService
      .getSumaManoObraPorAuxiliar(this.desde, this.hasta)
      .subscribe({
        next: (data) => {
          console.log('Respuesta de API:', data);
          this.resultados = data.map((item: any) => ({
            ...item,
            total_mano_obra: Number(item.total_mano_obra) || 0,
            salario:
              Number((item.total_mano_obra * this.porcentaje) / 100) || 0,
          }));
          this.cargando = false;
          console.log('Resultados procesados:', this.resultados);
        },
        error: (error) => {
          console.error('Error al calcular nómina:', error);
          this.error =
            'Error al calcular la nómina. Verifique las fechas seleccionadas.';
          this.cargando = false;
        },
      });
  }

  verDetallesAuxiliar(auxiliar: any): void {
    this.auxiliarSeleccionado = auxiliar;
    this.cargandoDetalles = true;
    this.detallesAuxiliar = [];

    this.apiService
      .getReparacionesDetalladasPorAuxiliar(
        auxiliar.auxiliar_id,
        this.desde,
        this.hasta
      )
      .subscribe({
        next: (data) => {
          console.log('Datos de detalles recibidos:', data);
          // Asegurar que mano_obra sea un número
          this.detallesAuxiliar = data.map((item: any) => ({
            ...item,
            mano_obra: Number(item.mano_obra) || 0,
          }));
          console.log('Detalles procesados:', this.detallesAuxiliar);
          console.log('Total calculado:', this.getTotalDetalles());
          this.cargandoDetalles = false;
        },
        error: (error) => {
          console.error('Error al cargar detalles:', error);
          this.error = 'Error al cargar los detalles del auxiliar.';
          this.cargandoDetalles = false;
        },
      });
  }

  cerrarDetalles(): void {
    this.auxiliarSeleccionado = null;
    this.detallesAuxiliar = [];
  }

  exportarDetallesPDF(): void {
    if (!this.auxiliarSeleccionado || this.detallesAuxiliar.length === 0) {
      this.error = 'No hay detalles para exportar';
      return;
    }
    const doc = new jsPDF();
    // Título y datos principales
    doc.setFontSize(16);
    doc.text('Detalle de Nómina - Auxiliar', 14, 15);
    doc.setFontSize(12);
    doc.text(`Auxiliar: ${this.auxiliarSeleccionado.nombre_auxiliar}`, 14, 25);
    doc.text(`Período: ${this.desde} a ${this.hasta}`, 14, 32);
    doc.text(
      `Total mano de obra: $${this.getTotalDetalles().toFixed(2)}`,
      14,
      39
    );
    doc.text('Taller: Crud Node', 14, 46);
    // Tabla de trabajos
    autoTable(doc, {
      startY: 52,
      head: [
        [
          'Fecha',
          'Placa',
          'Marca/Modelo',
          'Cliente',
          'Diagnóstico',
          'Estado',
          'Mano de Obra',
        ],
      ],
      body: this.detallesAuxiliar.map((item) => [
        new Date(item.fecha_ingreso).toLocaleDateString(),
        item.placa,
        `${item.marca} ${item.modelo}`,
        item.cliente_nombre,
        item.diagnostico || '',
        item.estado,
        `$${Number(item.mano_obra).toFixed(2)}`,
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [102, 126, 234] },
      margin: { left: 14, right: 14 },
    });
    // Guardar PDF
    doc.save(
      `nomina_${this.auxiliarSeleccionado.nombre_auxiliar}_${this.desde}_${this.hasta}.pdf`
    );
  }

  // Nueva función para generar desprendible individual
  generarDesprendibleIndividual(auxiliar: any): void {
    this.cargandoDesprendible[auxiliar.auxiliar_id] = true;
    this.apiService
      .getReparacionesDetalladasPorAuxiliar(
        auxiliar.auxiliar_id,
        this.desde,
        this.hasta
      )
      .subscribe({
        next: (data) => {
          if (!Array.isArray(data)) {
            this.cargandoDesprendible[auxiliar.auxiliar_id] = false;
            return;
          }
          const detalles = data.map((item: any) => ({
            ...item,
            mano_obra: Number(item.mano_obra) || 0,
          }));
          this.generarPDFDesprendible(auxiliar, detalles);
          this.cargandoDesprendible[auxiliar.auxiliar_id] = false;
        },
        error: () => {
          this.cargandoDesprendible[auxiliar.auxiliar_id] = false;
        },
      });
  }

  // Función para generar el PDF del desprendible
  generarPDFDesprendible(auxiliar: any, detalles: ReparacionDetalle[]): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const lineSpacing = 7;
    if (!detalles || detalles.length === 0) {
      doc.setFontSize(14);
      doc.text(
        'No hay detalles de nómina para este auxiliar en el período seleccionado.',
        margin,
        30
      );
    } else {
      let y = 20;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('DESPRENDIBLE DE NÓMINA', pageWidth / 2, y, { align: 'center' });
      y += 5;
      doc.setLineWidth(0.1);
      doc.line(margin, y, pageWidth - margin, y);
      y += lineSpacing;
      doc.setFontSize(14);
      doc.text('Datos del Empleado', margin, y);
      y += lineSpacing;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(`Nombre: ${auxiliar.nombre_auxiliar}`, margin, y);
      y += lineSpacing;
      doc.text(
        `Período: ${new Date(this.desde).toLocaleDateString()} - ${new Date(
          this.hasta
        ).toLocaleDateString()}`,
        margin,
        y
      );
      y += lineSpacing;
      doc.text(
        `Fecha de emisión: ${new Date().toLocaleDateString()}`,
        margin,
        y
      );
      y += 5;
      doc.line(margin, y, pageWidth - margin, y);
      y += lineSpacing;
      const totalManoObra = detalles.reduce(
        (total, item) => total + item.mano_obra,
        0
      );
      const salario = (totalManoObra * this.porcentaje) / 100;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Resumen de Ingresos', margin, y);
      y += lineSpacing;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(
        `Total mano de obra generada: $${totalManoObra.toFixed(2)}`,
        margin,
        y
      );
      y += lineSpacing;
      doc.text(`Porcentaje aplicado: ${this.porcentaje}%`, margin, y);
      y += lineSpacing;
      doc.text(`Salario a pagar: $${salario.toFixed(2)}`, margin, y);
      y += 5;
      doc.line(margin, y, pageWidth - margin, y);
      y += lineSpacing;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Detalle de Trabajos Realizados', margin, y);
      y += 5;
      autoTable(doc, {
        startY: y + 2,
        head: [
          [
            'Fecha',
            'Placa',
            'Marca/Modelo',
            'Cliente',
            'Estado',
            'Mano de Obra',
          ],
        ],
        body: detalles.map((item) => [
          new Date(item.fecha_ingreso).toLocaleDateString(),
          item.placa,
          `${item.marca} ${item.modelo}`,
          item.cliente_nombre,
          item.estado,
          `$${Number(item.mano_obra).toFixed(2)}`,
        ]),
        styles: {
          fontSize: 9,
          textColor: [0, 0, 0],
          cellPadding: 2,
          halign: 'center',
          valign: 'middle',
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          halign: 'center',
        },
        theme: 'plain',
        margin: { left: margin, right: margin },
        didDrawPage: function (data: any) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(9);
          doc.text(
            'Este documento es un desprendible de nómina oficial del Taller Motos Loaiza',
            margin,
            doc.internal.pageSize.height - 10
          );
        },
      });
    }
    const nombreArchivo = `desprendible_${auxiliar.nombre_auxiliar.replace(
      /\s+/g,
      '_'
    )}_${this.desde}_${this.hasta}.pdf`;
    doc.save(nombreArchivo);
  }

  limpiarResultados(): void {
    this.resultados = [];
    this.error = '';
    this.auxiliarSeleccionado = null;
    this.detallesAuxiliar = [];
  }

  getTotalManoObra(): number {
    return this.resultados.reduce(
      (total, item) => total + item.total_mano_obra,
      0
    );
  }

  getTotalSalarios(): number {
    return this.resultados.reduce((total, item) => total + item.salario, 0);
  }

  getTotalDetalles(): number {
    const total = this.detallesAuxiliar.reduce((total, item) => {
      const valor = Number(item.mano_obra) || 0;
      console.log('Sumando valor:', valor, 'de item:', item);
      return total + valor;
    }, 0);
    console.log('Total final:', total);
    return total;
  }
}
