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

@Component({
  selector: 'app-graficos',
  imports: [FormsModule],
  templateUrl: './graficos.component.html',
  styleUrl: './graficos.component.css',
})
export class GraficosComponent {
  estadisticasService = inject(EstadisticasService);
  @ViewChild('chartPublicaciones', { static: true })
  chartPublicaciones!: ElementRef;
  @ViewChild('chartComentarios', { static: true })
  chartComentarios!: ElementRef;

  fechaDesde: string = '';
  fechaHasta: string = '';
  publicacionesDataVacia = signal(false);
  comentariosDataVacia = signal(false);

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
          this.publicacionesDataVacia.set(res.length === 0);
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
                data: cantidades,
                type: 'bar',
                itemStyle: {
                  color: '#00f0ff',
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
          this.comentariosDataVacia.set(res.length === 0);
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
                type: 'line', //
                smooth: true,
                lineStyle: {
                  color: '#00f0ff',
                  width: 3,
                },
                areaStyle: {
                  color: 'rgba(0, 240, 255, 0.2)',
                },
                symbol: 'circle',
                symbolSize: 6,
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

  renderizarGraficos() {
    this.cargarDatos();
    this.cargarComentariosPorFecha();
  }
}
