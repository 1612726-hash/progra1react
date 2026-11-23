import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { userService } from '../services/userService';
import { retroAudio } from '../utils/retroSound';
import { SpaceShipSprite, SpaceInvaderSprite, CartridgeSprite, PacmanSprite } from '../components/RetroSprites';

export const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, COMPRA, RENTA, USERS
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Ticket / Factura Detalle
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [ticketDialogVisible, setTicketDialogVisible] = useState(false);

  const toastRef = useRef(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, facturasRes] = await Promise.all([
        userService.getAll(),
        userService.getFacturas(),
      ]);

      const usersData = Array.isArray(usersRes) ? usersRes : usersRes?.content || [];
      const facturasData = Array.isArray(facturasRes) ? facturasRes : facturasRes?.content || [];

      setUsers(usersData);
      setFacturas(facturasData);
    } catch {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron sincronizar los datos de facturas y usuarios',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Totales calculados en tiempo real
  const facturasCompra = facturas.filter((f) => (f.tipo || 'COMPRA').toUpperCase() === 'COMPRA');
  const facturasRenta = facturas.filter((f) => (f.tipo || '').toUpperCase() === 'RENTA');

  const totalVentasMonto = facturasCompra.reduce((acc, curr) => acc + Number(curr.total || 0), 0);
  const totalRentasMonto = facturasRenta.reduce((acc, curr) => acc + Number(curr.total || 0), 0);
  const totalGeneralMonto = totalVentasMonto + totalRentasMonto;

  const facturasFiltradas = facturas.filter((f) => {
    const tipo = (f.tipo || 'COMPRA').toUpperCase();
    if (activeTab === 'COMPRA' && tipo !== 'COMPRA') return false;
    if (activeTab === 'RENTA' && tipo !== 'RENTA') return false;

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const num = (f.numeroFactura || `FAC-${f.id}`).toLowerCase();
    const clienteNom = `${f.cliente?.nombre || ''} ${f.cliente?.apellido || ''}`.toLowerCase();
    const cajero = (f.usuario?.username || '').toLowerCase();
    return num.includes(q) || clienteNom.includes(q) || cajero.includes(q);
  });

  const handleOpenTicket = (factura) => {
    retroAudio.playCoin();
    setSelectedFactura(factura);
    setTicketDialogVisible(true);
  };

  const handlePrint = () => {
    retroAudio.playVictory();
    window.print();
  };

  const formatFecha = (iso) => {
    if (!iso) return 'N/A';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="flex flex-column gap-4">
      <Toast ref={toastRef} position="top-right" />

      {/* Encabezado Aero Glass */}
      <div className="surface-card border-round-2xl p-4 flex flex-column md:flex-row md:align-items-center justify-content-between gap-3">
        <div className="flex align-items-center gap-3">
          <SpaceShipSprite size={44} />
          <div>
            <h2
              className="m-0 text-2xl font-bold"
              style={{ color: '#0f172a', letterSpacing: '-0.02em' }}
            >
              Registro de Facturas y Usuarios
            </h2>
            <div
              className="flex align-items-center gap-2 mt-1 text-sm"
              style={{ color: '#64748b' }}
            >
              <span>Control financiero, facturación electrónica de compras y rentas</span>
              <span className="arcade-blink-text" style={{ color: '#10b981', fontWeight: 600 }}>
                • Sistema Conectado
              </span>
            </div>
          </div>
        </div>

        <div className="flex align-items-center gap-3">
          <Button
            label="Sincronizar API"
            icon="pi pi-sync"
            loading={loading}
            outlined
            onClick={() => {
              retroAudio.playCoin();
              loadData();
            }}
          />
          <SpaceInvaderSprite size={32} color="#0284c7" />
        </div>
      </div>

      {/* Tarjetas de Métricas de Facturación con Estilo Aero Glass */}
      <div className="grid">
        <div className="col-12 sm:col-6 lg:col-3">
          <div
            className="surface-card p-3 border-round-2xl h-full"
            style={{
              background: 'linear-gradient(135deg, rgba(240, 249, 255, 0.85) 0%, rgba(224, 242, 254, 0.7) 100%)',
              border: '1px solid rgba(186, 230, 253, 0.9)',
            }}
          >
            <div className="flex justify-content-between align-items-center mb-1">
              <span className="text-xs font-bold" style={{ color: '#0284c7' }}>
                TOTAL FACTURADO
              </span>
              <i className="pi pi-dollar text-xl" style={{ color: '#0284c7' }} />
            </div>
            <div
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.2,
              }}
            >
              ${totalGeneralMonto.toFixed(2)}
            </div>
            <small className="block mt-1 font-medium text-xs" style={{ color: '#64748b' }}>
              {facturas.length} comprobantes emitidos en total
            </small>
          </div>
        </div>

        <div className="col-12 sm:col-6 lg:col-3">
          <div
            className="surface-card p-3 border-round-2xl h-full"
            style={{
              background: 'linear-gradient(135deg, rgba(240, 253, 244, 0.85) 0%, rgba(220, 252, 231, 0.7) 100%)',
              border: '1px solid rgba(187, 247, 208, 0.9)',
            }}
          >
            <div className="flex justify-content-between align-items-center mb-1">
              <span className="text-xs font-bold" style={{ color: '#15803d' }}>
                FACTURAS COMPRAS
              </span>
              <i className="pi pi-shopping-cart text-xl" style={{ color: '#15803d' }} />
            </div>
            <div
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#15803d',
                lineHeight: 1.2,
              }}
            >
              ${totalVentasMonto.toFixed(2)}
            </div>
            <small className="block mt-1 font-medium text-xs" style={{ color: '#64748b' }}>
              {facturasCompra.length} ventas directas registradas
            </small>
          </div>
        </div>

        <div className="col-12 sm:col-6 lg:col-3">
          <div
            className="surface-card p-3 border-round-2xl h-full"
            style={{
              background: 'linear-gradient(135deg, rgba(238, 242, 255, 0.85) 0%, rgba(224, 231, 255, 0.7) 100%)',
              border: '1px solid rgba(199, 210, 254, 0.9)',
            }}
          >
            <div className="flex justify-content-between align-items-center mb-1">
              <span className="text-xs font-bold" style={{ color: '#4338ca' }}>
                FACTURAS RENTAS
              </span>
              <i className="pi pi-clock text-xl" style={{ color: '#4338ca' }} />
            </div>
            <div
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#4338ca',
                lineHeight: 1.2,
              }}
            >
              ${totalRentasMonto.toFixed(2)}
            </div>
            <small className="block mt-1 font-medium text-xs" style={{ color: '#64748b' }}>
              {facturasRenta.length} alquileres de cartuchos
            </small>
          </div>
        </div>

        <div className="col-12 sm:col-6 lg:col-3">
          <div
            className="surface-card p-3 border-round-2xl h-full"
            style={{
              background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.85) 0%, rgba(253, 230, 138, 0.7) 100%)',
              border: '1px solid rgba(253, 230, 138, 0.9)',
            }}
          >
            <div className="flex justify-content-between align-items-center mb-1">
              <span className="text-xs font-bold" style={{ color: '#b45309' }}>
                CAJEROS ACTIVOS
              </span>
              <i className="pi pi-users text-xl" style={{ color: '#b45309' }} />
            </div>
            <div
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.2,
              }}
            >
              {users.length || 1}
            </div>
            <small className="block mt-1 font-medium text-xs" style={{ color: '#64748b' }}>
              Operadores del sistema POS
            </small>
          </div>
        </div>
      </div>

      {/* Pestañas de Acceso Rápido y Barra de Búsqueda */}
      <div className="surface-card border-round-2xl p-3 flex flex-column gap-3">
        <div className="flex flex-wrap justify-content-between align-items-center gap-3">
          {/* Tabs */}
          <div className="flex align-items-center gap-2 flex-wrap">
            <Button
              label={`Todas (${facturas.length})`}
              icon="pi pi-list"
              size="small"
              outlined={activeTab !== 'ALL'}
              severity="secondary"
              onClick={() => {
                retroAudio.playCoin();
                setActiveTab('ALL');
              }}
            />
            <Button
              label={`Compras (${facturasCompra.length})`}
              icon="pi pi-shopping-bag"
              size="small"
              outlined={activeTab !== 'COMPRA'}
              severity="success"
              onClick={() => {
                retroAudio.playCoin();
                setActiveTab('COMPRA');
              }}
            />
            <Button
              label={`Rentas (${facturasRenta.length})`}
              icon="pi pi-history"
              size="small"
              outlined={activeTab !== 'RENTA'}
              severity="danger"
              onClick={() => {
                retroAudio.playCoin();
                setActiveTab('RENTA');
              }}
            />
            <Button
              label={`Cajeros (${users.length})`}
              icon="pi pi-user"
              size="small"
              outlined={activeTab !== 'USERS'}
              onClick={() => {
                retroAudio.playCoin();
                setActiveTab('USERS');
              }}
            />
          </div>

          {/* Buscador */}
          {activeTab !== 'USERS' && (
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                placeholder="Buscar por factura, cliente o cajero..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-20rem"
              />
            </span>
          )}
        </div>
      </div>

      {/* Vista de Facturas (Compras & Rentas) */}
      {activeTab !== 'USERS' ? (
        <div className="surface-card border-round-2xl p-3">
          <DataTable
            value={facturasFiltradas}
            loading={loading}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 20]}
            emptyMessage={
              <div className="text-center p-5">
                <PacmanSprite size={40} />
                <p className="font-bold mt-3 text-base" style={{ color: '#0284c7' }}>
                  No se encontraron facturas registradas en esta vista.
                </p>
              </div>
            }
            responsiveLayout="scroll"
          >
            <Column
              field="numeroFactura"
              header="N.° FACTURA"
              body={(row) => (
                <span className="font-bold text-sm" style={{ color: '#0284c7' }}>
                  {row.numeroFactura || `FAC-${String(row.id).padStart(5, '0')}`}
                </span>
              )}
              sortable
            />

            <Column
              field="tipo"
              header="TIPO DE OPERACIÓN"
              body={(row) => {
                const esCompra = (row.tipo || 'COMPRA').toUpperCase() === 'COMPRA';
                return (
                  <Tag
                    value={esCompra ? 'Compra' : 'Renta'}
                    severity={esCompra ? 'success' : 'info'}
                  />
                );
              }}
              sortable
            />

            <Column
              field="fechaVenta"
              header="FECHA & HORA"
              body={(row) => (
                <span className="text-sm">{formatFecha(row.fechaVenta)}</span>
              )}
              sortable
            />

            <Column
              header="CLIENTE / SOCIO"
              body={(row) => (
                <div>
                  <div className="font-semibold text-sm">
                    {row.cliente?.nombre
                      ? `${row.cliente.nombre} ${row.cliente.apellido || ''}`
                      : 'Consumidor Final'}
                  </div>
                  {row.cliente?.documento && (
                    <small className="text-500">
                      Doc: {row.cliente.documento}
                    </small>
                  )}
                </div>
              )}
            />

            <Column
              header="MODALIDAD"
              body={(row) => {
                const esRenta = (row.tipo || '').toUpperCase() === 'RENTA';
                return (
                  <span className="text-xs font-medium" style={{ color: esRenta ? '#b45309' : '#15803d' }}>
                    {esRenta
                      ? `⏳ ${row.diasRenta || 1} día(s) de alquiler`
                      : '✓ Venta definitiva'}
                  </span>
                );
              }}
            />

            <Column
              field="total"
              header="TOTAL"
              body={(row) => (
                <span
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: '#0f172a',
                  }}
                >
                  ${Number(row.total || 0).toFixed(2)}
                </span>
              )}
              sortable
            />

            <Column
              header="OPERADOR"
              body={(row) => (
                <span className="text-xs font-semibold" style={{ color: '#0369a1' }}>
                  {row.usuario?.username ? `👤 ${row.usuario.username}` : 'admin'}
                </span>
              )}
            />

            <Column
              header="ACCIONES"
              body={(row) => (
                <Button
                  label="Ver Factura"
                  icon="pi pi-receipt"
                  size="small"
                  outlined
                  onClick={() => handleOpenTicket(row)}
                />
              )}
            />
          </DataTable>
        </div>
      ) : (
        /* Vista de Cajeros y Usuarios del Sistema */
        <div className="surface-card border-round-2xl p-3">
          <DataTable
            value={users}
            loading={loading}
            emptyMessage="No hay usuarios registrados"
            responsiveLayout="scroll"
          >
            <Column field="id" header="ID" style={{ width: '80px' }} />
            <Column
              field="username"
              header="USUARIO / OPERADOR"
              body={(row) => (
                <span className="font-bold text-sm" style={{ color: '#0284c7' }}>
                  {row.username}
                </span>
              )}
            />
            <Column
              header="ROLES"
              body={(row) => (
                <div className="flex gap-1 flex-wrap">
                  {row.roles?.map((r, i) => (
                    <Tag
                      key={i}
                      value={r.nombre || r}
                      severity="info"
                    />
                  ))}
                </div>
              )}
            />
            <Column
              field="activo"
              header="ESTADO"
              body={(row) => (
                <Tag
                  value={row.activo ? 'ACTIVO' : 'INACTIVO'}
                  severity={row.activo ? 'success' : 'danger'}
                />
              )}
            />
            <Column
              header="FACTURAS ASOCIADAS"
              body={(row) => {
                const count = facturas.filter((f) => f.usuario?.id === row.id).length;
                return (
                  <span className="font-semibold text-sm" style={{ color: '#0369a1' }}>
                    {count} emitidas
                  </span>
                );
              }}
            />
          </DataTable>
        </div>
      )}

      {/* Modal Comprobante / Factura Oficial en Estilo Aero Glass */}
      <Dialog
        visible={ticketDialogVisible}
        style={{ width: '460px', maxWidth: '95vw' }}
        header="Detalle de Factura Oficial"
        modal
        blockScroll
        draggable={false}
        resizable={false}
        onHide={() => setTicketDialogVisible(false)}
        footer={
          <div className="flex justify-content-between align-items-center w-full">
            <Button
              label="Imprimir Comprobante"
              icon="pi pi-print"
              onClick={handlePrint}
            />
            <Button
              label="Cerrar"
              icon="pi pi-times"
              text
              onClick={() => setTicketDialogVisible(false)}
            />
          </div>
        }
      >
        {selectedFactura && (
          <div
            className="p-4 border-round-2xl"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 249, 255, 0.9) 100%)',
              border: '1px solid rgba(186, 230, 253, 0.9)',
              boxShadow: '0 8px 24px rgba(2, 132, 199, 0.12)',
              color: '#1e293b',
            }}
          >
            {/* Cabecera del Ticket */}
            <div className="text-center pb-3 border-bottom-1 surface-border">
              <div className="flex justify-content-center mb-1">
                <PacmanSprite size={32} />
              </div>
              <h3
                className="m-0 text-lg font-bold"
                style={{ color: '#0f172a' }}
              >
                VIDEO CLUB AERO
              </h3>
              <div className="text-xs font-semibold" style={{ color: '#0284c7' }}>
                COMPRA & ALQUILER DE CARTUCHOS
              </div>
              <div className="text-xs text-500 mt-1">
                Comprobante Electrónico Válido
              </div>
            </div>

            {/* Datos de la Factura */}
            <div className="my-3 flex flex-column gap-2 text-xs">
              <div className="flex justify-content-between">
                <span className="text-500 font-semibold">N.° FACTURA:</span>
                <span className="font-bold" style={{ color: '#0284c7' }}>
                  {selectedFactura.numeroFactura || `FAC-${selectedFactura.id}`}
                </span>
              </div>
              <div className="flex justify-content-between">
                <span className="text-500 font-semibold">TIPO DE OPERACIÓN:</span>
                <span
                  className="font-bold"
                  style={{
                    color: selectedFactura.tipo === 'RENTA' ? '#0284c7' : '#15803d',
                  }}
                >
                  {selectedFactura.tipo === 'RENTA' ? 'ALQUILER / RENTA' : 'VENTA DIRECTA'}
                </span>
              </div>
              <div className="flex justify-content-between">
                <span className="text-500 font-semibold">FECHA DE EMISIÓN:</span>
                <span>{formatFecha(selectedFactura.fechaVenta)}</span>
              </div>
              <div className="flex justify-content-between">
                <span className="text-500 font-semibold">CLIENTE / SOCIO:</span>
                <span className="font-semibold">
                  {selectedFactura.cliente?.nombre
                    ? `${selectedFactura.cliente.nombre} ${selectedFactura.cliente.apellido || ''}`
                    : 'Consumidor Final'}
                </span>
              </div>
              {selectedFactura.cliente?.documento && (
                <div className="flex justify-content-between">
                  <span className="text-500 font-semibold">DOCUMENTO:</span>
                  <span>{selectedFactura.cliente.documento}</span>
                </div>
              )}
              {selectedFactura.tipo === 'RENTA' && selectedFactura.diasRenta && (
                <div className="flex justify-content-between" style={{ color: '#0369a1', fontWeight: 600 }}>
                  <span>TIEMPO RENTADO:</span>
                  <span>{selectedFactura.diasRenta} DÍAS</span>
                </div>
              )}
              <div className="flex justify-content-between">
                <span className="text-500 font-semibold">OPERADOR:</span>
                <span>{selectedFactura.usuario?.username || 'admin'}</span>
              </div>
            </div>

            <Divider className="my-2" />

            {/* Detalles de Ítems */}
            <div className="mb-3">
              <div className="flex justify-content-between font-bold text-xs pb-1 mb-2 border-bottom-1 surface-border" style={{ color: '#0369a1' }}>
                <span>PRODUCTO</span>
                <span>CANT x PRECIO</span>
                <span>SUBTOTAL</span>
              </div>

              {selectedFactura.detalles?.map((det, i) => (
                <div
                  key={i}
                  className="flex justify-content-between align-items-center mb-1 text-xs"
                >
                  <span className="text-overflow-ellipsis overflow-hidden font-medium" style={{ maxWidth: '170px' }}>
                    {det.producto?.nombre || 'Cartucho Clásico'}
                  </span>
                  <span className="text-500">
                    {det.cantidad} x ${Number(det.precioUnitario || 0).toFixed(2)}
                  </span>
                  <span className="font-bold">
                    ${Number(det.subtotal || 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <Divider className="my-2" />

            {/* Total */}
            <div className="flex justify-content-between align-items-center pt-2">
              <span className="font-bold text-sm" style={{ color: '#0f172a' }}>
                TOTAL PAGADO:
              </span>
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#15803d',
                }}
              >
                ${Number(selectedFactura.total || 0).toFixed(2)}
              </span>
            </div>

            {/* Pie del Ticket */}
            <div className="text-center mt-3 pt-2 border-top-1 surface-border">
              <div className="text-xs font-semibold" style={{ color: '#0284c7' }}>
                ¡Gracias por su preferencia!
              </div>
              <div className="text-xs text-400 mt-1">
                Conserve este comprobante para cualquier consulta.
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
