import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { productoService } from '../services/productoService';
import { categoriaService } from '../services/categoriaService';
import { clienteService } from '../services/clienteService';
import { createFactura } from '../services/userService';
import { retroAudio } from '../utils/retroSound';
import { PacmanSprite, GhostSprite, CartridgeSprite } from '../components/RetroSprites';

export const RentarPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal de Renta
  const [rentDialogVisible, setRentDialogVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [diasRenta, setDiasRenta] = useState(3);
  const toastRef = useRef(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats, clis] = await Promise.all([
        productoService.getAll(selectedCat),
        categoriaService.getAll().catch(() => []),
        clienteService.getAll().catch(() => []),
      ]);
      setProductos(prods || []);
      setCategorias(cats || []);
      setClientes(clis || []);
    } catch {
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCat]);

  const filteredProductos = productos.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = (p.nombre || '').toLowerCase();
    const code = (p.codigo || p.codigoBarras || '').toLowerCase();
    const catName = (p.categoria?.nombre || '').toLowerCase();
    return name.includes(q) || code.includes(q) || catName.includes(q);
  });

  const getTarifaDia = (prod) => {
    if (!prod) return 2.0;
    const base = Number(prod.precio || 20);
    return Math.max(1.5, Number((base * 0.1).toFixed(2)));
  };

  /**
   * Calcula el costo total de la renta.
   * Conforme aumentan los días de alquiler, sube el costo base diario
   * y se aplica un recargo progresivo por conservación para días extendidos (> 3 días).
   */
  const calcularTotalRenta = (prod, dias) => {
    if (!prod || !dias || dias <= 0) return 0;
    const tarifaDia = getTarifaDia(prod);
    const costoBase = tarifaDia * dias;
    // Si son más de 3 días, se añade un pequeño incremento de $0.75 por cada día adicional
    const recargoDiasExtra = dias > 3 ? (dias - 3) * 0.75 : 0;
    return Number((costoBase + recargoDiasExtra).toFixed(2));
  };

  const handleOpenRent = (prod) => {
    retroAudio.playCoin();
    setSelectedProduct(prod);
    setDiasRenta(3);
    setSelectedCliente(clientes[0]?.id || null);
    setRentDialogVisible(true);
  };

  const handleConfirmRent = async () => {
    try {
      const total = calcularTotalRenta(selectedProduct, diasRenta);
      const tarifaDia = getTarifaDia(selectedProduct);
      const facturaData = {
        tipo: 'RENTA',
        diasRenta,
        cliente: selectedCliente ? { id: selectedCliente } : (clientes[0] ? { id: clientes[0].id } : null),
        total,
        detalles: [
          {
            producto: { id: selectedProduct.id || selectedProduct.idProducto },
            cantidad: 1,
            precioUnitario: tarifaDia,
            subtotal: total,
          },
        ],
      };

      const res = await createFactura(facturaData);
      retroAudio.playVictory();
      setRentDialogVisible(false);
      toastRef.current?.show({
        severity: 'success',
        summary: '¡RENTA REGISTRADA! 🕹️',
        detail: `Factura ${res.numeroFactura || ''}: ${selectedProduct.nombre} por ${diasRenta} días. Total: $${total.toFixed(2)}`,
        life: 3500,
      });
      loadData();
    } catch (err) {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error al registrar renta',
        detail: err.response?.data?.error || err.message || 'No se pudo generar la factura de renta',
        life: 4000,
      });
    }
  };

  return (
    <div className="flex flex-column gap-4">
      <Toast ref={toastRef} position="top-right" />

      {/* Encabezado con Pac-Man y Fantasmas Retro */}
      <div className="surface-card border-round p-4 flex flex-column md:flex-row md:align-items-center justify-content-between gap-3">
        <div className="flex align-items-center gap-3">
          <PacmanSprite size={48} />
          <div>
            <h2
              className="arcade-font-pixel m-0 text-xl"
              style={{ color: '#ffe600', textShadow: '2px 2px 0 #ff007f' }}
            >
              RENTAR CARTUCHOS DE VIDEOJUEGOS
            </h2>
            <div
              className="flex align-items-center gap-2 mt-2"
              style={{ fontFamily: "'VT323', monospace", fontSize: '1.25rem', color: '#00ffcc' }}
            >
              <span>&gt; ALQUILER DIARIO & FINES DE SEMANA</span>
              <span className="arcade-blink-text" style={{ color: '#ff007f' }}>[DISPONIBLE HOY]</span>
            </div>
          </div>
        </div>

        {/* Desfile Pacman comiendo puntos y fantasmas */}
        <div className="flex align-items-center gap-2 flex-wrap">
          <span style={{ color: '#ffe600', fontSize: '1.2rem', letterSpacing: '4px' }}>
            ● ● ●
          </span>
          <GhostSprite size={36} color="#FF0000" />
          <GhostSprite size={36} color="#FF007F" />
          <GhostSprite size={36} color="#00FFCC" />
          <GhostSprite size={36} color="#FFB852" />
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="surface-card border-round p-3 flex flex-column gap-3">
        <div className="flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="flex align-items-center gap-2 flex-wrap">
            <Dropdown
              value={selectedCat}
              options={[
                { label: '★ Todas las consolas', value: null },
                ...categorias.map((c) => ({ label: `🎮 ${c.nombre}`, value: c.id })),
              ]}
              onChange={(e) => {
                retroAudio.playCoin();
                setSelectedCat(e.value);
              }}
              placeholder="Filtrar por consola"
              className="w-16rem"
            />

            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                placeholder="Buscar por juego, código o consola..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-20rem"
              />
            </span>
          </div>

          <div style={{ fontFamily: "'VT323', monospace", fontSize: '1.25rem', color: '#00ffcc' }}>
            TÍTULOS DISPONIBLES EN CLUB: <strong>{filteredProductos.length}</strong>
          </div>
        </div>

        {/* Botones de consolas retro */}
        <div className="flex align-items-center gap-2 flex-wrap pt-2 border-top-1 surface-border">
          <span
            style={{ fontFamily: "'VT323', monospace", fontSize: '1.15rem', color: '#ffe600' }}
            className="mr-2"
          >
            CONSOLAS DISPONIBLES:
          </span>
          <Button
            label="Todas"
            icon="pi pi-th-large"
            size="small"
            outlined={selectedCat !== null || searchQuery !== ''}
            severity="secondary"
            onClick={() => {
              retroAudio.playCoin();
              setSelectedCat(null);
              setSearchQuery('');
            }}
          />
          {['Super Nintendo', 'Sega Genesis', 'Arcade'].map((consolaNombre) => {
            const catObj = categorias.find(
              (c) => c.nombre?.toLowerCase() === consolaNombre.toLowerCase()
            );
            const isSelected =
              (catObj && selectedCat === catObj.id) ||
              searchQuery.toLowerCase() === consolaNombre.toLowerCase();

            return (
              <Button
                key={consolaNombre}
                label={consolaNombre}
                icon="pi pi-play"
                size="small"
                outlined={!isSelected}
                severity={
                  consolaNombre === 'Super Nintendo'
                    ? 'danger'
                    : consolaNombre === 'Sega Genesis'
                    ? 'info'
                    : 'warning'
                }
                onClick={() => {
                  retroAudio.playCoin();
                  if (catObj) {
                    setSelectedCat(catObj.id);
                  } else {
                    setSearchQuery(consolaNombre);
                  }
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Grid de Cartuchos para Renta */}
      <div className="grid">
        {filteredProductos.length === 0 ? (
          <div className="col-12 text-center p-6 surface-card border-round">
            <p className="arcade-font-pixel text-sm" style={{ color: '#ffe600' }}>
              NO HAY TÍTULOS DISPONIBLES EN ESTA SECCIÓN
            </p>
          </div>
        ) : (
          filteredProductos.map((prod) => {
            const stock = prod.existencia ?? prod.stock ?? 0;
            const tarifaDia = getTarifaDia(prod);
            const isOutOfStock = stock <= 0;

            return (
              <div key={prod.id || prod.idProducto} className="col-12 sm:col-6 lg:col-4 xl:col-3">
                <Card className="h-full flex flex-column justify-content-between transition-transform transition-duration-150 hover:scale-102">
                  <div className="text-center mb-3">
                    <CartridgeSprite size={70} color="#FF007F" />
                    <h3
                      className="arcade-font-pixel mt-3 mb-1 text-sm text-overflow-ellipsis overflow-hidden"
                      style={{ color: '#ffe600', minHeight: '2.4rem' }}
                      title={prod.nombre}
                    >
                      {prod.nombre}
                    </h3>
                    <div
                      style={{ fontFamily: "'VT323', monospace", fontSize: '1.15rem', color: '#ff007f' }}
                    >
                      {prod.categoria?.nombre || 'EDICIÓN COLECCIÓN'}
                    </div>
                  </div>

                  <div className="border-top-1 surface-border pt-3 mt-auto">
                    <div className="flex justify-content-between align-items-center mb-3">
                      <div>
                        <span className="block text-xs" style={{ fontFamily: "'VT323', monospace", color: '#a89bc9' }}>
                          TARIFA POR DÍA
                        </span>
                        <span
                          style={{
                            fontFamily: "'Press Start 2P', monospace",
                            fontSize: '1.05rem',
                            color: '#00ffcc',
                            textShadow: '0 0 8px rgba(0, 255, 204, 0.4)',
                          }}
                        >
                          ${tarifaDia.toFixed(2)}
                        </span>
                      </div>

                      <Tag
                        value={isOutOfStock ? 'ALQUILADO' : 'PARA RENTA'}
                        severity={isOutOfStock ? 'danger' : 'info'}
                      />
                    </div>

                    <Button
                      label={isOutOfStock ? 'NO DISPONIBLE' : '🕹️ RENTAR AHORA'}
                      icon="pi pi-clock"
                      className="w-full"
                      severity="secondary"
                      disabled={isOutOfStock}
                      onClick={() => handleOpenRent(prod)}
                    />
                  </div>
                </Card>
              </div>
            );
          })
        )}
      </div>

      {/* Diálogo de Confirmación de Renta */}
      <Dialog
        visible={rentDialogVisible}
        style={{ width: '500px' }}
        header="REGISTRO DE ALQUILER DE CARTUCHO"
        modal
        onHide={() => setRentDialogVisible(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button
              label="CANCELAR"
              icon="pi pi-times"
              text
              onClick={() => setRentDialogVisible(false)}
            />
            <Button
              label="AUTORIZAR RENTA"
              icon="pi pi-check"
              onClick={handleConfirmRent}
            />
          </div>
        }
      >
        {selectedProduct && (
          <div className="flex flex-column gap-3 pt-2">
            <div className="flex align-items-center gap-3 surface-100 dark:surface-800 p-3 border-round">
              <PacmanSprite size={40} />
              <div>
                <span className="arcade-font-pixel block text-sm" style={{ color: '#ffe600' }}>
                  {selectedProduct.nombre}
                </span>
                <span style={{ fontFamily: "'VT323', monospace", fontSize: '1.2rem', color: '#00ffcc' }}>
                  Tarifa: ${getTarifaDia(selectedProduct).toFixed(2)} / día
                </span>
              </div>
            </div>

            <div className="field">
              <label className="block mb-1 font-semibold" style={{ fontFamily: "'VT323', monospace", fontSize: '1.2rem' }}>
                Socio que retira el cartucho:
              </label>
              <Dropdown
                value={selectedCliente}
                options={clientes.map((c) => ({ label: `Socio: ${c.nombre} ${c.apellido}`, value: c.id }))}
                onChange={(e) => setSelectedCliente(e.value)}
                placeholder="Seleccionar socio registrado"
                className="w-full"
              />
            </div>

            <div className="field">
              <div className="flex justify-content-between align-items-center mb-1">
                <label className="font-semibold" style={{ fontFamily: "'VT323', monospace", fontSize: '1.25rem' }}>
                  Días de alquiler:
                </label>
                <span style={{ fontFamily: "'VT323', monospace", fontSize: '1.1rem', color: '#ffe600' }}>
                  {diasRenta > 3 ? '⚡ Tarifa con recargo extendido' : '★ Tarifa estándar'}
                </span>
              </div>

              {/* Control interactivo con botones +/- para aumentar los días */}
              <div className="flex align-items-center gap-2 mb-2">
                <Button
                  type="button"
                  icon="pi pi-minus"
                  className="p-button-outlined"
                  disabled={diasRenta <= 1}
                  onClick={() => {
                    retroAudio.playCoin();
                    setDiasRenta((prev) => Math.max(1, prev - 1));
                  }}
                />
                <div
                  className="surface-200 dark:surface-700 px-3 py-2 border-round text-center font-bold flex-1"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '0.85rem',
                    color: '#00ffcc',
                    letterSpacing: '1px',
                  }}
                >
                  {diasRenta} {diasRenta === 1 ? 'DÍA' : 'DÍAS'}
                </div>
                <Button
                  type="button"
                  icon="pi pi-plus"
                  className="p-button-outlined"
                  disabled={diasRenta >= 60}
                  onClick={() => {
                    retroAudio.playCoin();
                    setDiasRenta((prev) => prev + 1);
                  }}
                />
              </div>

              {/* Botones de selección rápida (Presets) */}
              <div className="flex gap-1 flex-wrap">
                {[
                  { label: '1 Día', val: 1 },
                  { label: '3 Días', val: 3 },
                  { label: '5 Días', val: 5 },
                  { label: '7 Días (1 Sem)', val: 7 },
                  { label: '15 Días (Quincena)', val: 15 },
                  { label: '30 Días (Mes)', val: 30 },
                ].map((item) => (
                  <Button
                    key={item.val}
                    type="button"
                    label={item.label}
                    size="small"
                    outlined={diasRenta !== item.val}
                    severity={diasRenta === item.val ? 'warning' : 'secondary'}
                    onClick={() => {
                      retroAudio.playCoin();
                      setDiasRenta(item.val);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Desglose de Costo en tiempo real */}
            <div className="border-top-1 surface-border pt-3 flex flex-column gap-2">
              <div
                className="flex justify-content-between"
                style={{ fontFamily: "'VT323', monospace", fontSize: '1.2rem', color: '#a89bc9' }}
              >
                <span>Costo base ({diasRenta} días x ${getTarifaDia(selectedProduct).toFixed(2)}):</span>
                <span>${(getTarifaDia(selectedProduct) * diasRenta).toFixed(2)}</span>
              </div>

              {diasRenta > 3 && (
                <div
                  className="flex justify-content-between"
                  style={{ fontFamily: "'VT323', monospace", fontSize: '1.2rem', color: '#ff007f' }}
                >
                  <span>+ Recargo por tiempo extendido ({diasRenta - 3} días extra x $0.75):</span>
                  <span>+${((diasRenta - 3) * 0.75).toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-content-between align-items-center mt-2 pt-2 border-top-1 surface-border">
                <div>
                  <span className="arcade-font-pixel text-xs block" style={{ color: '#00ffcc' }}>
                    TOTAL A PAGAR:
                  </span>
                  <small style={{ fontFamily: "'VT323', monospace", fontSize: '1rem', color: '#ffe600' }}>
                    {diasRenta} días de alquiler
                  </small>
                </div>
                <span
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '1.35rem',
                    color: '#ffe600',
                    textShadow: '0 0 10px rgba(255, 230, 0, 0.5)',
                  }}
                >
                  ${calcularTotalRenta(selectedProduct, diasRenta).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
