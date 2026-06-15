
import { ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { ReclamoRequest } from '@/app/core/models/operaciones/reclamos-model/reclamo.model';
import { ImageUploadService } from '@/app/core/services/common/imageUpload.service';
import { ImagenProductoUI } from '@/app/core/models/common/imagen.model';
import { campoInvalido, marcarFormulario } from '@/app/shared/utils/form-utils.component';
import { TIPO_RECLAMACION_OPTIONS, TIPO_PROBLEMA_OPTIONS, CAUSA_RECLAMO_OPTIONS, TIPO_DOCUMENTO_OPTIONS } from '@/app/core/models/common/select.option.model';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-reclamo-form',
  imports: [
    ReactiveFormsModule, InputTextModule, SelectModule, TextareaModule,
    ButtonModule, MessageModule, ImageModule, FileUploadModule,
    InputNumberModule, DatePickerModule,
  ],
  templateUrl: './reclamo-form.html',
  styleUrl: './reclamo-form.css',
})

export class ReclamoFormComponent implements OnInit {
  @Output() guardar = new EventEmitter<{ request: ReclamoRequest; archivos?: File[] }>();
  @Output() cancelarEvento = new EventEmitter<void>();
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  private cd = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);
  private imageService = inject(ImageUploadService);

  formSubmitted = false;
  reclamoForm!: FormGroup;
  imagenes: ImagenProductoUI[] = [];
  today = new Date();

  readonly tipoReclamacionOpts = TIPO_RECLAMACION_OPTIONS;
  readonly tipoProblemaOpts = TIPO_PROBLEMA_OPTIONS;
  readonly causaReclamoOpts = CAUSA_RECLAMO_OPTIONS;
  readonly tipoDocumentoOpts = TIPO_DOCUMENTO_OPTIONS;

  campoInvalido = (campo: string) => campoInvalido(this.reclamoForm, campo, this.formSubmitted);

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.reclamoForm = this.fb.group({
      nombreCliente: ['', Validators.required],
      correoCliente: ['', Validators.email],
      telefonoCliente: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      tipoDocumentoCliente: [null],
      numeroDocumentoCliente: [''],
      tipoReclamacion: [null, Validators.required],
      tipoProblema: [null, Validators.required],
      causaReclamo: [null],
      descripcion: ['', Validators.required],
      montoReclamado: [null, Validators.min(0)],
      fechaOcurrencia: [null],
      notasInternas: [''],
    });
  }

  onSeleccionarArchivo(event: any): void {
    const files: File[] = Array.from(event.files);
    const validas = this.imageService.imagenesValidas(files);
    validas.forEach(file => {
      this.imagenes.push({
        file,
        preview: URL.createObjectURL(file),
        nombre: file.name,
        peso: this.imageService.obtenerReadableSize(file),
        tipo: 'nueva',
      });
    });
  }

  eliminarImagen(index: number): void {
    const img = this.imagenes[index];
    if (img.preview) URL.revokeObjectURL(img.preview);
    this.imagenes.splice(index, 1);
  }

  onCancelar(): void {
    this.formSubmitted = false;
    this.limpiarFormulario();
    this.cancelarEvento.emit();
  }

  onGuardar(): void {
    this.formSubmitted = true;
    if (this.reclamoForm.invalid) { marcarFormulario(this.reclamoForm); return; }

    const v = this.reclamoForm.value;
    const request: ReclamoRequest = {
      nombreCliente: v.nombreCliente,
      correoCliente: v.correoCliente || undefined,
      telefonoCliente: v.telefonoCliente || undefined,
      tipoDocumentoCliente: v.tipoDocumentoCliente ?? undefined,
      numeroDocumentoCliente: v.numeroDocumentoCliente || undefined,
      tipoReclamacion: v.tipoReclamacion,
      tipoProblema: v.tipoProblema,
      causaReclamo: v.causaReclamo ?? undefined,
      descripcion: v.descripcion,
      montoReclamado: v.montoReclamado ?? undefined,
      fechaOcurrencia: v.fechaOcurrencia ? this.toLocalDateTime(v.fechaOcurrencia as Date) : undefined,
      notasInternas: v.notasInternas || undefined,
    };

    const archivos = this.imagenes.map(i => i.file as File);
    this.guardar.emit({ request, archivos: archivos.length ? archivos : undefined });
  }

  private limpiarFormulario(): void {
    this.imagenes.forEach(img => { if (img.preview) URL.revokeObjectURL(img.preview); });
    this.imagenes = [];
    this.fileUpload?.clear();
    this.reclamoForm.reset();
    this.reclamoForm.markAsPristine();
    this.reclamoForm.markAsUntouched();
  }

  private toLocalDateTime(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T00:00:00`;
  }
}