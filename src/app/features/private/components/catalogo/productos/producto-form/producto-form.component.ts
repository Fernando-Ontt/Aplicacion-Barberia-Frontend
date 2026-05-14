import { ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { TreeNode } from 'primeng/api';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from "primeng/select";
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TreeSelectModule } from 'primeng/treeselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { Producto, ProductoRequest } from '@/app/core/models/catalogos/productos.model';
import { Categoria } from '@/app/core/models/catalogos/categorias.model';
import { ImageUploadService } from '@/app/core/services/common/imageUpload.service';
import { ImagenProductoUI } from '@/app/core/models/common/imagen.model';
import { campoInvalido, marcarFormulario } from '@/app/shared/utils/form-utils.component';

@Component({
  selector: 'app-producto-form',
  imports: [ReactiveFormsModule, InputTextModule, SelectModule, CheckboxModule, TreeSelectModule,
    ButtonModule, MessageModule, ImageModule, FileUploadModule, InputNumberModule, TreeSelectModule],

  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css',
})
export class ProductoFormComponent implements OnChanges, OnInit {
  @Output() guardar = new EventEmitter<{ data: ProductoRequest, imagenes?: File[] | null }>();
  @Output() cancelarEvento = new EventEmitter<void>();
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @Input() producto: Producto | null = null;
  @Input() categorias: Categoria[] = [];
  @Input() resetTrigger: number = 0;

  private cd = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private fb: FormBuilder = inject(FormBuilder);
  private imageService = inject(ImageUploadService);

  abrirSelector = false;
  formSubmitted = false;
  productoForm!: FormGroup;
  categoriaTree: TreeNode[] = [];
  imagenesEliminada: string[] = [];
  imagenes: ImagenProductoUI[] = [];

  campoInvalido = (campo: string) => campoInvalido(this.productoForm, campo, this.formSubmitted);

  ngOnInit(): void {
    this.initForm();
    this.cargarCategoriasEnTree();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.productoForm) return;
    if (changes['resetTrigger'] && !changes['resetTrigger'].firstChange) { this.limpiarFormulario(); }
    if (changes['categorias'] || (changes['producto'] && !this.producto)) { this.cargarCategoriasEnTree(); }
    if (changes['producto']) {
      this.limpiarEstadoImagen();
      this.abrirSelector = false;
      if (this.producto?.urlsMultimedia?.length) { this.cargarImagenExistente(this.producto.urlsMultimedia); }
    }
    this.actualizarFormulario();
  }

  private initForm(): void {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      sku: ['', Validators.required],
      descripcion: [''],
      precioCompra: [0, Validators.required],
      precioVenta: [0, Validators.required],
      precioPromo: [null],
      stockMinimo: [0, Validators.required],
      puntosRecompensa: [0],
      publicado: [false],
      activo: [false],
      categoriaId: [null, Validators.required],
      atributos: this.fb.array([]),
      caracteristicas: [null, Validators.required]
    });
  }

  private cargarImagenExistente(urls: string[]): void {
    const observables = urls.map(url =>
      this.imageService.obtenerImagenProtegida(url).pipe(takeUntilDestroyed(this.destroyRef))
    );
    forkJoin(observables).subscribe(blobs => {
      blobs.forEach((blob, index) => {
        if (!blob) return;
        const file = new File([blob], `imagen-${index}.jpg`, { type: blob.type });
        this.imagenes.push({
          file,
          preview: URL.createObjectURL(blob),
          nombre: `Imagen actual`,
          peso: this.imageService.obtenerReadableSize(file),
          tipo: 'existente',
          urlOriginal: urls[index]
        });
      });
      this.cd.detectChanges();
    });
  }

  onCancelar(): void {
    this.formSubmitted = false;
    this.limpiarFormulario();
    this.abrirSelector = false;
    this.cancelarEvento.emit();
  }

  onGuardar(): void {
    this.formSubmitted = true;
    if (this.productoForm.invalid) {
      marcarFormulario(this.productoForm);
      return;
    }
    const archivos: File[] = this.imagenes.filter(img => img.file).map(img => img.file as File);
    const categoriaSeleccionada = this.productoForm.value.categoriaId;

    const data: ProductoRequest = {
      nombre: this.productoForm.value.nombre,
      descripcion: this.productoForm.value.descripcion,
      precio: this.productoForm.value.precioPromo,
      stock: this.productoForm.value.stockMinimo ?? 0,
      publicado: this.productoForm.value.publicado,
      estado: this.productoForm.value.activo,
      idCategoria: Number(categoriaSeleccionada.key),
      urlsMultimedia: [],
    };
    this.guardar.emit({ data, imagenes: archivos.length ? archivos : undefined });
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
        tipo: 'nueva'
      });
    });
  }

  eliminarImagen(index: number): void {
    const img = this.imagenes[index];
    if (img.preview) { URL.revokeObjectURL(img.preview); }
    if (img.tipo === 'existente' && img.urlOriginal) { this.imagenesEliminada.push(img.urlOriginal); }
    this.imagenes.splice(index, 1);
  }

  private limpiarFormulario(): void {
    this.formSubmitted = false;
    this.resetFormularioBase();
    this.productoForm.markAsPristine();
    this.productoForm.markAsUntouched();
  }

  private resetFormularioBase(): void {
    this.productoForm.reset({
      nombre: '',
      descripcion: '',
      precioCompra: 0,
      precioVenta: 0,
      precioPromo: null,
      stockMinimo: 0,
      puntosRecompensa: 0,
      publicado: false,
      activo: false,
      categoriaId: null,
      atributos: []
    });
    this.limpiarEstadoImagen();
  }

  private limpiarEstadoImagen(): void {
    this.imagenes.forEach(img => { if (img.preview) { URL.revokeObjectURL(img.preview); } });
    this.imagenes = [];
    this.imagenesEliminada = [];
    this.fileUpload?.clear();
  }

  private construirTree(categorias: Categoria[]): TreeNode[] {
    if (!Array.isArray(categorias)) { return []; }
    return categorias.map(categoria => ({
      label: categoria.nombre, key: String(categoria.id), data: categoria.id,
      children: categoria.subcategorias?.length ? this.construirTree(categoria.subcategorias) : []
    }));
  }

  cargarCategoriasEnTree(): void {
    this.categoriaTree = Array.isArray(this.categorias) ? this.construirTree(this.categorias) : [];
    this.cd.detectChanges();
  }

  private findTreeNodeById(nodes: TreeNode[], id: number): TreeNode | null {
    for (const node of nodes) {
      if (Number(node.key) === id) return node;
      if (node.children?.length) {
        const found = this.findTreeNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  private actualizarFormulario(): void {
    this.imagenesEliminada = [];
    if (this.producto) {
      this.productoForm.patchValue({
        nombre: this.producto.nombre,
        descripcion: this.producto.descripcion,
        precio: this.producto.precio,
        stock: this.producto.stock,
        publicado: this.producto.publicado,
        estado: this.producto.estado,
        categoriaId: null,
      });
    } else {
      this.resetFormularioBase();
    }
    this.productoForm.markAsPristine();
    this.productoForm.markAsUntouched();
  }

  private findNodesByKeys(nodes: TreeNode[], keys: string[]): TreeNode[] {
    let result: TreeNode[] = [];
    for (const node of nodes) {
      if (keys.includes(node.key!)) { result.push(node); }
      if (node.children?.length) { result = result.concat(this.findNodesByKeys(node.children, keys)); }
    }
    return result;
  }
}
