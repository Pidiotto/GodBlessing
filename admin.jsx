// admin.jsx — AdminLogin, AdminDashboard, ProductForm (full page)
const { useState, useRef } = React;

// ── ADMIN LOGIN ──
const AdminLoginPage = ({ navigate, setIsAdmin }) => {
  const [pw, setPw]   = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (pw === 'godblessing') { setIsAdmin(true); navigate('#/admin'); }
      else { setErr('Senha incorreta. Tente novamente.'); setLoading(false); }
    }, 600);
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'radial-gradient(ellipse at 50% 40%, #1a1208 0%, #0d0b09 70%)', padding:24 }}>
      <div style={{ width:'100%', maxWidth:400, padding:'52px 48px',
        background:'var(--card)', border:'1px solid var(--border)',
        textAlign:'center', boxShadow:'0 32px 80px rgba(0,0,0,0.6)' }}>
        <GodBlessingLogo size={90}/>
        <h2 style={{ fontFamily:'var(--font-h)', fontSize:30, marginTop:24, marginBottom:6 }}>Painel Admin</h2>
        <p style={{ color:'var(--cream-dim)', fontSize:13, marginBottom:36, letterSpacing:'0.04em' }}>
          God Blessing | Arte em Madeira
        </p>
        <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <label style={{ fontSize:9, color:'var(--gold-dim)', letterSpacing:'0.22em', textTransform:'uppercase', display:'block', marginBottom:8, fontWeight:700 }}>
              Senha de Acesso
            </label>
            <input type="password" value={pw}
              onChange={e => { setPw(e.target.value); setErr(''); }}
              placeholder="••••••••••"
              style={{ width:'100%', padding:'14px', textAlign:'center', letterSpacing:'0.25em',
                background:'var(--surface)',
                border:`1px solid ${err ? 'rgba(224,85,85,0.5)' : 'var(--border)'}`,
                color:'var(--cream)', fontFamily:'var(--font-b)', outline:'none',
                boxSizing:'border-box', fontSize:15 }}/>
          </div>
          {err && <p style={{ color:'rgba(224,85,85,0.85)', fontSize:13, margin:0 }}>{err}</p>}
          <button type="submit" disabled={loading} style={{
            background:'var(--gold)', color:'#1a0f00', padding:'15px',
            border:'none', fontFamily:'var(--font-b)', fontSize:11, fontWeight:800,
            letterSpacing:'0.18em', textTransform:'uppercase', cursor:'pointer',
            marginTop:8, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
        <p style={{ color:'rgba(255,255,255,0.18)', fontSize:11, marginTop:28, letterSpacing:'0.06em' }}>
          Senha padrão: <span style={{ color:'rgba(255,255,255,0.3)' }}>godblessing</span>
        </p>
        <button onClick={() => navigate('#/')} style={{
          background:'none', border:'none', color:'var(--cream-dim)',
          fontSize:12, cursor:'pointer', marginTop:20, fontFamily:'var(--font-b)', letterSpacing:'0.06em' }}>
          ← Voltar ao Site
        </button>
      </div>
    </div>
  );
};

