import { useState, useEffect, useRef, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { fetchFacturas, fetchUsers } from '../services/userService';
import { retroAudio } from '../utils/retroSound';
import { SpaceShipSprite, SpaceInvaderSprite, CartridgeSprite, PacmanSprite } from '../components/RetroSprites';

export const UsersPage = () => {
  const [facturas, setFacturas] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'COMPRA' | 'RENTA' | 'USERS'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [ticketDialogVisible, setTicketDialogVisible] = useState(false);
  const toastRef = useRef(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [facturasData, usersData] = await Promise.all([
        fetchFacturas(),
        fetchUsers().catch(() => []),
      ]);
      setFacturas(facturasData);
      setUsers(usersData);
    } catch (err) {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error al conectar con la API',
        detail: err.message || 'No se pudieron consultar las facturas del backend',
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Totales y Estadísticas
  const facturasCompra = facturas.filter((f) => (f.tipo || 'COMPRA').toUpperCase() === 'COMPRA');
  const facturasRenta = facturas.filter((f) => (f.tipo || '').toUpperCase() === 'RENTA');

  const totalVentasMonto = facturasCompra.reduce((acc, f) => acc + Number(f.total || 0), 0);
  const totalRentasMonto = facturasRenta.reduce((acc, f) => acc + Number(f.total || 0), 0);
  const totalGeneralMonto = facturas.reduce((acc, f) => acc + Number(f.total || 0), 0);

  // Filtro por Tab y Búsqueda
  const facturasFiltradas = facturas.filter((f) => {
    const tipo = (f.tipo || 'COMPRA').toUpperCase();
    if (activeTab === 'COMPRA' && tipo !== 'COMPRA') return false;
    if (activeTab === 'RENTA' && tipo !== 'RENTA') return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    const num = (f.numeroFactura || `FAC-${f.id}`).toLowerCase();
    const cliNombre = (f.cliente?.nombre || '').toLowerCase();
    const cliApellido = (f.cliente?.apellido || '').toLowerCase();
    const doc = (f.cliente?.documento || '').toLowerCase();
    const cajero = (f.usuario?.username || '').toLowerCase();

    return (
      num.includes(q) ||
      cliNombre.includes(q) ||
      cliApellido.includes(q) ||
      doc.includes(q) ||
      cajero.includes(q)
    );
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

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return 'N/D';
    try {
      const d = new Date(fechaStr);
      return isNaN(d.getTime()) ? fechaStr : d.toLocaleString();
    } catch {
      return fechaStr;
    }
  };

  return (
    <div className="flex flex-column gap-4">
      <Toast ref={toastRef} position="top-right" />

      {/* Encabezado Arcade */}
      <div className="surface-card border-round p-4 flex flex-column md:flex-row md:align-items-center justify-content-between gap-3">
        <div className="flex align-items-center gap-3">
          <SpaceShipSprite size={48} />
          <div>
            <h2
              className="arcade-font-pixel m-0 text-xl"
              style={{ color: '#ffe600', textShadow: '2px 2px 0 #ff007f' }}
            >
              REGISTRO DE FACTURAS (API)
            </h2>
            <div
              className="flex align-items-center gap-2 mt-2"
              style={{ fontFamily: "'VT323', monospace", fontSize: '1.25rem', color: '#00ffcc' }}
            >
              <span>&gt; FACTURACIÓN ELECTRÓNICA DE COMPRAS & RENTAS</span>
              <span className="arcade-blink-text" style={{ color: '#39ff14' }}>
                [SISTEMA POS CONECTADO]
              </span>
            </div>
          </div>
        </div>

        <div className="flex align-items-center gap-3">
          <Button
            label="SINCRONIZAR API"
            icon="pi pi-sync"
            loading={loading}
            outlined
            severity="info"
            onClick={() => {
              retroAudio.playCoin();
              loadData();
            }}
          />
          <SpaceInvaderSprite size={36} color="#00FFCC" />
        </div>
      </div>

      {/* Tarjetas de Métricas de Facturación */}
      <div className="grid">
        <div className="col-12 sm:col-6 lg:col-3">
          <div
            className="p-3 border-round h-full"
            style={{
              background: 'rgba(0, 255, 204, 0.08)',
              border: '2px solid #00ffcc',
              boxShadow: '0 0 10px rgba(0, 255, 204, 0.25)',
            }}
          >
            <div className="flex justify-content-between align-items-center mb-2">
              <span style={{ fontFamily: "'VT323', monospace", fontSize: '1.25rem', color: '#00ffcc' }}>
                TOTAL FACTURADO
              </span>
              <i className="pi pi-dollar text-xl" style={{ color: '#00ffcc' }} />
            </div>
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '1.2rem',
                color: '#ffe600',
              }}
            >
              ${totalGeneralMonto.toFixed(2)}
            </div>
            <small className="block mt-2" style={{ fontFamily: "'VT323', monospace", fontSize: '1.1rem', color: '#a89bc9' }}>
              {facturas.length} tickets emitidos en total
            </small>
          </div>
        </div>

        <div className="col-12 sm:col-6 lg:col-3">
          <div
            className="p-3 border-round h-full"
            style={{
              background: 'rgba(57, 255, 20, 0.08)',
              border: '2px solid #39ff14',
              boxShadow: '0 0 10px rgba(57, 255, 20, 0.25)',
            }}
          >
            <div className="flex justify-content-between align-items-center mb-2">
              <span style={{ fontFamily: "'VT323', monospace", fontSize: '1.25rem', color: '#39ff14' }}>
                FACTURAS COMPRAS
              </span>
              <i className="pi pi-shopping-cart text-xl" style={{ color: '#39ff14' }} />
            </div>
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '1.2rem',
                color: '#39ff14',
              }}
            >
              ${totalVentasMonto.toFixed(2)}
            </div>
            <small className="block mt-2" style={{ fontFamily: "'VT323', monospace", fontSize: '1.1rem', color: '#a89bc9' }}>
              {facturasCompra.length} ventas directas registradas
            </small>
          </div>
        </div>

        <div className="col-12 sm:col-6 lg:col-3">
          <div
            className="p-3 border-round h-full"
            style={{
              background: 'rgba(255, 0, 127, 0.08)',
              border: '2px solid #ff007f',
              boxShadow: '0 0 10px rgba(255, 0, 127, 0.25)',
            }}
          >
            <div className="flex justify-content-between align-items-center mb-2">
              <span style={{ fontFamily: "'VT323', monospace", fontSize: '1.25rem', color: '#ff007f' }}>
                FACTURAS RENTAS
              </span>
              <i className="pi pi-clock text-xl" style={{ color: '#ff007f' }} />
            </div>
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '1.2rem',
                color: '#ff007f',
              }}
            >
              ${totalRentasMonto.toFixed(2)}
            </div>
            <small className="block mt-2" style={{ fontFamily: "'VT323', monospace", fontSize: '1.1rem', color: '#a89bc9' }}>
              {facturasRenta.length} alquileres de cartuchos
            </small>
          </div>
        </div>

        <div className="col-12 sm:col-6 lg:col-3">
          <div
            className="p-3 border-round h-full"
            style={{
              background: 'rgba(255, 230, 0, 0.08)',
              border: '2px solid #ffe600',
              boxShadow: '0 0 10px rgba(255, 230, 0, 0.25)',
            }}
          >
            <div className="flex justify-content-between align-items-center mb-2">
              <span style={{ fontFamily: "'VT323', monospace", fontSize: '1.25rem', color: '#ffe600' }}>
                CAJEROS ACTIVOS
              </span>
              <i className="pi pi-users text-xl" style={{ color: '#ffe600' }} />
            </div>
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '1.2rem',
                color: '#ffe600',
              }}
            >
              {users.length || 1}
            </div>
            <small className="block mt-2" style={{ fontFamily: "'VT323', monospace", fontSize: '1.1rem', color: '#a89bc9' }}>
              Operadores del sistema POS
            </small>
          </div>
        </div>
      </div>

      {/* Pestañas de Acceso Rápido y Barra de Búsqueda */}
      <div className="surface-card border-round p-3 flex flex-column gap-3">
        <div className="flex flex-wrap justify-content-between align-items-center gap-3">
          {/* Tabs */}
          <div className="flex align-items-center gap-2 flex-wrap">
            <Button
              label={`TODAS (${facturas.length})`}
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
              label={`FACTURAS COMPRAS (${facturasCompra.length})`}
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
              label={`FACTURAS RENTAS (${facturasRenta.length})`}
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
              label={`CAJEROS (${users.length})`}
              icon="pi pi-user"
              size="small"
              outlined={activeTab !== 'USERS'}
              severity="info"
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
                placeholder="Buscar por N.° Factura, socio o cajero..."
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
        <div className="surface-card border-round p-3">
          <DataTable
            value={facturasFiltradas}
            loading={loading}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 20]}
            emptyMessage={
              <div className="text-center p-5">
                <PacmanSprite size={40} />
                <p className="arcade-font-pixel mt-3 text-sm" style={{ color: '#ff007f' }}>
                  NO SE ENCONTRARON FACTURAS REGISTRADAS
                </p>
              </div>
            }
            responsiveLayout="scroll"
          >
            <Column
              field="numeroFactura"
              header="N.° FACTURA"
              body={(row) => (
                <span
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '0.8rem',
                    color: '#ffe600',
                  }}
                >
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
                    value={esCompra ? '🛒 COMPRA' : '🕹️ RENTA'}
                    severity={esCompra ? 'success' : 'danger'}
                    style={{
                      fontFamily: "'VT323', monospace",
                      fontSize: '1.15rem',
                      letterSpacing: '1px',
                    }}
                  />
                );
              }}
              sortable
            />

            <Column
              field="fechaVenta"
              header="FECHA & HORA"
              body={(row) => (
                <span style={{ fontFamily: "'VT323', monospace", fontSize: '1.2rem' }}>
                  {formatFecha(row.fechaVenta)}
                </span>
              )}
              sortable
            />

            <Column
              header="SOCIO / CLIENTE"
              body={(row) => (
                <div>
                  <div className="font-bold" style={{ color: '#00ffcc' }}>
                    {row.cliente?.nombre
                      ? `${row.cliente.nombre} ${row.cliente.apellido || ''}`
                      : 'Consumidor Final'}
                  </div>
                  {row.cliente?.documento && (
                    <small className="text-400" style={{ fontFamily: "'VT323', monospace", fontSize: '1.1rem' }}>
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
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: '1.2rem', color: esRenta ? '#ff007f' : '#a89bc9' }}>
                    {esRenta
                      ? `⏳ ${row.diasRenta || 1} días de alquiler`
                      : '★ Venta definitiva'}
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
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '0.95rem',
                    color: '#ffe600',
                    textShadow: '0 0 6px rgba(255, 230, 0, 0.4)',
                  }}
                >
                  ${Number(row.total || 0).toFixed(2)}
                </span>
              )}
              sortable
            />

            <Column
              header="ATENDIDO POR"
              body={(row) => (
                <span style={{ fontFamily: "'VT323', monospace", fontSize: '1.15rem', color: '#00ffcc' }}>
                  {row.usuario?.username ? `👤 ${row.usuario.username}` : 'admin'}
                </span>
              )}
            />

            <Column
              header="ACCIONES"
              body={(row) => (
                <Button
                  label="VER FACTURA"
                  icon="pi pi-receipt"
                  size="small"
                  outlined
                  severity="help"
                  onClick={() => handleOpenTicket(row)}
                />
              )}
            />
          </DataTable>
        </div>
      ) : (
        /* Vista de Cajeros y Usuarios del Sistema */
        <div className="surface-card border-round p-3">
          <DataTable
            value={users}
            loading={loading}
            emptyMessage="No hay usuarios registrados"
            responsiveLayout="scroll"
          >
            <Column field="id" header="ID" style={{ width: '80px' }} />
            <Column
              field="username"
              header="USUARIO / CAJERO"
              body={(row) => (
                <span
                  className="font-bold"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '0.8rem',
                    color: '#00ffcc',
                  }}
                >
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
                      style={{ fontFamily: "'VT323', monospace", fontSize: '1.1rem' }}
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
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: '1.25rem', color: '#ffe600' }}>
                    {count} emitidas
                  </span>
                );
              }}
            />
          </DataTable>
        </div>
      )}

      {/* Modal Ticket Retro Arcade de la Factura */}
      <Dialog
        visible={ticketDialogVisible}
        style={{ width: '450px' }}
        header="DETALLE DE FACTURA OFICIAL"
        modal
        onHide={() => setTicketDialogVisible(false)}
        footer={
          <div className="flex justify-content-between align-items-center w-full">
            <Button
              label="IMPRIMIR TICKET"
              icon="pi pi-print"
              severity="success"
              onClick={handlePrint}
            />
            <Button
              label="CERRAR"
              icon="pi pi-times"
              text
              onClick={() => setTicketDialogVisible(false)}
            />
          </div>
        }
      >
        {selectedFactura && (
          <div
            className="p-3 border-round"
            style={{
              background: '#0a0518',
              border: '2px dashed #00ffcc',
              fontFamily: "'VT323', monospace",
              color: '#fff',
            }}
          >
            {/* Cabecera del Ticket */}
            <div className="text-center pb-2 border-bottom-1 surface-border">
              <h3
                className="arcade-font-pixel m-0 text-base"
                style={{ color: '#ffe600', letterSpacing: '1px' }}
              >
                ★ VIDEO CLUB RETRO ★
              </h3>
              <div style={{ fontSize: '1.1rem', color: '#00ffcc' }}>
                COMPRA & ALQUILER DE CARTUCHOS
              </div>
              <div style={{ fontSize: '1rem', color: '#a89bc9' }}>
                TEL: 7123-4567 • EL SALVADOR
              </div>
            </div>

            {/* Datos de la Factura */}
            <div className="my-3 flex flex-column gap-1 text-sm" style={{ fontSize: '1.15rem' }}>
              <div className="flex justify-content-between">
                <span className="text-400">N.° FACTURA:</span>
                <span style={{ color: '#ffe600', fontWeight: 'bold' }}>
                  {selectedFactura.numeroFactura || `FAC-${selectedFactura.id}`}
                </span>
              </div>
              <div className="flex justify-content-between">
                <span className="text-400">TIPO DE OPERACIÓN:</span>
                <span
                  style={{
                    color:
                      selectedFactura.tipo === 'RENTA' ? '#ff007f' : '#39ff14',
                    fontWeight: 'bold',
                  }}
                >
                  {selectedFactura.tipo === 'RENTA' ? 'ALQUILER / RENTA' : 'COMPRA DEFINITIVA'}
                </span>
              </div>
              <div className="flex justify-content-between">
                <span className="text-400">FECHA DE EMISIÓN:</span>
                <span>{formatFecha(selectedFactura.fechaVenta)}</span>
              </div>
              <div className="flex justify-content-between">
                <span className="text-400">SOCIO / CLIENTE:</span>
                <span style={{ color: '#00ffcc' }}>
                  {selectedFactura.cliente?.nombre
                    ? `${selectedFactura.cliente.nombre} ${selectedFactura.cliente.apellido || ''}`
                    : 'Consumidor Final'}
                </span>
              </div>
              {selectedFactura.cliente?.documento && (
                <div className="flex justify-content-between">
                  <span className="text-400">DOCUMENTO:</span>
                  <span>{selectedFactura.cliente.documento}</span>
                </div>
              )}
              {selectedFactura.tipo === 'RENTA' && selectedFactura.diasRenta && (
                <div className="flex justify-content-between" style={{ color: '#ff007f' }}>
                  <span>TIEMPO RENTADO:</span>
                  <span>{selectedFactura.diasRenta} DÍAS</span>
                </div>
              )}
              <div className="flex justify-content-between">
                <span className="text-400">CAJERO:</span>
                <span>{selectedFactura.usuario?.username || 'admin'}</span>
              </div>
            </div>

            <Divider className="my-2" />

            {/* Detalles de Ítems */}
            <div className="mb-3">
              <div
                className="flex justify-content-between font-bold border-bottom-1 surface-border pb-1 mb-2"
                style={{ fontSize: '1.2rem', color: '#ffe600' }}
              >
                <span>CARTUCHO / ÍTEM</span>
                <span>CANT x PRECIO</span>
                <span>SUBTOTAL</span>
              </div>

              {selectedFactura.detalles?.map((det, i) => (
                <div
                  key={i}
                  className="flex justify-content-between align-items-center mb-1 text-sm"
                  style={{ fontSize: '1.15rem' }}
                >
                  <span className="text-overflow-ellipsis overflow-hidden" style={{ maxWidth: '180px' }}>
                    {det.producto?.nombre || 'Cartucho Retro'}
                  </span>
                  <span>
                    {det.cantidad} x ${Number(det.precioUnitario || 0).toFixed(2)}
                  </span>
                  <span style={{ color: '#00ffcc' }}>
                    ${Number(det.subtotal || 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <Divider className="my-2" />

            {/* Total */}
            <div className="flex justify-content-between align-items-center pt-2">
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '0.85rem',
                  color: '#00ffcc',
                }}
              >
                TOTAL PAGADO:
              </span>
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '1.3rem',
                  color: '#ffe600',
                  textShadow: '0 0 10px rgba(255, 230, 0, 0.6)',
                }}
              >
                ${Number(selectedFactura.total || 0).toFixed(2)}
              </span>
            </div>

            {/* Pie del Ticket */}
            <div className="text-center mt-4 pt-2 border-top-1 surface-border">
              <div style={{ color: '#ffe600', fontSize: '1.2rem' }}>
                ¡GRACIAS POR SU PREFERENCIA!
              </div>
              <div style={{ color: '#a89bc9', fontSize: '1rem' }}>
                *** CONSERVE ESTE COMPROBANTE ***
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
