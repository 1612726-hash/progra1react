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
import { SpaceShipSprite, SpaceInvaderSprite, CartridgeSprite } from '../components/RetroSprites';

export const ComprarPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [selectedCat, setSelectedCat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal de Venta
  const [buyDialogVisible, setBuyDialogVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [cantidad] = useState(1);

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
        detail: 'No se pudieron cargar los datos de venta',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenBuy = (prod) => {
    retroAudio.playCoin();
    setSelectedProduct(prod);
    setSelectedCliente(clientes[0]?.id || null);
    setBuyDialogVisible(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedProduct) return;

    try {
      await productoService.update(selectedProduct.id || selectedProduct.idProducto, {
        ...selectedProduct,
        existencia: Math.max(0, (selectedProduct.existencia ?? selectedProduct.stock ?? 1) - cantidad),
      });

      retroAudio.playVictory();
      toastRef.current?.show({
        severity: 'success',
        summary: 'Venta Completada',
        detail: `Se procesó la compra de "${selectedProduct.nombre}" exitosamente.`,
        life: 2500,
      });

      setBuyDialogVisible(false);
      loadData();
    } catch {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo registrar la venta',
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
          <SpaceShipSprite size={44} />
          <div>
            <h2
              className="m-0 text-2xl font-bold"
              style={{ color: '#0f172a', letterSpacing: '-0.02em' }}
            >
              Comprar Cartuchos y Videojuegos
            </h2>
            <div
              className="flex align-items-center gap-2 mt-1 text-sm"
              style={{ color: '#64748b' }}
            >
              <span>Selecciona tu juego y genera la venta de manera inmediata</span>
              <span className="arcade-blink-text" style={{ color: '#0284c7', fontWeight: 600 }}>
                • Stock en Tiempo Real
              </span>
            </div>
          </div>
        </div>

        <div className="flex align-items-center gap-2">
          <SpaceInvaderSprite size={28} color="#0284c7" />
          <SpaceInvaderSprite size={28} color="#10b981" />
        </div>
      </div>

      {/* Filtros de búsqueda y categorías */}
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
            Títulos Disponibles: <strong>{filteredProductos.length}</strong>
          </div>
        </div>

        {/* Botones rápidos de selección para las consolas */}
        <div className="flex align-items-center gap-2 flex-wrap pt-2 border-top-1 surface-border">
          <span className="mr-2 text-xs font-bold" style={{ color: '#64748b' }}>
            ACCESO RÁPIDO:
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

      {/* Grid de Cartuchos Disponibles para Venta */}
      <div className="grid">
        {loading ? (
          <div className="col-12 text-center p-5">
            <i className="pi pi-spin pi-spinner text-3xl" style={{ color: '#0284c7' }} />
            <p className="text-sm mt-2 font-medium" style={{ color: '#64748b' }}>
              Cargando catálogo comercial...
            </p>
          </div>
        ) : filteredProductos.length === 0 ? (
          <div className="col-12 text-center p-5 surface-card border-round-2xl">
            <span style={{ fontSize: '2.5rem' }}>🔍</span>
            <p className="font-bold text-base mt-2" style={{ color: '#0284c7' }}>
              No se encontraron cartuchos en esta categoría o búsqueda.
            </p>
          </div>
        ) : (
          filteredProductos.map((prod) => {
            const stock = prod.existencia ?? prod.stock ?? 0;
            const price = Number(prod.precio || 0).toFixed(2);
            const isOutOfStock = stock <= 0;

            return (
              <div key={prod.id || prod.idProducto} className="col-12 sm:col-6 lg:col-4 xl:col-3">
                <Card className="h-full flex flex-column justify-content-between border-round-2xl transition-transform transition-duration-150 hover:scale-102">
                  <div className="text-center mb-3">
                    <CartridgeSprite size={65} color="#0284c7" />
                    <h3
                      className="mt-3 mb-1 text-base font-bold text-overflow-ellipsis overflow-hidden"
                      style={{ color: '#0f172a', minHeight: '2.5rem' }}
                      title={prod.nombre}
                    >
                      {prod.nombre}
                    </h3>
                    <div className="text-xs font-semibold" style={{ color: '#0284c7' }}>
                      {prod.categoria?.nombre || 'Cartucho Clásico'}
                    </div>
                  </div>

                  <div className="border-top-1 surface-border pt-3 mt-auto">
                    <div className="flex justify-content-between align-items-center mb-3">
                      <div>
                        <span className="block text-xs text-500 font-semibold">
                          PRECIO VENTA
                        </span>
                        <span
                          style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: '1.25rem',
                            fontWeight: 800,
                            color: '#15803d',
                          }}
                        >
                          ${price}
                        </span>
                      </div>

                      <Tag
                        value={isOutOfStock ? 'Agotado' : `${stock} disp.`}
                        severity={isOutOfStock ? 'danger' : stock < 5 ? 'warning' : 'success'}
                      />
                    </div>

                    <Button
                      label={isOutOfStock ? 'Sin Existencias' : 'Comprar'}
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
        header="Confirmación de Compra"
        modal
        onHide={() => setBuyDialogVisible(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              text
              onClick={() => setBuyDialogVisible(false)}
            />
            <Button
              label="Confirmar Pago"
              icon="pi pi-check"
              onClick={handleConfirmPurchase}
            />
          </div>
        }
      >
        {selectedProduct && (
          <div className="flex flex-column gap-3 pt-2">
            <div className="flex align-items-center gap-3 p-3 border-round-xl" style={{ background: 'rgba(240, 249, 255, 0.85)', border: '1px solid rgba(186, 230, 253, 0.9)' }}>
              <CartridgeSprite size={44} color="#0284c7" />
              <div>
                <span className="block font-bold text-base" style={{ color: '#0f172a' }}>
                  {selectedProduct.nombre}
                </span>
                <span className="text-sm font-semibold" style={{ color: '#0284c7' }}>
                  Precio unitario: ${Number(selectedProduct.precio || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="field">
              <label className="block mb-1 font-semibold text-sm">
                Cliente / Socio comprador:
              </label>
              <Dropdown
                value={selectedCliente}
                options={clientes.map((c) => ({ label: `${c.nombre} ${c.apellido || ''} (${c.documento || c.id})`, value: c.id }))}
                onChange={(e) => setSelectedCliente(e.value)}
                placeholder="Seleccionar socio"
                className="w-full"
              />
            </div>

            <div className="flex justify-content-between align-items-center border-top-1 surface-border pt-3">
              <span className="font-bold text-sm" style={{ color: '#64748b' }}>
                TOTAL A LIQUIDAR:
              </span>
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#15803d',
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
