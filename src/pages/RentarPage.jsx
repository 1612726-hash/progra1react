import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { productoService } from '../services/productoService';
import { categoriaService } from '../services/categoriaService';
import { clienteService } from '../services/clienteService';
import { retroAudio } from '../utils/retroSound';
import { PacmanSprite, GhostSprite, CartridgeSprite } from '../components/RetroSprites';

export const RentarPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [selectedCat, setSelectedCat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal de Renta
  const [rentDialogVisible, setRentDialogVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [diasRenta, setDiasRenta] = useState(1);

  const toastRef = useRef(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, cliRes] = await Promise.all([
        productoService.getAll(),
        categoriaService.getAll(),
        clienteService.getAll(),
      ]);

      const prodData = Array.isArray(prodRes) ? prodRes : prodRes?.content || [];
      const catData = Array.isArray(catRes) ? catRes : catRes?.content || [];
      const cliData = Array.isArray(cliRes) ? cliRes : cliRes?.content || [];

      setProductos(prodData);
      setCategorias(catData);
      setClientes(cliData);
    } catch {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los datos de alquiler',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getTarifaDia = (prod) => {
    const base = Number(prod.precio || 20);
    return Math.max(1.0, +(base * 0.08).toFixed(2));
  };

  const calcularTotalRenta = (prod, dias) => {
    if (!prod) return 0;
    const baseDia = getTarifaDia(prod);
    let total = baseDia * dias;
    if (dias > 3) {
      total += (dias - 3) * 0.75;
    }
    return Math.round(total * 100) / 100;
  };

  const handleOpenRent = (prod) => {
    retroAudio.playCoin();
    setSelectedProduct(prod);
    setSelectedCliente(clientes[0]?.id || null);
    setDiasRenta(1);
    setRentDialogVisible(true);
  };

  const handleConfirmRent = async () => {
    if (!selectedProduct) return;

    try {
      await productoService.update(selectedProduct.id || selectedProduct.idProducto, {
        ...selectedProduct,
        existencia: Math.max(0, (selectedProduct.existencia ?? selectedProduct.stock ?? 1) - 1),
      });

      retroAudio.playVictory();
      const total = calcularTotalRenta(selectedProduct, diasRenta);
      toastRef.current?.show({
        severity: 'success',
        summary: 'Alquiler Registrado',
        detail: `Renta de "${selectedProduct.nombre}" por ${diasRenta} día(s). Total: $${total.toFixed(2)}`,
        life: 3000,
      });

      setRentDialogVisible(false);
      loadData();
    } catch {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo procesar la renta',
      });
    }
  };

  const filteredProductos = productos.filter((prod) => {
    const matchesCat = selectedCat ? prod.categoria?.id === selectedCat : true;
    const matchesQuery = searchQuery
      ? prod.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.codigo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.categoria?.nombre?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCat && matchesQuery;
  });

  return (
    <div className="flex flex-column gap-4">
      <Toast ref={toastRef} position="top-right" />

      {/* Encabezado Aero Glass Ribbon */}
      <div className="surface-card border-round-2xl p-4 flex flex-column md:flex-row md:align-items-center justify-content-between gap-3">
        <div className="flex align-items-center gap-3">
          <PacmanSprite size={44} />
          <div>
            <h2
              className="m-0 text-2xl font-bold"
              style={{ color: '#0f172a', letterSpacing: '-0.02em' }}
            >
              Rentar Cartuchos de Videojuegos
            </h2>
            <div
              className="flex align-items-center gap-2 mt-1 text-sm"
              style={{ color: '#64748b' }}
            >
              <span>Alquiler flexible por día, fin de semana o mensualidad</span>
              <span className="arcade-blink-text" style={{ color: '#0284c7', fontWeight: 600 }}>
                • Disponibilidad Inmediata
              </span>
            </div>
          </div>
        </div>

        {/* Destellos e Iconos Aero */}
        <div className="flex align-items-center gap-2">
          <GhostSprite size={28} color="#10b981" />
          <GhostSprite size={28} color="#06b6d4" />
          <GhostSprite size={28} color="#0284c7" />
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="surface-card border-round-2xl p-3 flex flex-column gap-3">
        <div className="flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="flex align-items-center gap-2 flex-wrap">
            <Dropdown
              value={selectedCat}
              options={[
                { label: 'Todas las consolas', value: null },
                ...categorias.map((c) => ({ label: c.nombre, value: c.id })),
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

          <div style={{ fontSize: '0.9rem', color: '#0369a1', fontWeight: 600 }}>
            Títulos para Renta: <strong>{filteredProductos.length}</strong>
          </div>
        </div>

        {/* Botones de consolas */}
        <div className="flex align-items-center gap-2 flex-wrap pt-2 border-top-1 surface-border">
          <span className="mr-2 text-xs font-bold" style={{ color: '#64748b' }}>
            CONSOLAS DESTACADAS:
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
                size="small"
                outlined={!isSelected}
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
        {loading ? (
          <div className="col-12 text-center p-5">
            <i className="pi pi-spin pi-spinner text-3xl" style={{ color: '#0284c7' }} />
            <p className="text-sm mt-2 font-medium" style={{ color: '#64748b' }}>
              Cargando títulos en renta...
            </p>
          </div>
        ) : filteredProductos.length === 0 ? (
          <div className="col-12 text-center p-5 surface-card border-round-2xl">
            <span style={{ fontSize: '2.5rem' }}>🕹️</span>
            <p className="font-bold text-base mt-2" style={{ color: '#0284c7' }}>
              No hay títulos disponibles para renta en esta categoría.
            </p>
          </div>
        ) : (
          filteredProductos.map((prod) => {
            const stock = prod.existencia ?? prod.stock ?? 0;
            const tarifaDia = getTarifaDia(prod);
            const isOutOfStock = stock <= 0;

            return (
              <div key={prod.id || prod.idProducto} className="col-12 sm:col-6 lg:col-4 xl:col-3">
                <Card className="h-full flex flex-column justify-content-between border-round-2xl transition-transform transition-duration-150 hover:scale-102">
                  <div className="text-center mb-3">
                    <CartridgeSprite size={65} color="#06b6d4" />
                    <h3
                      className="mt-3 mb-1 text-base font-bold text-overflow-ellipsis overflow-hidden"
                      style={{ color: '#0f172a', minHeight: '2.5rem' }}
                      title={prod.nombre}
                    >
                      {prod.nombre}
                    </h3>
                    <div className="text-xs font-semibold" style={{ color: '#0284c7' }}>
                      {prod.categoria?.nombre || 'Colección Clásica'}
                    </div>
                  </div>

                  <div className="border-top-1 surface-border pt-3 mt-auto">
                    <div className="flex justify-content-between align-items-center mb-3">
                      <div>
                        <span className="block text-xs text-500 font-semibold">
                          TARIFA POR DÍA
                        </span>
                        <span
                          style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: '1.25rem',
                            fontWeight: 800,
                            color: '#0284c7',
                          }}
                        >
                          ${tarifaDia.toFixed(2)}
                        </span>
                      </div>

                      <Tag
                        value={isOutOfStock ? 'Alquilado' : 'Disponible'}
                        severity={isOutOfStock ? 'danger' : 'info'}
                      />
                    </div>

                    <Button
                      label={isOutOfStock ? 'No Disponible' : 'Rentar Ahora'}
                      icon="pi pi-clock"
                      className="w-full"
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
        header="Registro de Alquiler de Cartucho"
        modal
        onHide={() => setRentDialogVisible(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              text
              onClick={() => setRentDialogVisible(false)}
            />
            <Button
              label="Autorizar Renta"
              icon="pi pi-check"
              onClick={handleConfirmRent}
            />
          </div>
        }
      >
        {selectedProduct && (
          <div className="flex flex-column gap-3 pt-2">
            <div
              className="flex align-items-center gap-3 p-3 border-round-xl"
              style={{
                background: 'rgba(240, 249, 255, 0.85)',
                border: '1px solid rgba(186, 230, 253, 0.9)',
              }}
            >
              <PacmanSprite size={38} />
              <div>
                <span className="block font-bold text-base" style={{ color: '#0f172a' }}>
                  {selectedProduct.nombre}
                </span>
                <span className="text-sm font-semibold" style={{ color: '#0284c7' }}>
                  Tarifa: ${getTarifaDia(selectedProduct).toFixed(2)} / día
                </span>
              </div>
            </div>

            <div className="field">
              <label className="block mb-1 font-semibold text-sm">
                Socio / Cliente que retira el cartucho:
              </label>
              <Dropdown
                value={selectedCliente}
                options={clientes.map((c) => ({
                  label: `${c.nombre} ${c.apellido || ''} (${c.documento || c.id})`,
                  value: c.id,
                }))}
                onChange={(e) => setSelectedCliente(e.value)}
                placeholder="Seleccionar socio registrado"
                className="w-full"
              />
            </div>

            <div className="field">
              <div className="flex justify-content-between align-items-center mb-1">
                <label className="font-semibold text-sm">Días de alquiler:</label>
                <span className="text-xs font-semibold" style={{ color: diasRenta > 3 ? '#b45309' : '#0284c7' }}>
                  {diasRenta > 3 ? 'Tarifa con recargo extendido' : 'Tarifa estándar'}
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
                  className="px-3 py-2 border-round-xl text-center font-bold flex-1"
                  style={{
                    background: 'rgba(240, 249, 255, 0.9)',
                    border: '1px solid rgba(186, 230, 253, 0.9)',
                    fontSize: '1rem',
                    color: '#0369a1',
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
                  { label: '15 Días', val: 15 },
                  { label: '30 Días (Mes)', val: 30 },
                ].map((item) => (
                  <Button
                    key={item.val}
                    type="button"
                    label={item.label}
                    size="small"
                    outlined={diasRenta !== item.val}
                    onClick={() => {
                      retroAudio.playCoin();
                      setDiasRenta(item.val);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Desglose de Costo en tiempo real */}
            <div className="border-top-1 surface-border pt-3 flex flex-column gap-1 text-sm">
              <div className="flex justify-content-between" style={{ color: '#64748b' }}>
                <span>Costo base ({diasRenta} días x ${getTarifaDia(selectedProduct).toFixed(2)}):</span>
                <span>${(getTarifaDia(selectedProduct) * diasRenta).toFixed(2)}</span>
              </div>

              {diasRenta > 3 && (
                <div className="flex justify-content-between" style={{ color: '#b45309' }}>
                  <span>+ Recargo por tiempo extendido ({diasRenta - 3} días x $0.75):</span>
                  <span>+${((diasRenta - 3) * 0.75).toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-content-between align-items-center mt-2 pt-2 border-top-1 surface-border">
                <div>
                  <span className="font-bold text-sm block" style={{ color: '#0f172a' }}>
                    TOTAL DE ALQUILER:
                  </span>
                  <small style={{ color: '#64748b' }}>
                    {diasRenta} día(s) contratado(s)
                  </small>
                </div>
                <span
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: '#0284c7',
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
