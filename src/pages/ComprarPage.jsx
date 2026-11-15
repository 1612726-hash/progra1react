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
import { SpaceShipSprite, SpaceInvaderSprite, CartridgeSprite } from '../components/RetroSprites';

export const ComprarPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal de compra
  const [buyDialogVisible, setBuyDialogVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [cantidad, setCantidad] = useState(1);
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

  const handleOpenBuy = (prod) => {
    retroAudio.playCoin();
    setSelectedProduct(prod);
    setCantidad(1);
    setSelectedCliente(clientes[0]?.id || null);
    setBuyDialogVisible(true);
  };

  const handleConfirmPurchase = async () => {
    try {
      const precioUnit = Number(selectedProduct.precio || 0);
      const subtotal = Number((precioUnit * cantidad).toFixed(2));
      const facturaData = {
        tipo: 'COMPRA',
        cliente: selectedCliente ? { id: selectedCliente } : (clientes[0] ? { id: clientes[0].id } : null),
        total: subtotal,
        detalles: [
          {
            producto: { id: selectedProduct.id || selectedProduct.idProducto },
            cantidad,
            precioUnitario: precioUnit,
            subtotal,
          },
        ],
      };

      const res = await createFactura(facturaData);
      retroAudio.playVictory();
      setBuyDialogVisible(false);
      toastRef.current?.show({
        severity: 'success',
        summary: '¡COMPRA REGISTRADA! ★',
        detail: `Factura ${res.numeroFactura || ''}: ${selectedProduct.nombre} (x${cantidad}). Total: $${subtotal.toFixed(2)}`,
        life: 3500,
      });
      loadData();
    } catch (err) {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error al registrar compra',
        detail: err.response?.data?.error || err.message || 'No se pudo generar la factura',
        life: 4000,
      });
    }
  };

  return (
    <div className="flex flex-column gap-4">
      <Toast ref={toastRef} position="top-right" />

      {/* Encabezado con Naves Espaciales Retro */}
      <div className="surface-card border-round p-4 flex flex-column md:flex-row md:align-items-center justify-content-between gap-3">
        <div className="flex align-items-center gap-3">
          <SpaceShipSprite size={48} />
          <div>
            <h2
              className="arcade-font-pixel m-0 text-xl"
              style={{ color: '#ffe600', textShadow: '2px 2px 0 #ff007f' }}
            >
              COMPRAR CARTUCHOS RETRO
            </h2>
            <div
              className="flex align-items-center gap-2 mt-2"
              style={{ fontFamily: "'VT323', monospace", fontSize: '1.25rem', color: '#00ffcc' }}
            >
              <span>&gt; SELECCIONA TU JUEGO CLÁSICO FAVORITO</span>
              <span className="arcade-blink-text" style={{ color: '#ffe600' }}>[STOCK DISPONIBLE]</span>
            </div>
          </div>
        </div>

        <div className="flex align-items-center gap-3">
          <SpaceInvaderSprite size={40} color="#39FF14" />
          <SpaceInvaderSprite size={36} color="#FF007F" />
          <SpaceInvaderSprite size={40} color="#00FFCC" />
        </div>
      </div>

      {/* Filtros de búsqueda y categorías */}
      <div className="surface-card border-round p-3 flex flex-column gap-3">
        <div className="flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="flex align-items-center gap-2 flex-wrap">
            <Dropdown
              value={selectedCat}
              options={[
                { label: '★ Todas las consolas', value: null },
                ...categorias.map((c) => ({ label: `🕹️ ${c.nombre}`, value: c.id })),
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

          <div style={{ fontFamily: "'VT323', monospace", fontSize: '1.25rem', color: '#ffe600' }}>
            CARTUCHOS EN VENTA: <strong>{filteredProductos.length}</strong>
          </div>
        </div>

        {/* Botones rápidos de selección para las consolas */}
        <div className="flex align-items-center gap-2 flex-wrap pt-2 border-top-1 surface-border">
          <span
            style={{ fontFamily: "'VT323', monospace", fontSize: '1.15rem', color: '#00ffcc' }}
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

      {/* Grid de Cartuchos en Venta */}
      <div className="grid">
        {filteredProductos.length === 0 ? (
          <div className="col-12 text-center p-6 surface-card border-round">
            <p className="arcade-font-pixel text-sm" style={{ color: '#ff007f' }}>
              NO SE ENCONTRARON CARTUCHOS EN ESTA CATEGORÍA
            </p>
          </div>
        ) : (
          filteredProductos.map((prod) => {
            const stock = prod.existencia ?? prod.stock ?? 0;
            const price = Number(prod.precio || 0).toFixed(2);
            const isOutOfStock = stock <= 0;

            return (
              <div key={prod.id || prod.idProducto} className="col-12 sm:col-6 lg:col-4 xl:col-3">
                <Card className="h-full flex flex-column justify-content-between transition-transform transition-duration-150 hover:scale-102">
                  <div className="text-center mb-3">
                    <CartridgeSprite size={70} color="#00FFCC" />
                    <h3
                      className="arcade-font-pixel mt-3 mb-1 text-sm text-overflow-ellipsis overflow-hidden"
                      style={{ color: '#ffe600', minHeight: '2.4rem' }}
                      title={prod.nombre}
                    >
                      {prod.nombre}
                    </h3>
                    <div
                      style={{ fontFamily: "'VT323', monospace", fontSize: '1.15rem', color: '#00ffcc' }}
                    >
                      {prod.categoria?.nombre || 'CARTUCHO CLÁSICO'}
                    </div>
                  </div>

                  <div className="border-top-1 surface-border pt-3 mt-auto">
                    <div className="flex justify-content-between align-items-center mb-3">
                      <div>
                        <span className="block text-xs" style={{ fontFamily: "'VT323', monospace", color: '#a89bc9' }}>
                          PRECIO DE VENTA
                        </span>
                        <span
                          style={{
                            fontFamily: "'Press Start 2P', monospace",
                            fontSize: '1.1rem',
                            color: '#39ff14',
                            textShadow: '0 0 8px rgba(57, 255, 20, 0.4)',
                          }}
                        >
                          ${price}
                        </span>
                      </div>

                      <Tag
                        value={isOutOfStock ? 'AGOTADO' : `${stock} DISP.`}
                        severity={isOutOfStock ? 'danger' : stock < 5 ? 'warning' : 'success'}
                      />
                    </div>

                    <Button
                      label={isOutOfStock ? 'SIN STOCK' : '🛒 COMPRAR'}
                      icon="pi pi-shopping-cart"
                      className="w-full"
                      disabled={isOutOfStock}
                      onClick={() => handleOpenBuy(prod)}
                    />
                  </div>
                </Card>
              </div>
            );
          })
        )}
      </div>

      {/* Diálogo de Confirmación de Compra */}
      <Dialog
        visible={buyDialogVisible}
        style={{ width: '480px' }}
        header="VENTA DE CARTUCHO"
        modal
        onHide={() => setBuyDialogVisible(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button
              label="CANCELAR"
              icon="pi pi-times"
              text
              onClick={() => setBuyDialogVisible(false)}
            />
            <Button
              label="CONFIRMAR PAGO"
              icon="pi pi-check"
              onClick={handleConfirmPurchase}
            />
          </div>
        }
      >
        {selectedProduct && (
          <div className="flex flex-column gap-3 pt-2">
            <div className="flex align-items-center gap-3 surface-100 dark:surface-800 p-3 border-round">
              <CartridgeSprite size={48} color="#FFE600" />
              <div>
                <span className="arcade-font-pixel block text-sm" style={{ color: '#ffe600' }}>
                  {selectedProduct.nombre}
                </span>
                <span style={{ fontFamily: "'VT323', monospace", fontSize: '1.2rem', color: '#00ffcc' }}>
                  Precio unitario: ${Number(selectedProduct.precio || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="field">
              <label className="block mb-1 font-semibold" style={{ fontFamily: "'VT323', monospace", fontSize: '1.2rem' }}>
                Socio / Cliente que compra:
              </label>
              <Dropdown
                value={selectedCliente}
                options={clientes.map((c) => ({ label: `${c.nombre} ${c.apellido} (${c.documento})`, value: c.id }))}
                onChange={(e) => setSelectedCliente(e.value)}
                placeholder="Seleccionar socio"
                className="w-full"
              />
            </div>

            <div className="flex justify-content-between align-items-center border-top-1 surface-border pt-3">
              <span className="arcade-font-pixel text-xs" style={{ color: '#ff007f' }}>
                TOTAL A PAGAR:
              </span>
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '1.3rem',
                  color: '#39ff14',
                  textShadow: '0 0 10px rgba(57, 255, 20, 0.5)',
                }}
              >
                ${(Number(selectedProduct.precio || 0) * cantidad).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
