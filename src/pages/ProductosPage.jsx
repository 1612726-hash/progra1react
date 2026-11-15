import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { productoService } from '../services/productoService';
import { categoriaService } from '../services/categoriaService';
import { retroAudio } from '../utils/retroSound';

const EMPTY_PRODUCTO = {
  id: null,
  idProducto: null,
  nombre: '',
  codigo: '',
  codigoBarras: '',
  precio: 0.0,
  existencia: 0,
  stock: 0,
  categoria: null,
};

export const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoriaFilter, setSelectedCategoriaFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [producto, setProducto] = useState(EMPTY_PRODUCTO);
  const [isEditing, setIsEditing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [searchBarcode, setSearchBarcode] = useState('');
  const toastRef = useRef(null);

  // ── Cargar productos y categorías ──────────────────────────────────────────
  const loadCategorias = async () => {
    try {
      const data = await categoriaService.getAll();
      setCategorias(data || []);
    } catch {
      // En modo sin conexión o error de red
      setCategorias([]);
    }
  };

  const loadProductos = async (catId = selectedCategoriaFilter) => {
    setLoading(true);
    try {
      const data = await productoService.getAll(catId);
      setProductos(data || []);
    } catch (err) {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err?.response?.data?.mensaje || 'No se pudieron cargar los productos',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategorias();
    loadProductos();
  }, []);

  const handleCategoriaFilterChange = (catId) => {
    setSelectedCategoriaFilter(catId);
    loadProductos(catId);
  };

  // ── Búsqueda directa por código de barras ──────────────────────────────────
  const handleSearchByBarcode = async () => {
    if (!searchBarcode.trim()) {
      loadProductos(selectedCategoriaFilter);
      return;
    }
    setLoading(true);
    try {
      const item = await productoService.getByCodigo(searchBarcode.trim());
      if (item) {
        setProductos([item]);
        toastRef.current?.show({
          severity: 'info',
          summary: 'Encontrado',
          detail: `Producto: ${item.nombre}`,
          life: 2000,
        });
      } else {
        setProductos([]);
      }
    } catch {
      toastRef.current?.show({
        severity: 'warn',
        summary: 'No encontrado',
        detail: `No existe producto con código ${searchBarcode}`,
        life: 3000,
      });
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  // ── Abrir diálogo ──────────────────────────────────────────────────────────
  const openNew = () => {
    setProducto(EMPTY_PRODUCTO);
    setIsEditing(false);
    setSubmitted(false);
    setDialogVisible(true);
  };

  const openEdit = (row) => {
    setProducto({
      ...row,
      id: row.id || row.idProducto,
      codigo: row.codigo || row.codigoBarras || '',
      codigoBarras: row.codigo || row.codigoBarras || '',
      stock: row.existencia ?? row.stock ?? 0,
      existencia: row.existencia ?? row.stock ?? 0,
      categoria: row.categoria || null,
    });
    setIsEditing(true);
    setSubmitted(false);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
    setSubmitted(false);
  };

  // ── Guardar / Actualizar ───────────────────────────────────────────────────
  const saveProducto = async () => {
    setSubmitted(true);
    if (!producto.nombre?.trim() || !producto.codigo?.trim()) return;

    const payload = {
      id: producto.id,
      idProducto: producto.id,
      nombre: producto.nombre.trim(),
      codigo: producto.codigo.trim(),
      codigoBarras: producto.codigo.trim(),
      precio: producto.precio ?? 0,
      existencia: producto.existencia ?? producto.stock ?? 0,
      stock: producto.existencia ?? producto.stock ?? 0,
      categoria: producto.categoria ? { id: producto.categoria.id, nombre: producto.categoria.nombre } : null,
    };

    try {
      if (isEditing) {
        await productoService.update(producto.id, payload);
        toastRef.current?.show({
          severity: 'success',
          summary: 'Actualizado',
          detail: 'Producto actualizado con éxito',
          life: 2500,
        });
      } else {
        await productoService.create(payload);
        toastRef.current?.show({
          severity: 'success',
          summary: 'Creado',
          detail: 'Producto registrado con éxito',
          life: 2500,
        });
      }
      hideDialog();
      loadProductos(selectedCategoriaFilter);
    } catch (err) {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err?.response?.data?.mensaje || err?.response?.data?.message || 'Error al guardar el producto',
        life: 3000,
      });
    }
  };

  // ── Eliminar ───────────────────────────────────────────────────────────────
  const confirmDelete = (row) => {
    const id = row.id || row.idProducto;
    confirmDialog({
      message: `¿Deseas eliminar el producto "${row.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await productoService.remove(id);
          toastRef.current?.show({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Producto eliminado correctamente',
            life: 2000,
          });
          loadProductos(selectedCategoriaFilter);
        } catch {
          toastRef.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el producto',
            life: 3000,
          });
        }
      },
    });
  };

  // ── Templates de Tabla ─────────────────────────────────────────────────────
  const precioTemplate = (row) => {
    const val = row.precio ?? 0;
    return `$${Number(val).toFixed(2)}`;
  };

  const stockTemplate = (row) => {
    const stock = row.existencia ?? row.stock ?? 0;
    let severity = 'success';
    if (stock <= 0) severity = 'danger';
    else if (stock < 10) severity = 'warning';

    return <Tag value={`${stock} en stock`} severity={severity} />;
  };

  const categoriaTemplate = (row) => {
    return row.categoria?.nombre ? (
      <span className="font-medium text-primary">{row.categoria.nombre}</span>
    ) : (
      <span className="text-400 italic">Sin categoría</span>
    );
  };

  const actionTemplate = (row) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        onClick={() => openEdit(row)}
        tooltip="Editar producto"
      />
      <Button
        icon="pi pi-trash"
        rounded
        text
        severity="danger"
        onClick={() => confirmDelete(row)}
        tooltip="Eliminar producto"
      />
    </div>
  );

  const header = (
    <div className="flex flex-column gap-3">
      <div className="flex justify-content-between align-items-center flex-wrap gap-2">
        <div className="flex align-items-center gap-2">
          <span style={{ fontSize: '1.4rem' }}>📦</span>
          <span className="font-bold text-lg" style={{ color: '#0369a1' }}>
            Inventario de Productos y Cartuchos
          </span>
        </div>
        <Button
          label="Nuevo Producto"
          icon="pi pi-plus"
          onClick={() => {
            retroAudio.playCoin();
            openNew();
          }}
        />
      </div>

      <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
        <div className="flex gap-2 align-items-center flex-wrap">
          {/* Filtro por Categoría */}
          <Dropdown
            value={selectedCategoriaFilter}
            options={[{ label: 'Todas las categorías', value: null }, ...categorias.map(c => ({ label: c.nombre, value: c.id }))]}
            onChange={(e) => handleCategoriaFilterChange(e.value)}
            placeholder="Filtrar por categoría"
            className="w-14rem"
          />

          {/* Búsqueda por Código de Barras */}
          <div className="p-inputgroup w-16rem">
            <InputText
              placeholder="Código de barras..."
              value={searchBarcode}
              onChange={(e) => setSearchBarcode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchByBarcode()}
            />
            <Button icon="pi pi-search" onClick={handleSearchByBarcode} tooltip="Buscar código" />
            {searchBarcode && (
              <Button
                icon="pi pi-times"
                severity="secondary"
                text
                onClick={() => {
                  setSearchBarcode('');
                  loadProductos(selectedCategoriaFilter);
                }}
              />
            )}
          </div>
        </div>

        {/* Filtro global */}
        <span className="p-input-icon-left">
          <i className="pi pi-filter" />
          <InputText
            placeholder="Filtro rápido..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-12rem"
          />
        </span>
      </div>
    </div>
  );

  const dialogFooter = (
    <div className="flex justify-content-end gap-2">
      <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveProducto} />
    </div>
  );

  return (
    <div className="surface-card border-round shadow-1 p-4">
      <Toast ref={toastRef} position="top-right" />
      <ConfirmDialog />

      <DataTable
        value={productos}
        loading={loading}
        header={header}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        globalFilter={globalFilter}
        emptyMessage="No se encontraron productos registrados"
        className="p-datatable-sm"
        stripedRows
      >
        <Column field="idProducto" header="ID" sortable style={{ width: '4rem' }} body={(r) => r.idProducto || r.id} />
        <Column field="codigo" header="Código" sortable body={(r) => r.codigo || r.codigoBarras} />
        <Column field="nombre" header="Nombre del Producto" sortable />
        <Column header="Categoría" body={categoriaTemplate} sortable />
        <Column header="Precio" body={precioTemplate} sortable field="precio" />
        <Column header="Existencia" body={stockTemplate} sortable field="existencia" />
        <Column header="Acciones" body={actionTemplate} style={{ width: '7rem' }} />
      </DataTable>

      {/* Diálogo Crear / Editar Producto */}
      <Dialog
        visible={dialogVisible}
        style={{ width: '550px' }}
        header={isEditing ? 'Editar Producto' : 'Nuevo Producto'}
        modal
        onHide={hideDialog}
        footer={dialogFooter}
      >
        <div className="formgrid grid gap-3 pt-2">
          {/* Nombre */}
          <div className="field col-12">
            <label htmlFor="prodNombre" className="font-semibold mb-1 block">
              Nombre del Producto <span className="text-red-500">*</span>
            </label>
            <InputText
              id="prodNombre"
              value={producto.nombre}
              onChange={(e) => setProducto(prev => ({ ...prev, nombre: e.target.value }))}
              className={`w-full ${submitted && !producto.nombre?.trim() ? 'p-invalid' : ''}`}
              placeholder="Ej. Arroz Blanco 1kg"
            />
            {submitted && !producto.nombre?.trim() && (
              <small className="p-error">El nombre es requerido</small>
            )}
          </div>

          {/* Código de barras */}
          <div className="field col-12 md:col-6">
            <label htmlFor="prodCodigo" className="font-semibold mb-1 block">
              Código / Código de Barras <span className="text-red-500">*</span>
            </label>
            <InputText
              id="prodCodigo"
              value={producto.codigo}
              onChange={(e) => setProducto(prev => ({
                ...prev,
                codigo: e.target.value,
                codigoBarras: e.target.value,
              }))}
              className={`w-full ${submitted && !producto.codigo?.trim() ? 'p-invalid' : ''}`}
              placeholder="Ej. 750100012345"
            />
            {submitted && !producto.codigo?.trim() && (
              <small className="p-error">El código es requerido</small>
            )}
          </div>

          {/* Categoría */}
          <div className="field col-12 md:col-6">
            <label htmlFor="prodCat" className="font-semibold mb-1 block">
              Categoría
            </label>
            <Dropdown
              id="prodCat"
              value={producto.categoria?.id}
              options={categorias.map(c => ({ label: c.nombre, value: c.id }))}
              onChange={(e) => {
                const found = categorias.find(c => c.id === e.value);
                setProducto(prev => ({ ...prev, categoria: found || null }));
              }}
              placeholder="Seleccionar categoría"
              className="w-full"
              showClear
            />
          </div>

          {/* Precio */}
          <div className="field col-12 md:col-6">
            <label htmlFor="prodPrecio" className="font-semibold mb-1 block">
              Precio Unitario ($) <span className="text-red-500">*</span>
            </label>
            <InputNumber
              id="prodPrecio"
              value={producto.precio}
              onValueChange={(e) => setProducto(prev => ({ ...prev, precio: e.value ?? 0 }))}
              mode="currency"
              currency="USD"
              locale="en-US"
              min={0}
              className="w-full"
            />
          </div>

          {/* Existencia / Stock */}
          <div className="field col-12 md:col-6">
            <label htmlFor="prodStock" className="font-semibold mb-1 block">
              Existencia / Stock <span className="text-red-500">*</span>
            </label>
            <InputNumber
              id="prodStock"
              value={producto.existencia ?? producto.stock}
              onValueChange={(e) => setProducto(prev => ({
                ...prev,
                existencia: e.value ?? 0,
                stock: e.value ?? 0,
              }))}
              min={0}
              className="w-full"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};
