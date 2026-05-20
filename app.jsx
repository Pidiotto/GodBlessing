// app.jsx — Router, State, Tweaks
const { useState, useEffect, useCallback } = React;

// ── TWEAKS PANEL ──
const TweaksPanel = ({ tweaks, setTweak }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = e => {
      if (e.data?.type === '__activate_edit_mode')   setOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const close = () => {
    setOpen(false);
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  };

  if (!open) return null;

  const Btn = ({ active, onClick, children }) => (
    <button onClick={onClick} style={{
      flex:1, padding:'9px 4px', fontFamily:'var(--font-b)', fontSize:10,
      fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer',
      background: active ? 'rgba(201,166,104,0.18)' : 'none',
      border: `1px solid ${active ? 'rgba(201,166,104,0.55)' : 'rgba(201,166,104,0.15)'}`,
      color: active ? 'var(--gold)' : 'var(--cream-dim)', transition:'all 0.2s',
    }}>{children}</button>
  );

  return (
    <div style={{
      position:'fixed', bottom:20, right:20, zIndex:9000,
      width:272, background:'var(--card)', border:'1px solid var(--border)',
      padding:22, boxShadow:'0 12px 40px rgba(0,0,0,0.6)',
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <h3 style={{ fontFamily:'var(--font-h)', fontSize:19, fontWeight:600 }}>Tweaks</h3>
        <button onClick={close} style={{ background:'none', border:'none', color:'var(--cream-dim)', fontSize:20, cursor:'pointer', lineHeight:1 }}>×</button>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
        <div>
          <p style={{ fontSize:9, color:'var(--gold-dim)', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:10, fontWeight:700 }}>Tema</p>
          <div style={{ display:'flex', gap:8 }}>
            <Btn active={tweaks.theme==='dark'} onClick={() => setTweak('theme','dark')}>Escuro</Btn>
            <Btn active={tweaks.theme==='sepia'} onClick={() => setTweak('theme','sepia')}>Sépia</Btn>
            <Btn active={tweaks.theme==='slate'} onClick={() => setTweak('theme','slate')}>Ardósia</Btn>
          </div>
        </div>

        <div>
          <p style={{ fontSize:9, color:'var(--gold-dim)', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:10, fontWeight:700 }}>Colunas na Loja</p>
          <div style={{ display:'flex', gap:8 }}>
            {[3,4,5].map(n => (
              <Btn key={n} active={tweaks.gridCols===n} onClick={() => setTweak('gridCols',n)}>{n} cols</Btn>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontSize:9, color:'var(--gold-dim)', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:10, fontWeight:700 }}>Acento de Cor</p>
          <div style={{ display:'flex', gap:8 }}>
            {[['gold','#c9a668'],['rose','#c4784a'],['silver','#9ea8b0']].map(([id,hex]) => (
              <button key={id} onClick={() => setTweak('accent',id)} style={{
                flex:1, height:32, background:hex, border:`2px solid ${tweaks.accent===id ? '#fff' : 'transparent'}`,
                cursor:'pointer', transition:'border-color 0.2s',
              }}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── THEME CONFIGS ──
const THEMES = {
  dark:  { '--bg':'#0d0b09', '--surface':'#171310', '--card':'#201c17', '--card-hover':'#2a2520' },
  sepia: { '--bg':'#130f09', '--surface':'#1c1509', '--card':'#251c0e', '--card-hover':'#2f2414' },
  slate: { '--bg':'#0c0e11', '--surface':'#141618', '--card':'#1c2025', '--card-hover':'#222830' },
};
const ACCENTS = {
  gold:   { '--gold':'#c9a668', '--gold-light':'#e8c98a', '--gold-dim':'#8a7040' },
  rose:   { '--gold':'#c4784a', '--gold-light':'#df9a6e', '--gold-dim':'#8a4e2a' },
  silver: { '--gold':'#9ea8b0', '--gold-light':'#c0cad2', '--gold-dim':'#6a747c' },
};

// ── APP ──
const App = () => {
  const [route,      setRoute]     = useState(window.location.hash || '#/');
  const [products,   setProducts]  = useState(() => gbLoad('products',   PRODUCTS_INITIAL));
  const [categories, setCats]      = useState(() => gbLoad('categories', CATEGORIES_INITIAL));
  const [cart,       setCart]      = useState(() => gbLoad('cart',       []));
  const [orders,     setOrders]    = useState(() => gbLoad('orders',     []));
  const [isAdmin,    setIsAdmin]   = useState(false);

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{"theme":"dark","gridCols":4,"accent":"gold"}/*EDITMODE-END*/;
  const [tweaks, setTweaksState] = useState(() => ({ ...TWEAK_DEFAULTS, ...gbLoad('tweaks', {}) }));

  const setTweak = useCallback((key, val) => {
    setTweaksState(t => {
      const next = { ...t, [key]: val };
      gbSave('tweaks', next);
      window.parent.postMessage({ type:'__edit_mode_set_keys', edits: next }, '*');
      return next;
    });
  }, []);

  // Apply theme CSS vars
  useEffect(() => {
    const t = THEMES[tweaks.theme] || THEMES.dark;
    const a = ACCENTS[tweaks.accent] || ACCENTS.gold;
    Object.entries({ ...t, ...a }).forEach(([k, v]) =>
      document.documentElement.style.setProperty(k, v)
    );
  }, [tweaks.theme, tweaks.accent]);

  // Hash routing
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Persist
  useEffect(() => { gbSave('products',   products);   }, [products]);
  useEffect(() => { gbSave('categories', categories); }, [categories]);
  useEffect(() => { gbSave('cart',       cart);       }, [cart]);
  useEffect(() => { gbSave('orders',     orders);     }, [orders]);

  const navigate = useCallback((path) => {
    window.location.hash = path;
    setRoute(path);
    window.scrollTo(0, 0);
  }, []);

  // Cart ops
  const addToCart = (product, qty = 1) =>
    setCart(prev => {
      const ex = prev.find(i => i.product.id === product.id);
      return ex
        ? prev.map(i => i.product.id===product.id ? {...i, qty:i.qty+qty} : i)
        : [...prev, { product, qty }];
    });
  const updateCart    = (id, qty)  => setCart(p => p.map(i => i.product.id===id ? {...i,qty} : i));
  const removeFromCart = id        => setCart(p => p.filter(i => i.product.id!==id));
  const placeOrder    = (order)    => { setOrders(p => [...p, order]); setCart([]); };

  // Product CRUD
  const addProduct    = p  => setProducts(p2 => [...p2, p]);
  const updateProduct = p  => setProducts(p2 => p2.map(x => x.id===p.id ? p : x));
  const deleteProduct = id => setProducts(p2 => p2.filter(x => x.id!==id));
  const toggleProduct = id => setProducts(p2 => p2.map(x => x.id===id ? {...x,active:!x.active} : x));

  // Category CRUD
  const addCategory    = c  => setCats(p => [...p, c]);
  const deleteCategory = id => setCats(p => p.filter(c => c.id!==id));

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const base = route.split('?')[0];
  const isAdminPage = base.startsWith('#/admin');

  const renderPage = () => {
    if (base==='#/' || base==='') return <HomePage products={products} navigate={navigate}/>;
    if (base==='#/loja')          return <ShopPage products={products} categories={categories} navigate={navigate} gridCols={tweaks.gridCols}/>;
    if (base.startsWith('#/produto/')) return <ProductDetailPage products={products} navigate={navigate} addToCart={addToCart}/>;
    if (base==='#/carrinho')      return <CartPage cart={cart} navigate={navigate} updateCart={updateCart} removeFromCart={removeFromCart}/>;
    if (base==='#/checkout')      return <CheckoutPage cart={cart} navigate={navigate} placeOrder={placeOrder}/>;
    if (base==='#/sobre')         return <AboutPage navigate={navigate}/>;
    if (base==='#/admin/login')   return <AdminLoginPage navigate={navigate} setIsAdmin={setIsAdmin}/>;
    if (base==='#/admin') {
      if (!isAdmin) { navigate('#/admin/login'); return null; }
      return <AdminDashboardPage
        products={products} categories={categories} orders={orders}
        navigate={navigate} setIsAdmin={setIsAdmin}
        addProduct={addProduct} updateProduct={updateProduct}
        deleteProduct={deleteProduct} toggleProduct={toggleProduct}
        addCategory={addCategory} deleteCategory={deleteCategory}
      />;
    }
    return <HomePage products={products} navigate={navigate}/>;
  };

  return (
    <div>
      {!isAdminPage && <Nav route={base} navigate={navigate} cartCount={cartCount}/>}
      {renderPage()}
      <TweaksPanel tweaks={tweaks} setTweak={setTweak}/>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
