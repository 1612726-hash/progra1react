import { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Paginator } from 'primereact/paginator';
import { productoService } from '../services/productoService';
import { categoriaService } from '../services/categoriaService';
import { clienteService } from '../services/clienteService';
import { retroAudio } from '../utils/retroSound';
import { SpaceShipSprite, SpaceInvaderSprite, CartridgeSprite } from '../components/RetroSprites';

export const ComprarPage = () => {
  // Catálogos auxiliares (se cargan una sola vez al montar la vista)
  const [categorias, setCategorias] = useState([]);
  const [clientes, setClientes] = useState([]);

  // Productos paginados y estado de carga
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [selectedCat, setSelectedCat] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Paginación real del servidor (Server-side)
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(12);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modal de Venta / Compra
  const [buyDialogVisible, setBuyDialogVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [submittingBuy, setSubmittingBuy] = useState(false);

  const toastRef = useRef(null);

  // ── Cargar categorías y clientes una sola vez ──────────────────────────────
  useEffect(() => {
    let isMounted = true;
    const loadCatalogos = async () => {
      try {
        const [catRes, cliRes] = await Promise.all([
          categoriaService.getAll(),
          clienteService.getAll(),
        ]);
        if (isMounted) {
          const catData = Array.isArray(catRes) ? catRes : catRes?.content || [];
          const cliData = Array.isArray(cliRes) ? cliRes : cliRes?.content || [];
          setCategorias(catData);
          setClientes(cliData);
        }
      } catch (err) {
        console.error('Error al cargar catálogos:', err);
      }
    };

    loadCatalogos();
    return () => {
      isMounted = false;
    };
  }, []);

  // ── Debounce para el filtro de texto de búsqueda ───────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        setSearchQuery(searchInput);
        setPage(0);
        setFirst(0);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput, searchQuery]);

  // ── Obtener página de productos desde el servidor ──────────────────────────
  const fetchProductosPaginados = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: page,
        size: rows,
        sortField: 'idProducto',
        sortDirection: 'asc',
      };

      if (selectedCat) {
        params.categoriaId = selectedCat;
      }

      if (searchQuery && searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res = await productoService.getPaginated(params);

      if (res && res.content) {
        setProductos(res.content);
        setTotalRecords(res.totalElements ?? 0);
      } else if (Array.isArray(res)) {
        setProductos(res);
        setTotalRecords(res.length);
      } else {
        setProductos([]);
        setTotalRecords(0);
      }
    } catch (err) {
      console.error('Error al cargar productos comerciales:', err);
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los títulos de venta',
        life: 3000,
      });
      setProductos([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }, [page, rows, selectedCat, searchQuery]);

  useEffect(() => {
    fetchProductosPaginados();
  }, [fetchProductosPaginados]);

  // ── Cambio de página en el componente Paginator ────────────────────────────
  const onPageChange = (e) => {
    retroAudio.playCoin();
    setFirst(e.first);
    setRows(e.rows);
    setPage(e.page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Acciones de Modal de Compra ─────────────────────────────────────────────
  const handleOpenBuy = (prod) => {
    retroAudio.playCoin();
    setSelectedProduct(prod);
    setSelectedCliente(clientes[0]?.id || null);
    setCantidad(1);
    setBuyDialogVisible(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedProduct) return;

    try {
      setSubmittingBuy(true);
      const prodId = selectedProduct.id || selectedProduct.idProducto;
      const currentStock = selectedProduct.existencia ?? selectedProduct.stock ?? 1;
      const nuevoStock = Math.max(0, currentStock - cantidad);

      await productoService.update(prodId, {
        ...selectedProduct,
        existencia: nuevoStock,
        stock: nuevoStock,
      });

      retroAudio.playVictory();
      toastRef.current?.show({
        severity: 'success',
        summary: 'Venta Completada',
        detail: `Se procesó la compra de ${cantidad} unidad(es) de "${selectedProduct.nombre}" exitosamente.`,
        life: 3000,
      });

      setBuyDialogVisible(false);
      // Recarga únicamente la página actual del servidor
      fetchProductosPaginados();
    } catch (err) {
      console.error('Error al registrar la venta:', err);
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo registrar la venta',
      });
    } finally {
      setSubmittingBuy(false);
    }
  };

  const totalPages = Math.ceil(totalRecords / rows) || 1;

  return (
    <div className="flex flex-column gap-4">
      <Toast ref={toastRef} position="top-right" />

      {/* Encabezado Aero Glass Ribbon */}
      <div className="surface-card border-round-2xl p-4 flex flex-column md:flex-row md:align-items-center justify-content-between gap-3 shadow-1">
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
      <div className="surface-card border-round-2xl p-3 flex flex-column gap-3 shadow-1">
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
                setPage(0);
                setFirst(0);
              }}
              placeholder="Filtrar por consola"
              className="w-16rem"
            />

            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                placeholder="Buscar por juego, código o consola..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-20rem"
              />
            </span>

            {searchInput && (
              <Button
                icon="pi pi-times"
                className="p-button-rounded p-button-text p-button-secondary"
                tooltip="Limpiar búsqueda"
                onClick={() => {
                  setSearchInput('');
                  setSearchQuery('');
                  setPage(0);
                  setFirst(0);
                }}
              />
            )}
          </div>

          <div className="flex align-items-center gap-3">
            <div style={{ fontSize: '0.9rem', color: '#0369a1', fontWeight: 600 }}>
              Títulos Disponibles: <strong>{totalRecords}</strong>
            </div>
            <div
              className="px-2 py-1 border-round text-xs font-bold"
              style={{ background: '#e0f2fe', color: '#0284c7' }}
            >
              Página {page + 1} de {totalPages}
            </div>
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
            outlined={selectedCat !== null || searchInput !== ''}
            severity="secondary"
            onClick={() => {
              retroAudio.playCoin();
              setSelectedCat(null);
              setSearchInput('');
              setSearchQuery('');
              setPage(0);
              setFirst(0);
            }}
          />
          {['Super Nintendo', 'Sega Genesis', 'Arcade'].map((consolaNombre) => {
            const catObj = categorias.find(
              (c) => c.nombre?.toLowerCase() === consolaNombre.toLowerCase()
            );
            const isSelected =
              (catObj && selectedCat === catObj.id) ||
              searchInput.toLowerCase() === consolaNombre.toLowerCase();

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
                    setSearchInput('');
                    setSearchQuery('');
                  } else {
                    setSelectedCat(null);
                    setSearchInput(consolaNombre);
                    setSearchQuery(consolaNombre);
                  }
                  setPage(0);
                  setFirst(0);
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Grid de Cartuchos Disponibles para Venta con Paginación Real */}
      <div className="grid">
        {loading ? (
          <div className="col-12 text-center p-6 surface-card border-round-2xl shadow-1">
            <i className="pi pi-spin pi-spinner text-4xl" style={{ color: '#0284c7' }} />
            <p className="text-base mt-3 font-semibold" style={{ color: '#0369a1' }}>
              Cargando catálogo comercial del servidor...
            </p>
          </div>
        ) : productos.length === 0 ? (
          <div className="col-12 text-center p-6 surface-card border-round-2xl shadow-1">
            <span style={{ fontSize: '3rem' }}>🔍</span>
            <p className="font-bold text-lg mt-3" style={{ color: '#0284c7' }}>
              No se encontraron cartuchos para los criterios seleccionados.
            </p>
            <Button
              label="Ver todos los títulos"
              icon="pi pi-refresh"
              size="small"
              className="mt-2"
              onClick={() => {
                setSelectedCat(null);
                setSearchInput('');
                setSearchQuery('');
                setPage(0);
                setFirst(0);
              }}
            />
          </div>
        ) : (
          productos.map((prod) => {
            const stock = prod.existencia ?? prod.stock ?? 0;
            const price = Number(prod.precio || 0).toFixed(2);
            const isOutOfStock = stock <= 0;

            return (
              <div key={prod.id || prod.idProducto} className="col-12 sm:col-6 lg:col-4 xl:col-3">
                <Card className="h-full flex flex-column justify-content-between border-round-2xl transition-transform transition-duration-150 hover:scale-102 shadow-1">
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

      {/* Paginador Servidor PrimeReact */}
      {totalRecords > 0 && (
        <div className="surface-card border-round-2xl shadow-1 p-2">
          <Paginator
            first={first}
            rows={rows}
            totalRecords={totalRecords}
            rowsPerPageOptions={[8, 12, 16, 24, 48]}
            onPageChange={onPageChange}
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} títulos"
          />
        </div>
      )}

      {/* Diálogo de Confirmación de Compra */}
      <Dialog
        visible={buyDialogVisible}
        style={{ width: '480px', maxWidth: '95vw' }}
        header="Confirmación de Compra"
        modal
        blockScroll
        draggable={false}
        resizable={false}
        onHide={() => !submittingBuy && setBuyDialogVisible(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              text
              disabled={submittingBuy}
              onClick={() => setBuyDialogVisible(false)}
            />
            <Button
              label={submittingBuy ? 'Procesando...' : 'Confirmar Pago'}
              icon={submittingBuy ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
              disabled={submittingBuy}
              onClick={handleConfirmPurchase}
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
                options={clientes.map((c) => ({
                  label: `${c.nombre} ${c.apellido || ''} (${c.documento || c.id})`,
                  value: c.id,
                }))}
                onChange={(e) => setSelectedCliente(e.value)}
                placeholder="Seleccionar socio"
                className="w-full"
                filter
                filterPlaceholder="Buscar socio por nombre o documento..."
                scrollHeight="200px"
              />
            </div>

            <div className="field">
              <label className="block mb-1 font-semibold text-sm">
                Cantidad a comprar:
              </label>
              <div className="flex align-items-center gap-2">
                <Button
                  type="button"
                  icon="pi pi-minus"
                  className="p-button-outlined"
                  disabled={cantidad <= 1}
                  onClick={() => {
                    retroAudio.playCoin();
                    setCantidad((prev) => Math.max(1, prev - 1));
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
                  {cantidad} {cantidad === 1 ? 'UNIDAD' : 'UNIDADES'}
                </div>
                <Button
                  type="button"
                  icon="pi pi-plus"
                  className="p-button-outlined"
                  disabled={cantidad >= (selectedProduct.existencia ?? selectedProduct.stock ?? 1)}
                  onClick={() => {
                    retroAudio.playCoin();
                    setCantidad((prev) => prev + 1);
                  }}
                />
              </div>
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
