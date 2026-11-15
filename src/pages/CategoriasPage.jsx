import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { categoriaService } from '../services/categoriaService';

import { retroAudio } from '../utils/retroSound';

const EMPTY_CATEGORIA = { id: null, nombre: '', descripcion: '' };

export const CategoriasPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [categoria, setCategoria] = useState(EMPTY_CATEGORIA);
  const [isEditing, setIsEditing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const toastRef = useRef(null);

  const loadCategorias = async () => {
    setLoading(true);
    try {
      const data = await categoriaService.getAll();
      setCategorias(data);
    } catch {
      toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las categorías', life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCategorias(); }, []);

  const openNew = () => {
    setCategoria(EMPTY_CATEGORIA);
    setIsEditing(false);
    setSubmitted(false);
    setDialogVisible(true);
  };

  const openEdit = (row) => {
    setCategoria({ ...row });
    setIsEditing(true);
    setSubmitted(false);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
    setSubmitted(false);
  };

  const saveCategoria = async () => {
    setSubmitted(true);
    if (!categoria.nombre.trim()) return;

    try {
      if (isEditing) {
        await categoriaService.update(categoria.id, categoria);
        toastRef.current?.show({ severity: 'success', summary: 'Actualizado', detail: 'Categoría actualizada', life: 2500 });
      } else {
        await categoriaService.create(categoria);
        toastRef.current?.show({ severity: 'success', summary: 'Creado', detail: 'Categoría registrada', life: 2500 });
      }
      hideDialog();
      loadCategorias();
    } catch (err) {
      toastRef.current?.show({ severity: 'error', summary: 'Error', detail: err?.response?.data?.message || 'Error al guardar', life: 3000 });
    }
  };

  const confirmDelete = (row) => {
    confirmDialog({
      message: `¿Deseas eliminar la categoría "${row.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await categoriaService.remove(row.id);
          toastRef.current?.show({ severity: 'success', summary: 'Eliminado', detail: 'Categoría eliminada', life: 2000 });
          loadCategorias();
        } catch {
          toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la categoría', life: 3000 });
        }
      },
    });
  };

  const actionTemplate = (row) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" rounded text severity="info" onClick={() => openEdit(row)} tooltip="Editar" />
      <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => confirmDelete(row)} tooltip="Eliminar" />
    </div>
  );

  const header = (
    <div className="flex justify-content-between align-items-center gap-3 flex-wrap">
      <div className="flex align-items-center gap-2">
        <span style={{ fontSize: '1.3rem' }}>🏷️</span>
        <span className="font-bold text-lg" style={{ color: '#0369a1' }}>
          Categorías de Productos
        </span>
      </div>
      <div className="flex gap-2 align-items-center">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            placeholder="Buscar categoría..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-14rem"
          />
        </span>
        <Button
          label="Nueva Categoría"
          icon="pi pi-plus"
          onClick={() => {
            retroAudio.playCoin();
            openNew();
          }}
        />
      </div>
    </div>
  );

  const dialogFooter = (
    <div className="flex justify-content-end gap-2">
      <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveCategoria} />
    </div>
  );

  return (
    <div className="surface-card border-round shadow-1 p-4">
      <Toast ref={toastRef} position="top-right" />
      <ConfirmDialog />

      <DataTable
        value={categorias}
        loading={loading}
        header={header}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        globalFilter={globalFilter}
        emptyMessage="No se encontraron categorías"
        className="p-datatable-sm"
        stripedRows
      >
        <Column field="id" header="ID" sortable style={{ width: '5rem' }} />
        <Column field="nombre" header="Nombre" sortable />
        <Column field="descripcion" header="Descripción" />
        <Column header="Acciones" body={actionTemplate} style={{ width: '8rem' }} />
      </DataTable>

      <Dialog
        visible={dialogVisible}
        style={{ width: '450px' }}
        header={isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
        modal
        onHide={hideDialog}
        footer={dialogFooter}
      >
        <div className="flex flex-column gap-3 pt-2">
          <div className="field">
            <label htmlFor="catNombre" className="font-semibold mb-1 block">
              Nombre <span className="text-red-500">*</span>
            </label>
            <InputText
              id="catNombre"
              value={categoria.nombre}
              onChange={(e) => setCategoria(prev => ({ ...prev, nombre: e.target.value }))}
              className={`w-full ${submitted && !categoria.nombre.trim() ? 'p-invalid' : ''}`}
            />
            {submitted && !categoria.nombre.trim() && (
              <small className="p-error">El nombre es requerido</small>
            )}
          </div>

          <div className="field">
            <label htmlFor="catDesc" className="font-semibold mb-1 block">Descripción</label>
            <InputTextarea
              id="catDesc"
              value={categoria.descripcion}
              onChange={(e) => setCategoria(prev => ({ ...prev, descripcion: e.target.value }))}
              rows={3}
              className="w-full"
              autoResize
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};
