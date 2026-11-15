import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Tag } from 'primereact/tag';
import { clienteService } from '../services/clienteService';
import { retroAudio } from '../utils/retroSound';

const EMPTY_CLIENTE = {
  id: null,
  nombre: '',
  apellido: '',
  documento: '',
  telefono: '',
  email: '',
};

export const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [cliente, setCliente] = useState(EMPTY_CLIENTE);
  const [isEditing, setIsEditing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const toastRef = useRef(null);

  // ── Cargar clientes ────────────────────────────────────────────────────────
  const loadClientes = async () => {
    setLoading(true);
    try {
      const data = await clienteService.getAll();
      setClientes(data);
    } catch (err) {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err?.response?.data?.message || 'No se pudieron cargar los clientes',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadClientes(); }, []);

  // ── Abrir diálogo ──────────────────────────────────────────────────────────
  const openNew = () => {
    setCliente(EMPTY_CLIENTE);
    setIsEditing(false);
    setSubmitted(false);
    setDialogVisible(true);
  };

  const openEdit = (row) => {
    setCliente({ ...row });
    setIsEditing(true);
    setSubmitted(false);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
    setSubmitted(false);
  };

  // ── Guardar / Actualizar ───────────────────────────────────────────────────
  const saveCliente = async () => {
    setSubmitted(true);
    if (!cliente.nombre.trim() || !cliente.apellido.trim() || !cliente.documento.trim()) return;

    try {
      if (isEditing) {
        await clienteService.update(cliente.id, cliente);
        toastRef.current?.show({ severity: 'success', summary: 'Actualizado', detail: 'Cliente actualizado correctamente', life: 2500 });
      } else {
        await clienteService.create(cliente);
        toastRef.current?.show({ severity: 'success', summary: 'Creado', detail: 'Cliente registrado correctamente', life: 2500 });
      }
      hideDialog();
      loadClientes();
    } catch (err) {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err?.response?.data?.message || 'Error al guardar el cliente',
        life: 3000,
      });
    }
  };

  // ── Eliminar ───────────────────────────────────────────────────────────────
  const confirmDelete = (row) => {
    confirmDialog({
      message: `¿Deseas eliminar al cliente "${row.nombre} ${row.apellido}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await clienteService.remove(row.id);
          toastRef.current?.show({ severity: 'success', summary: 'Eliminado', detail: 'Cliente eliminado', life: 2000 });
          loadClientes();
        } catch (err) {
          toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el cliente', life: 3000 });
        }
      },
    });
  };

  // ── Templates ──────────────────────────────────────────────────────────────
  const actionTemplate = (row) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" rounded text severity="info" onClick={() => openEdit(row)} tooltip="Editar" />
      <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => confirmDelete(row)} tooltip="Eliminar" />
    </div>
  );

  const nombreTemplate = (row) => (
    <span className="font-semibold">{row.nombre} {row.apellido}</span>
  );

  const header = (
    <div className="flex justify-content-between align-items-center gap-3 flex-wrap">
      <div className="flex align-items-center gap-2">
        <span style={{ fontSize: '1.3rem' }}>👥</span>
        <span className="arcade-font-pixel text-base" style={{ color: '#ffe600', textShadow: '1px 1px 0 #ff007f' }}>
          CLIENTES // PLAYER DIRECTORY
        </span>
      </div>
      <div className="flex gap-2 align-items-center">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            placeholder="Buscar cliente..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-14rem"
          />
        </span>
        <Button
          label="NUEVO CLIENTE"
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
      <Button label="Guardar" icon="pi pi-check" onClick={saveCliente} />
    </div>
  );

  const field = (label, id, value, field, required = false, type = 'text') => (
    <div className="field col-12 md:col-6">
      <label htmlFor={id} className="font-semibold mb-1 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <InputText
        id={id}
        value={value}
        onChange={(e) => setCliente(prev => ({ ...prev, [field]: e.target.value }))}
        className={`w-full ${submitted && required && !value.trim() ? 'p-invalid' : ''}`}
        type={type}
      />
      {submitted && required && !value.trim() && (
        <small className="p-error">Este campo es requerido</small>
      )}
    </div>
  );

  return (
    <div className="surface-card border-round shadow-1 p-4">
      <Toast ref={toastRef} position="top-right" />
      <ConfirmDialog />

      <DataTable
        value={clientes}
        loading={loading}
        header={header}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        globalFilter={globalFilter}
        emptyMessage="No se encontraron clientes"
        className="p-datatable-sm"
        stripedRows
      >
        <Column header="Nombre Completo" body={nombreTemplate} sortable />
        <Column field="documento" header="Documento" sortable />
        <Column field="telefono" header="Teléfono" />
        <Column field="email" header="Email" />
        <Column header="Acciones" body={actionTemplate} style={{ width: '8rem' }} />
      </DataTable>

      <Dialog
        visible={dialogVisible}
        style={{ width: '540px' }}
        header={isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
        modal
        onHide={hideDialog}
        footer={dialogFooter}
      >
        <div className="formgrid grid gap-0">
          {field('Nombre', 'nombre', cliente.nombre, 'nombre', true)}
          {field('Apellido', 'apellido', cliente.apellido, 'apellido', true)}
          {field('Documento', 'documento', cliente.documento, 'documento', true)}
          {field('Teléfono', 'telefono', cliente.telefono, 'telefono')}
          {field('Email', 'email', cliente.email, 'email', false, 'email')}
        </div>
      </Dialog>
    </div>
  );
};
