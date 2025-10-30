import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

// Importar servicios
import { UsuariosService } from '../../../shared/services/usuarios.service';
import { DatosMadreService } from '../../../shared/services/datos-madre.service';
import { DatosCuidadorService } from '../../../shared/services/datos-cuidador.service';
import { AntecedentesMedicosService } from '../../../shared/services/antecedentes-medicos.service';
import { CondicionUsuariaService } from '../../../shared/services/condicion-usuaria.service';
import { DatosComplementariosService } from '../../../shared/services/datos-complementarios.service';

@Component({
  selector: 'app-datos-clinicos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-clinicos.component.html',
  styleUrls: ['./datos-clinicos.component.css']
})
export class DatosClinicosComponent implements OnInit {
  usuarioId!: number;
  usuario: any = {};
  esMenor: boolean = false;
  tabActiva: string = 'complementarios';
  
  cargando: boolean = false;
  guardando: boolean = false;

  // Modelos
  datosMadre: any = {};
  datosCuidador: any = {};
  antecedentesMedicos: any[] = [];
  nuevoAntecedente: any = {};
  condicionUsuaria: any = {};
  datosComplementarios: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuariosService: UsuariosService,
    private madreService: DatosMadreService,
    private cuidadorService: DatosCuidadorService,
    private antecedentesService: AntecedentesMedicosService,
    private condicionService: CondicionUsuariaService,
    private complementariosService: DatosComplementariosService
  ) {}

  ngOnInit(): void {
    this.usuarioId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.usuarioId) {
      alert('⚠️ No se encontró el usuario');
      this.router.navigate(['/usuarios']);
      return;
    }
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;

    // 1. Cargar datos del usuario primero
    this.usuariosService.getUsuarioPorId(this.usuarioId).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.verificarTipoUsuario();
        this.cargarDatosClinicos();
      },
      error: (err) => {
        console.error('❌ Error al cargar usuario:', err);
        alert('Error al cargar datos del usuario');
        this.cargando = false;
      }
    });
  }

  verificarTipoUsuario() {
    const tipo = this.usuario.tipo_id?.toUpperCase() || '';
    
    // ✅ CORREGIDO: Detectar menores correctamente
    this.esMenor = tipo === 'REGISTRO CIVIL' || 
                   tipo === 'TARJETA DE IDENTIDAD' ||
                   tipo === 'RC' || 
                   tipo === 'TI' ||
                   tipo.startsWith('T');  // T1, TI, etc.
    
    // ✅ Tab inicial siempre "complementarios"
    this.tabActiva = 'complementarios';
    
    console.log('👤 Usuario tipo:', tipo, '| Es menor:', this.esMenor);
  }

  cargarDatosClinicos() {
    const requests: any = {
      antecedentes: this.antecedentesService.getByUsuario(this.usuarioId),
      complementarios: this.complementariosService.getByUsuario(this.usuarioId)
    };

    if (this.esMenor) {
      requests.madre = this.madreService.getByUsuario(this.usuarioId);
      requests.cuidador = this.cuidadorService.getByUsuario(this.usuarioId);
    } else {
      requests.condicion = this.condicionService.getByUsuario(this.usuarioId);
    }

    forkJoin(requests).subscribe({
      next: (resultado: any) => {
        console.log('✅ Datos clínicos cargados:', resultado);
        
        this.antecedentesMedicos = resultado.antecedentes || [];
        this.datosComplementarios = resultado.complementarios || this.inicializarDatosComplementarios();
        
        if (this.esMenor) {
          this.datosMadre = resultado.madre || this.inicializarDatosMadre();
          this.datosCuidador = resultado.cuidador || this.inicializarDatosCuidador();
        } else {
          this.condicionUsuaria = resultado.condicion || this.inicializarCondicionUsuaria();
        }
        
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar datos clínicos:', err);
        // Inicializar con datos vacíos si hay error
        this.inicializarTodoVacio();
        this.cargando = false;
      }
    });
  }

  // ============================================
  // INICIALIZAR OBJETOS VACÍOS
  // ============================================

  inicializarTodoVacio() {
    this.datosComplementarios = this.inicializarDatosComplementarios();
    if (this.esMenor) {
      this.datosMadre = this.inicializarDatosMadre();
      this.datosCuidador = this.inicializarDatosCuidador();
    } else {
      this.condicionUsuaria = this.inicializarCondicionUsuaria();
    }
  }

  inicializarDatosMadre() {
    return {
      usuario_id: this.usuarioId,
      tipo_identificacion: '',
      numero_identificacion: '',
      primer_nombre: '',
      segundo_nombre: '',
      primer_apellido: '',
      segundo_apellido: '',
      correo: '',
      telefono: '',
      celular: '',
      regimen_afiliacion: '',
      pertenencia_etnica: '',
      desplazado: 0
    };
  }

  inicializarDatosCuidador() {
    return {
      usuario_id: this.usuarioId,
      tipo_identificacion: '',
      numero_identificacion: '',
      primer_nombre: '',
      segundo_nombre: '',
      primer_apellido: '',
      segundo_apellido: '',
      parentesco: '',
      correo: '',
      telefono: '',
      celular: ''
    };
  }

  inicializarDatosComplementarios() {
    return {
      usuario_id: this.usuarioId,
      sexo: '',
      genero: '',
      orientacion_sexual: '',
      edad_gestacional: '',
      pais_nacimiento: '',
      estatus_migratorio: '',
      lugar_parto: '',
      regimen_afiliacion: '',
      aseguradora: '',
      pertenencia_etnica: '',
      registrado_PAI: 0,
      desplazado: 0,
      discapacitado: 0,
      fallecido: 0,
      victima_conflicto: 0,
      estudia_actualmente: 0,
      pais_residencia: '',
      departamento_residencia: '',
      municipio_residencia: '',
      comuna_localidad: '',
      area: '',
      direccion: '',
      telefono: '',
      celular: '',
      email: '',
      autoriza_llamadas: 0,
      autoriza_correo: 0
    };
  }

  inicializarCondicionUsuaria() {
    return {
      usuario_id: this.usuarioId,
      condicion: '',
      gestante: 0,
      fecha_ultima_menstruacion: '',
      semanas_gestacion: null,
      fecha_probable_parto: '',
      embarazos_previos: null
    };
  }

  // ============================================
  // CAMBIAR TABS
  // ============================================

  cambiarTab(tab: string) {
    this.tabActiva = tab;
  }

  // ============================================
  // GUARDAR DATOS POR SECCIÓN
  // ============================================

  guardarSeccionActual() {
    this.guardando = true;

    switch (this.tabActiva) {
      case 'madre':
        this.guardarMadre();
        break;
      case 'cuidador':
        this.guardarCuidador();
        break;
      case 'antecedentes':
        alert('✅ Los antecedentes se guardan al agregarlos individualmente');
        this.guardando = false;
        break;
      case 'complementarios':
        this.guardarComplementarios();
        break;
      case 'condicion':
        this.guardarCondicion();
        break;
    }
  }

  guardarMadre() {
    const servicio = this.datosMadre.id 
      ? this.madreService.update(this.datosMadre.id, this.datosMadre)
      : this.madreService.create(this.datosMadre);

    servicio.subscribe({
      next: (res) => {
        if (!this.datosMadre.id && res.id) this.datosMadre.id = res.id;
        alert('✅ Datos de la madre guardados correctamente');
        this.guardando = false;
      },
      error: (err) => {
        console.error('❌ Error al guardar madre:', err);
        alert('Error al guardar datos de la madre');
        this.guardando = false;
      }
    });
  }

  guardarCuidador() {
    const servicio = this.datosCuidador.id
      ? this.cuidadorService.update(this.datosCuidador.id, this.datosCuidador)
      : this.cuidadorService.create(this.datosCuidador);

    servicio.subscribe({
      next: (res) => {
        if (!this.datosCuidador.id && res.id) this.datosCuidador.id = res.id;
        alert('✅ Datos del cuidador guardados correctamente');
        this.guardando = false;
      },
      error: (err) => {
        console.error('❌ Error al guardar cuidador:', err);
        alert('Error al guardar datos del cuidador');
        this.guardando = false;
      }
    });
  }

  guardarComplementarios() {
    console.log('💾 Guardando datos complementarios:', this.datosComplementarios);
    
    const servicio = this.datosComplementarios.id
      ? this.complementariosService.update(this.datosComplementarios.id, this.datosComplementarios)
      : this.complementariosService.create(this.datosComplementarios);

    servicio.subscribe({
      next: (res) => {
        console.log('✅ Respuesta del servidor:', res);
        if (!this.datosComplementarios.id && res.id) this.datosComplementarios.id = res.id;
        alert('✅ Datos complementarios guardados correctamente');
        this.guardando = false;
      },
      error: (err) => {
        console.error('❌ Error al guardar datos complementarios:', err);
        alert('Error al guardar datos complementarios');
        this.guardando = false;
      }
    });
  }

  guardarCondicion() {
    const servicio = this.condicionUsuaria.id
      ? this.condicionService.update(this.condicionUsuaria.id, this.condicionUsuaria)
      : this.condicionService.create(this.condicionUsuaria);

    servicio.subscribe({
      next: (res) => {
        if (!this.condicionUsuaria.id && res.id) this.condicionUsuaria.id = res.id;
        alert('✅ Condición usuaria guardada correctamente');
        this.guardando = false;
      },
      error: (err) => {
        console.error('❌ Error al guardar condición:', err);
        alert('Error al guardar condición usuaria');
        this.guardando = false;
      }
    });
  }

  // ============================================
  // ANTECEDENTES MÉDICOS
  // ============================================

  agregarAntecedente() {
    if (!this.nuevoAntecedente.tipo) {
      alert('⚠️ Por favor complete el tipo de antecedente');
      return;
    }

    this.nuevoAntecedente.usuario_id = this.usuarioId;

    this.antecedentesService.create(this.nuevoAntecedente).subscribe({
      next: (result) => {
        this.nuevoAntecedente.id = result.id;
        this.antecedentesMedicos.push({ ...this.nuevoAntecedente });
        this.nuevoAntecedente = {};
        alert('✅ Antecedente agregado');
      },
      error: (err) => {
        console.error('❌ Error al agregar antecedente:', err);
        alert('Error al agregar antecedente');
      }
    });
  }

  eliminarAntecedente(index: number) {
    if (!confirm('¿Eliminar este antecedente?')) return;

    const antecedente = this.antecedentesMedicos[index];
    
    if (antecedente.id) {
      this.antecedentesService.delete(antecedente.id).subscribe({
        next: () => {
          this.antecedentesMedicos.splice(index, 1);
          alert('🗑️ Antecedente eliminado');
        },
        error: (err) => {
          console.error('❌ Error al eliminar:', err);
          alert('Error al eliminar antecedente');
        }
      });
    } else {
      this.antecedentesMedicos.splice(index, 1);
    }
  }

  // ============================================
  // NAVEGACIÓN
  // ============================================

  volver() {
    if (confirm('¿Estás seguro de salir? Los cambios no guardados se perderán.')) {
      this.router.navigate(['/usuarios']);
    }
  }

  // ============================================
  // UTILIDADES PARA EL TEMPLATE - ✅ CORREGIDO
  // ============================================

  get tabsMenor() {
    return [
      { id: 'complementarios', titulo: 'Datos Complementarios', icono: '📋' },
      { id: 'madre', titulo: 'Datos de la Madre', icono: '👩' },
      { id: 'cuidador', titulo: 'Datos del Cuidador', icono: '👨‍👩‍👧' },
      { id: 'antecedentes', titulo: 'Antecedentes Médicos', icono: '🩺' }
    ];
  }

  get tabsAdulto() {
    return [
      { id: 'complementarios', titulo: 'Datos Complementarios', icono: '📋' },
      { id: 'condicion', titulo: 'Condición Usuaria', icono: '🤰' },
      { id: 'antecedentes', titulo: 'Antecedentes Médicos', icono: '🩺' }
    ];
  }

  get tabsDisponibles() {
    return this.esMenor ? this.tabsMenor : this.tabsAdulto;
  }
}