// ── PRODUCT FORM PAGE ──
const ProductFormPage = ({ product, categories, onSave, onBack }) => {
  const [form, setForm] = useState({ ...product });
  const fileRef = useRef();
  const isNew = !product.id;

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, image: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const lbl = { fontSize:9, color:'var(--gold-dim)', letterSpacing:'0.2em', textTransform:'uppercase', display:'block', marginBottom:7, fontWeight:700 };
  const inp = (key, extra={}) => (
    <input value={form[key] ?? ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
      style={{ width:'100%', padding:'12px 14px', background:'var(--surface)', border:'1px solid var(--border)', color:'var(--cream)', fontFamily:'var(--font-b)', fontSize:14, outline:'none', boxSizing:'border-box' }}
      {...extra}/>
  );

  return (
    <div style={{ padding:'44px 44px 72px' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:40 }}>
        <button onClick={onBack} style={{
          background:'none', border:'1px solid var(--border)', color:'var(--cream-dim)',
          padding:'10px 18px', fontFamily:'var(--font-b)', fontSize:11, fontWeight:700,
          letterSpacing:'0.12em', textTransform:'uppercase', cursor:'pointer' }}>
          ← Voltar
        </button>
        <div>
          <h1 style={{ fontFamily:'var(--font-h)', fontSize:36, fontWeight:400 }}>
            {isNew ? 'Novo Produto' : 'Editar Produto'}
          </h1>
          {!isNew && <p style={{ color:'var(--cream-dim)', fontSize:12, marginTop:3 }}>ID #{product.id} · {product.name}</p>}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:40, alignItems:'start' }}>
        {/* Left — main fields */}
        <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
          {/* Image upload */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', padding:'28px' }}>
            <p style={lbl}>Foto do Produto</p>
            <div style={{ display:'grid', gridTemplateColumns:'180px 1fr', gap:20, alignItems:'center' }}>
              <div style={{ height:135, overflow:'hidden', border:'1px solid var(--border)', position:'relative', cursor:'pointer' }}
                onClick={() => fileRef.current.click()}>
                {form.image
                  ? <img src={form.image} alt="" onError={e => { e.target.style.display='none'; }}
                      style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                  : <WoodPlaceholder category={form.category}/>
                }
                <div style={{
                  position:'absolute', inset:0, background:'rgba(0,0,0,0.5)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  opacity:0, transition:'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity='1'}
                onMouseLeave={e => e.currentTarget.style.opacity='0'}>
                  <span style={{ color:'#fff', fontFamily:'var(--font-b)', fontSize:10, fontWeight:800, letterSpacing:'0.14em' }}>TROCAR FOTO</span>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <button onClick={() => fileRef.current.click()} style={{
                  background:'var(--gold)', color:'#1a0f00', padding:'12px 20px',
                  border:'none', fontFamily:'var(--font-b)', fontSize:10, fontWeight:800,
                  letterSpacing:'0.14em', textTransform:'uppercase', cursor:'pointer' }}>
                  📁  Escolher Foto
                </button>
                <p style={{ color:'var(--cream-dim)', fontSize:11, lineHeight:1.7 }}>
                  JPG, PNG ou WEBP<br/>Recomendado: 800×600px
                </p>
                {form.image && (
                  <button onClick={() => setForm(f => ({ ...f, image:null }))} style={{
                    background:'none', border:'none', color:'rgba(224,85,85,0.6)',
                    fontSize:11, cursor:'pointer', fontFamily:'var(--font-b)', padding:0, textAlign:'left' }}>
                    ✕ Remover foto
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display:'none' }}/>
              </div>
            </div>
          </div>

          {/* Basic info */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', padding:'28px', display:'flex', flexDirection:'column', gap:18 }}>
            <p style={{ fontFamily:'var(--font-h)', fontSize:18, marginBottom:4 }}>Informações Básicas</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div>
                <label style={lbl}>Nome do Produto *</label>
                {inp('name', { placeholder:'Nome do produto' })}
              </div>
              <div>
                <label style={lbl}>Categoria *</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category:e.target.value }))}
                  style={{ width:'100%', padding:'12px 14px', background:'var(--surface)', border:'1px solid var(--border)', color:'var(--cream)', fontFamily:'var(--font-b)', outline:'none' }}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={lbl}>Descrição</label>
              <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description:e.target.value }))}
                rows={4} placeholder="Descrição completa do produto..."
                style={{ width:'100%', padding:'12px 14px', background:'var(--surface)', border:'1px solid var(--border)', color:'var(--cream)', fontFamily:'var(--font-b)', fontSize:14, outline:'none', resize:'vertical', boxSizing:'border-box' }}/>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div>
                <label style={lbl}>Material</label>
                {inp('material', { placeholder:'Ex: Madeira Ipê' })}
              </div>
              <div>
                <label style={lbl}>Dimensões</label>
                {inp('dimensions', { placeholder:'Ex: 35 × 20 × 2 cm' })}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', padding:'28px', display:'flex', flexDirection:'column', gap:18 }}>
            <p style={{ fontFamily:'var(--font-h)', fontSize:18, marginBottom:4 }}>Preços</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div>
                <label style={lbl}>Preço de Venda (R$) *</label>
                <input type="number" value={form.price} min="0" step="0.01"
                  onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                  style={{ width:'100%', padding:'12px 14px', background:'var(--surface)', border:'1px solid var(--border)', color:'var(--cream)', fontFamily:'var(--font-b)', fontSize:14, outline:'none', boxSizing:'border-box' }}/>
              </div>
              <div>
                <label style={lbl}>Preço Original (riscado)</label>
                <input type="number" value={form.originalPrice || ''} min="0" step="0.01"
                  placeholder="Deixe vazio se não for promoção"
                  onChange={e => setForm(f => ({ ...f, originalPrice: parseFloat(e.target.value) || null }))}
                  style={{ width:'100%', padding:'12px 14px', background:'var(--surface)', border:'1px solid var(--border)', color:'var(--cream)', fontFamily:'var(--font-b)', fontSize:14, outline:'none', boxSizing:'border-box' }}/>
              </div>
            </div>
            {form.originalPrice > 0 && form.price > 0 && (
              <div style={{ padding:'12px 16px', background:'rgba(201,166,104,0.07)', border:'1px solid var(--border)', fontSize:13, color:'var(--cream-dim)' }}>
                Desconto: <strong style={{ color:'var(--gold)' }}>
                  {Math.round((1 - form.price / form.originalPrice) * 100)}% OFF
                </strong>
              </div>
            )}
          </div>

          {/* Flags */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', padding:'28px' }}>
            <p style={{ fontFamily:'var(--font-h)', fontSize:18, marginBottom:20 }}>Visibilidade & Opções</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
              {[
                ['active',       'Ativo na Loja',    'Visível para clientes'],
                ['featured',     'Destaque',          'Aparece na homepage'],
                ['customizable', 'Personalizável',    'Aceita gravação laser'],
              ].map(([key, label, sub]) => (
                <label key={key} style={{
                  display:'flex', flexDirection:'column', gap:6, cursor:'pointer',
                  padding:'16px', border:`1px solid ${form[key] ? 'rgba(201,166,104,0.45)' : 'var(--border)'}`,
                  background: form[key] ? 'rgba(201,166,104,0.06)' : 'none', transition:'all 0.2s',
                }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ color:'var(--cream)', fontSize:13, fontWeight:600, fontFamily:'var(--font-b)' }}>{label}</span>
                    <input type="checkbox" checked={!!form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                      style={{ width:16, height:16, accentColor:'var(--gold)', cursor:'pointer' }}/>
                  </div>
                  <span style={{ color:'var(--cream-dim)', fontSize:11 }}>{sub}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right — preview + save */}
        <div style={{ display:'flex', flexDirection:'column', gap:16, position:'sticky', top:24 }}>
          {/* Preview card */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', overflow:'hidden' }}>
            <div style={{ height:200, overflow:'hidden' }}>
              {form.image
                ? <img src={form.image} alt="" onError={e => { e.target.style.display='none'; }}
                    style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                : <WoodPlaceholder category={form.category}/>
              }
            </div>
            <div style={{ padding:'18px 20px 22px' }}>
              <p style={{ fontSize:9, color:'var(--gold-dim)', letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:6, fontFamily:'var(--font-b)', fontWeight:700 }}>{form.material || 'Material'}</p>
              <p style={{ fontFamily:'var(--font-h)', fontSize:18, marginBottom:10, lineHeight:1.3 }}>{form.name || 'Nome do produto'}</p>
              <p style={{ fontFamily:'var(--font-h)', fontSize:24, color:'var(--gold)' }}>
                {form.price ? `R$ ${Number(form.price).toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.')}` : 'R$ —'}
              </p>
            </div>
          </div>

          {/* Status badge */}
          <div style={{
            padding:'14px 18px', textAlign:'center',
            background: form.active ? 'rgba(37,211,102,0.08)' : 'rgba(224,85,85,0.08)',
            border: `1px solid ${form.active ? 'rgba(37,211,102,0.35)' : 'rgba(224,85,85,0.3)'}`,
            fontSize:11, fontFamily:'var(--font-b)', fontWeight:800, letterSpacing:'0.14em',
            textTransform:'uppercase',
            color: form.active ? 'rgba(37,211,102,0.9)' : 'rgba(224,85,85,0.8)',
          }}>
            {form.active ? '✓ Visível na Loja' : '✕ Oculto da Loja'}
          </div>

          {/* Save */}
          <button onClick={() => onSave(form)} disabled={!form.name} style={{
            background:'var(--gold)', color:'#1a0f00', padding:'18px',
            border:'none', fontFamily:'var(--font-b)', fontSize:12, fontWeight:800,
            letterSpacing:'0.18em', textTransform:'uppercase', cursor:'pointer',
            opacity: !form.name ? 0.45 : 1, transition:'opacity 0.2s' }}>
            {isNew ? '＋  Adicionar Produto' : '✓  Salvar Alterações'}
          </button>
          <button onClick={onBack} style={{
            background:'none', border:'1px solid var(--border)', color:'var(--cream-dim)',
            padding:'13px', fontFamily:'var(--font-b)', fontSize:11, cursor:'pointer',
            letterSpacing:'0.1em', textTransform:'uppercase' }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

// ── ADMIN DASHBOARD ──
const AdminDashboardPage = ({
  products, categories, orders, navigate, setIsAdmin,
  addProduct, updateProduct, deleteProduct, toggleProduct,
  addCategory, deleteCategory,
}) => {
  const [tab,    setTab]    = useState('products');
  const [editP,  setEditP]  = useState(null);   // null = list, object = edit/new
  const [newCat, setNewCat] = useState({ id:'', name:'' });
  const fmt = n => `R$ ${n.toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.')}`;
  const EMPTY = { name:'', category:'tabuas', price:0, originalPrice:null, description:'', dimensions:'', material:'', customizable:true, active:true, featured:false, image:null };

  const handleSave = (p) => {
    if (p.id) updateProduct(p); else addProduct({ ...p, id: Date.now() });
    setEditP(null);
  };

  const sideItems = [
    { id:'products',   label:'Produtos',   count:products.length },
    { id:'categories', label:'Categorias', count:categories.length },
    { id:'orders',     label:'Pedidos',    count:orders.length },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width:230, background:'var(--surface)', borderRight:'1px solid var(--border)',
        position:'fixed', top:0, bottom:0, display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'28px 24px 24px', borderBottom:'1px solid var(--border)' }}>
          <GodBlessingLogo size={54} onClick={() => navigate('#/')}/>
          <p style={{ color:'var(--cream-dim)', fontSize:9, marginTop:12, letterSpacing:'0.22em', textTransform:'uppercase' }}>Painel Admin</p>
        </div>
        <nav style={{ flex:1, padding:'16px 12px', display:'flex', flexDirection:'column', gap:4 }}>
          {sideItems.map(item => (
            <button key={item.id} onClick={() => { setTab(item.id); setEditP(null); }} style={{
              display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'11px 14px',
              background: tab===item.id && !editP ? 'rgba(201,166,104,0.12)' : 'none',
              border: tab===item.id && !editP ? '1px solid rgba(201,166,104,0.25)' : '1px solid transparent',
              color: tab===item.id && !editP ? 'var(--gold)' : 'var(--cream-dim)',
              fontFamily:'var(--font-b)', fontSize:12, fontWeight:600,
              cursor:'pointer', textAlign:'left', transition:'all 0.2s',
            }}>
              <span>{item.label}</span>
              <span style={{ fontSize:10, background:'rgba(201,166,104,0.12)', padding:'2px 8px', borderRadius:10 }}>{item.count}</span>
            </button>
          ))}
          {/* Edit product sub-item */}
          {editP !== null && (
            <div style={{
              padding:'10px 14px 10px 24px',
              background:'rgba(201,166,104,0.12)',
              border:'1px solid rgba(201,166,104,0.25)',
              color:'var(--gold)', fontFamily:'var(--font-b)', fontSize:11, fontWeight:600 }}>
              ✏ {editP.id ? 'Editando produto' : 'Novo produto'}
            </div>
          )}
        </nav>
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border)', display:'flex', flexDirection:'column', gap:8 }}>
          <button onClick={() => navigate('#/')} style={{ background:'none', border:'none', color:'var(--cream-dim)', fontSize:11, cursor:'pointer', fontFamily:'var(--font-b)', textAlign:'left', letterSpacing:'0.06em' }}>← Ver Site</button>
          <button onClick={() => { setIsAdmin(false); navigate('#/'); }} style={{ background:'none', border:'none', color:'rgba(224,85,85,0.6)', fontSize:11, cursor:'pointer', fontFamily:'var(--font-b)', textAlign:'left' }}>Sair</button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft:230, flex:1, minHeight:'100vh' }}>

        {/* PRODUCT FORM PAGE */}
        {editP !== null && (
          <ProductFormPage product={editP} categories={categories}
            onSave={handleSave} onBack={() => setEditP(null)}/>
        )}

        {/* PRODUCTS LIST */}
        {editP === null && tab === 'products' && (
          <div style={{ padding:'44px 44px 72px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:32 }}>
              <div>
                <h1 style={{ fontFamily:'var(--font-h)', fontSize:40, fontWeight:400, marginBottom:4 }}>Produtos</h1>
                <p style={{ color:'var(--cream-dim)', fontSize:13 }}>
                  {products.length} cadastrados · {products.filter(p => p.active).length} ativos
                </p>
              </div>
              <button onClick={() => setEditP({ ...EMPTY })} style={{
                background:'var(--gold)', color:'#1a0f00', padding:'13px 32px',
                border:'none', fontFamily:'var(--font-b)', fontSize:11, fontWeight:800,
                letterSpacing:'0.14em', textTransform:'uppercase', cursor:'pointer' }}>
                + Novo Produto
              </button>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {products.map(p => (
                <div key={p.id} style={{
                  display:'grid', gridTemplateColumns:'90px 1fr 140px 110px 200px',
                  gap:20, alignItems:'center', padding:'16px 20px',
                  background:'var(--card)', border:'1px solid var(--border)',
                  opacity: p.active ? 1 : 0.55, transition:'opacity 0.2s',
                }}>
                  {/* Thumb */}
                  <div style={{ height:64, overflow:'hidden', border:'1px solid var(--border)', cursor:'pointer' }}
                    onClick={() => setEditP({ ...p })}>
                    {p.image
                      ? <img src={p.image} alt="" onError={e => { e.target.style.display='none'; }}
                          style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                      : <WoodPlaceholder category={p.category}/>
                    }
                  </div>
                  {/* Name */}
                  <div>
                    <p style={{ fontFamily:'var(--font-h)', fontSize:16, marginBottom:3, cursor:'pointer' }}
                      onClick={() => setEditP({ ...p })}>{p.name}</p>
                    <p style={{ color:'var(--cream-dim)', fontSize:11, letterSpacing:'0.05em' }}>
                      {categories.find(c => c.id===p.category)?.name} · {p.material}
                    </p>
                  </div>
                  {/* Price */}
                  <span style={{ fontFamily:'var(--font-h)', fontSize:20, color:'var(--gold)' }}>{fmt(p.price)}</span>
                  {/* Toggle */}
                  <button onClick={() => toggleProduct(p.id)} style={{
                    padding:'7px 0', fontFamily:'var(--font-b)', fontSize:9, fontWeight:800,
                    letterSpacing:'0.12em', textTransform:'uppercase', cursor:'pointer', transition:'all 0.2s',
                    background: p.active ? 'rgba(37,211,102,0.1)' : 'rgba(224,85,85,0.1)',
                    border: `1px solid ${p.active ? 'rgba(37,211,102,0.4)' : 'rgba(224,85,85,0.35)'}`,
                    color: p.active ? 'rgba(37,211,102,0.9)' : 'rgba(224,85,85,0.85)' }}>
                    {p.active ? 'Ativo' : 'Inativo'}
                  </button>
                  {/* Actions */}
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => setEditP({ ...p })} style={{
                      flex:1, padding:'9px', background:'rgba(201,166,104,0.08)',
                      border:'1px solid rgba(201,166,104,0.3)', color:'var(--gold)',
                      fontFamily:'var(--font-b)', fontSize:9, fontWeight:800,
                      letterSpacing:'0.1em', cursor:'pointer', textTransform:'uppercase' }}>
                      Editar
                    </button>
                    <button onClick={() => { if (window.confirm('Excluir este produto?')) deleteProduct(p.id); }} style={{
                      flex:1, padding:'9px', background:'none',
                      border:'1px solid rgba(224,85,85,0.3)', color:'rgba(224,85,85,0.7)',
                      fontFamily:'var(--font-b)', fontSize:9, fontWeight:800,
                      letterSpacing:'0.1em', cursor:'pointer', textTransform:'uppercase' }}>
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CATEGORIES */}
        {editP === null && tab === 'categories' && (
          <div style={{ padding:'44px 44px 72px' }}>
            <h1 style={{ fontFamily:'var(--font-h)', fontSize:40, fontWeight:400, marginBottom:36 }}>Categorias</h1>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:36 }}>
              <div>
                <h3 style={{ fontFamily:'var(--font-h)', fontSize:22, marginBottom:20 }}>Categorias Ativas</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {categories.map(cat => (
                    <div key={cat.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px', background:'var(--card)', border:'1px solid var(--border)' }}>
                      <div>
                        <p style={{ color:'var(--cream)', fontSize:14, fontFamily:'var(--font-b)', fontWeight:600 }}>{cat.name}</p>
                        <p style={{ color:'var(--cream-dim)', fontSize:11, marginTop:3 }}>{products.filter(p => p.category===cat.id).length} produto(s)</p>
                      </div>
                      <button onClick={() => deleteCategory(cat.id)} style={{
                        background:'none', border:'1px solid rgba(224,85,85,0.3)',
                        color:'rgba(224,85,85,0.7)', fontSize:9, fontWeight:800,
                        padding:'6px 12px', cursor:'pointer', fontFamily:'var(--font-b)', letterSpacing:'0.12em', textTransform:'uppercase' }}>
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontFamily:'var(--font-h)', fontSize:22, marginBottom:20 }}>Nova Categoria</h3>
                <div style={{ background:'var(--card)', border:'1px solid var(--border)', padding:'28px', display:'flex', flexDirection:'column', gap:16 }}>
                  {[['Nome da Categoria', 'name', 'Ex: Kits Especiais'], ['ID (slug único)', 'id', 'kits-especiais']].map(([l, k, ph]) => (
                    <div key={k}>
                      <label style={{ fontSize:9, color:'var(--gold-dim)', letterSpacing:'0.2em', textTransform:'uppercase', display:'block', marginBottom:7, fontWeight:700 }}>{l}</label>
                      <input value={newCat[k]} placeholder={ph}
                        onChange={e => setNewCat(c => ({
                          ...c, [k]: e.target.value,
                          ...(k==='name' ? { id: e.target.value.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'') } : {})
                        }))}
                        style={{ width:'100%', padding:'11px 13px', background:'var(--surface)', border:'1px solid var(--border)', color:'var(--cream)', fontFamily:'var(--font-b)', outline:'none', boxSizing:'border-box' }}/>
                    </div>
                  ))}
                  <button onClick={() => { if (newCat.name && newCat.id) { addCategory({ ...newCat }); setNewCat({ id:'', name:'' }); } }} style={{
                    background:'var(--gold)', color:'#1a0f00', padding:'13px',
                    border:'none', fontFamily:'var(--font-b)', fontSize:11, fontWeight:800,
                    letterSpacing:'0.16em', textTransform:'uppercase', cursor:'pointer', marginTop:4 }}>
                    Adicionar Categoria
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {editP === null && tab === 'orders' && (
          <div style={{ padding:'44px 44px 72px' }}>
            <h1 style={{ fontFamily:'var(--font-h)', fontSize:40, fontWeight:400, marginBottom:36 }}>Pedidos</h1>
            {orders.length === 0 ? (
              <div style={{ textAlign:'center', padding:'80px 40px', background:'var(--card)', border:'1px solid var(--border)' }}>
                <div style={{ fontSize:42, color:'var(--gold-dim)', opacity:0.25, marginBottom:16 }}>◻</div>
                <h2 style={{ fontFamily:'var(--font-h)', fontSize:24, fontWeight:400, color:'var(--cream-dim)' }}>Nenhum pedido ainda</h2>
                <p style={{ color:'var(--cream-dim)', fontSize:13, marginTop:8 }}>Os pedidos aparecem aqui ao finalizar compras.</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {[...orders].reverse().map(order => (
                  <div key={order.id} style={{ background:'var(--card)', border:'1px solid var(--border)', padding:'24px 28px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                      <div>
                        <span style={{ color:'var(--gold)', fontFamily:'var(--font-b)', fontWeight:800, fontSize:15, letterSpacing:'0.06em' }}>#{order.id}</span>
                        <span style={{ color:'var(--cream-dim)', fontSize:12, marginLeft:16, fontFamily:'var(--font-b)' }}>
                          {new Date(order.date).toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' })}
                        </span>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <span style={{ fontFamily:'var(--font-h)', fontSize:24, color:'var(--gold)' }}>{fmt(order.total)}</span>
                        <div style={{ fontSize:10, color:'var(--cream-dim)', marginTop:2, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                          {order.payment === 'pix' ? 'Pix' : 'Cartão'}
                        </div>
                      </div>
                    </div>
                    <p style={{ color:'var(--cream-dim)', fontSize:13, marginBottom:14 }}>
                      <strong style={{ color:'var(--cream)' }}>{order.form?.name}</strong>
                      {' · '}{order.form?.phone}
                      {order.form?.city && ` · ${order.form.city}/${order.form.state}`}
                    </p>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      {order.items?.map(item => (
                        <span key={item.product.id} style={{
                          background:'rgba(201,166,104,0.07)', border:'1px solid var(--border)',
                          padding:'4px 12px', fontSize:11, color:'var(--cream-dim)', letterSpacing:'0.04em' }}>
                          {item.product.name} ×{item.qty}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

Object.assign(window, { AdminLoginPage, AdminDashboardPage });
