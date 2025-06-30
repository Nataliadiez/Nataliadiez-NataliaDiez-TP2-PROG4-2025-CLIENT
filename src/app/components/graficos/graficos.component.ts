import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import * as echarts from 'echarts';
import { EstadisticasService } from '../../services/estadisticas.service';
import { FormsModule } from '@angular/forms';
import { mostrarSwal } from '../../utils/swal.util';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-graficos',
  imports: [FormsModule, CommonModule],
  templateUrl: './graficos.component.html',
  styleUrl: './graficos.component.css',
})
export class GraficosComponent {
  estadisticasService = inject(EstadisticasService);
  @ViewChild('chartPublicaciones', { static: true })
  chartPublicaciones!: ElementRef;
  @ViewChild('chartComentarios', { static: true })
  chartComentarios!: ElementRef;
  @ViewChild('chartComentariosPorPublicacion', { static: true })
  chartComentariosPorPublicacion!: ElementRef;

  fechaDesde: string = '';
  fechaHasta: string = '';
  publicacionesDataVacia = signal(false);
  comentariosDataVacia = signal(false);
  comentariosPorPublicacionDataVacia = signal(false);
  datosComentariosPorPublicacion = signal<any[]>([]);

  cargarDatos() {
    if (!this.fechaDesde || !this.fechaHasta) {
      mostrarSwal('', 'Elegí ambas fechas primero', 'warning');
      return;
    }

    const desde = new Date(this.fechaDesde);
    const hasta = new Date(this.fechaHasta);

    if (desde > hasta) {
      mostrarSwal('', '"Desde" no puede ser mayor que "Hasta"', 'error');
      return;
    }

    this.estadisticasService
      .obtenerPublicacionesPorUsuario(this.fechaDesde, this.fechaHasta)
      .subscribe({
        next: (res) => {
          if (!res || res.length === 0) {
            this.publicacionesDataVacia.set(true);
            return;
          }
          this.publicacionesDataVacia.set(false);
          const chart = echarts.init(
            this.chartPublicaciones.nativeElement,
            'dark'
          );

          const nombres = res.map((item: any) => item.nombre);
          const cantidades = res.map((item: any) => item.total);

          const options = {
            title: {
              text: 'Publicaciones por usuario',
              left: 'center',
              textStyle: { color: '#FCEE0A' },
            },
            tooltip: {},
            xAxis: {
              type: 'category',
              data: nombres,
              axisLabel: { color: '#fff' },
            },
            yAxis: {
              type: 'value',
              axisLabel: { color: '#fff' },
            },
            backgroundColor: '#000000',
            series: [
              {
                name: 'Publicaciones',
                type: 'pie',
                radius: '60%',
                data: nombres.map((n, i) => ({
                  name: n,
                  value: cantidades[i],
                })),
                label: {
                  color: '#fff',
                  formatter: '{b}: {d}%',
                },
                itemStyle: {
                  borderRadius: 5,
                  borderColor: '#000',
                  borderWidth: 2,
                },
              },
            ],
          };
          chart.setOption(options);
          window.addEventListener('resize', () => chart.resize());
        },
        error: (error) => {
          mostrarSwal(
            `Error ${error.error.statusCode}`,
            error.error.message,
            'error'
          );
        },
      });
  }

  cargarComentariosPorFecha() {
    this.estadisticasService
      .obtenercomentariosPorUsuario(this.fechaDesde, this.fechaHasta)
      .subscribe({
        next: (res) => {
          if (!res || res.length === 0) {
            this.comentariosDataVacia.set(true);
            return;
          }
          this.comentariosDataVacia.set(false);
          const chart = echarts.init(
            this.chartComentarios.nativeElement,
            'dark'
          );

          const fechas = res.map((item: any) => item._id);
          const cantidades = res.map((item: any) => item.total);

          const options = {
            title: {
              text: 'Comentarios por fecha',
              left: 'center',
              textStyle: { color: '#FCEE0A' },
            },
            tooltip: { trigger: 'axis' },
            xAxis: {
              type: 'category',
              data: fechas,
              axisLabel: { color: '#fff' },
            },
            yAxis: {
              type: 'value',
              axisLabel: { color: '#fff' },
            },
            series: [
              {
                data: cantidades,
                type: 'bar',
                itemStyle: {
                  color: '#00f0ff',
                },
              },
            ],
            backgroundColor: '#000000',
          };

          chart.setOption(options);
          window.addEventListener('resize', () => chart.resize());
        },
        error: (error) => {
          mostrarSwal(
            `Error ${error.error.statusCode}`,
            error.error.message,
            'error'
          );
        },
      });
  }

  cargarComentariosPorPublicacion() {
    if (!this.fechaDesde || !this.fechaHasta) {
      mostrarSwal('', 'Elegí ambas fechas primero', 'warning');
      return;
    }

    this.estadisticasService
      .obtenerComentariosPorPublicacion(this.fechaDesde, this.fechaHasta)
      .subscribe({
        next: (res) => {
          if (!res || res.length === 0) {
            this.comentariosPorPublicacionDataVacia.set(true);
            return;
          }
          this.comentariosPorPublicacionDataVacia.set(false);
          const chartElement =
            this.chartComentariosPorPublicacion?.nativeElement;

          if (!chartElement) {
            console.warn(
              'El contenedor del gráfico todavía no está en el DOM.'
            );
            return;
          }

          const chart = echarts.init(chartElement, 'dark');

          const titulos = res.map((item: any) => item.titulo);
          const cantidades = res.map((item: any) => item.cantidadComentarios);

          const options = {
            title: {
              text: 'Comentarios por publicación',
              left: 'center',
              textStyle: { color: '#FCEE0A' },
            },
            tooltip: { trigger: 'axis' },
            grid: {
              bottom: 100,
            },
            xAxis: {
              type: 'value',
              axisLabel: { color: '#fff' },
            },
            yAxis: {
              type: 'category',
              data: titulos,
              axisLabel: {
                color: '#fff',
                fontSize: 12,
                lineHeight: 14,
              },
            },
            series: [
              {
                data: cantidades,
                type: 'bar',
                itemStyle: {
                  color: '#ff003c',
                },
              },
            ],
            backgroundColor: '#000000',
          };

          chart.setOption(options);
          window.addEventListener('resize', () => chart.resize());
        },
        error: (error) =>
          mostrarSwal(
            `Error ${error.error.statusCode}`,
            error.error.message,
            'error'
          ),
      });
  }

  renderizarGraficos() {
    this.cargarDatos();
    this.cargarComentariosPorFecha();
    this.cargarComentariosPorPublicacion();
  }
}
