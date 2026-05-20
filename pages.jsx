// pages.jsx — Home, Shop, ProductDetail
const { useState } = React;

// ── HOME PAGE ──
const HomePage = ({ products, navigate }) => {
  const featured = products.filter(p => p.featured && p.active).slice(0, 4);
  return (
    <div>
      {/* HERO */}
      <section style={{
        minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
        position:'relative', overflow:'hidden',
        background:'radial-gradient(ellipse at 35% 55%, #2c1a0d 0%, #0d0b09 60%)',
      }}>
        {/* Wood grain lines — straight, subtle */}
        <div style={{
          position:'absolute', inset:0, overflow:'hidden', opacity:0.07, pointerEvents:'none'
        }}>
          {[...Array(18)].map((_,i) => (
            <div key={i} style={{
              position:'absolute', left:0, right:0,
              top:`${(100/18)*i}%`,
              height: i%3===0 ? '1px' : '0.5px',
              background:`linear-gradient(to right, transparent 0%, rgba(201,166,104,${i%3===0?0.9:0.5}) 20%, rgba(201,166,104,${i%3===0?0.9:0.5}) 80%, transparent 100%)`,
            }}/>
          ))}
        </div>
        {/* ambient glow */}
        <div style={{
          position:'absolute', top:'20%', left:'15%', width:500, height:500,
          borderRadius:'50%',
          background:'radial-gradient(circle, rgba(201,166,104,0.06) 0%, transparent 70%)',
          pointerEvents:'none'
        }}/>
        <div style={{ textAlign:'center', position:'relative', zIndex:1, padding:'140px 32px 80px', maxWidth:860 }}>
          {/* Logo — scale in */}
          <div style={{ animation:'gbScaleIn 0.9s cubic-bezier(0.22,1,0.36,1) both' }}>
            <GodBlessingLogo size={128}/>
          </div>
          {/* Subtitle */}
          <div style={{
            fontFamily:'var(--font-s)', color:'var(--gold)', fontSize:21, margin:'28px 0 14px', letterSpacing:'0.04em',
            animation:'gbFadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.25s both',
          }}>
            Arte em Madeira
          </div>
          {/* Heading */}
          <h1 style={{
            fontFamily:'var(--font-h)', fontWeight:300, color:'var(--cream)', lineHeight:1.12,
            letterSpacing:'-0.02em', marginBottom:28,
            fontSize:'clamp(44px, 7vw, 86px)',
            animation:'gbFadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.42s both',
          }}>
            Feito com Amor,<br/>
            <em style={{ fontStyle:'italic', color:'var(--gold)', fontWeight:400 }}>Criado com Fé</em>
          </h1>
          {/* Body */}
          <p style={{
            color:'var(--cream-dim)', fontSize:16, lineHeight:1.9,
            maxWidth:520, margin:'0 auto 52px', fontWeight:300,
            animation:'gbFadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.6s both',
          }}>
            Madeiras nobres brasileiras trabalhadas com precisão artesanal e 
            personalização a laser. Cada peça é única, cada gravação é eterna.
          </p>
          {/* Buttons */}
          <div style={{
            display:'flex', gap:16, justifyContent:'center',
            animation:'gbFadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.76s both',
          }}>
            <button onClick={() => navigate('#/loja')} style={{
              background:'var(--gold)', color:'#1a0f00', padding:'15px 44px',
              border:'none', fontFamily:'var(--font-b)', fontSize:12, fontWeight:700,
              letterSpacing:'0.16em', textTransform:'uppercase', cursor:'pointer',
              transition:'all 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.background='var(--gold-light)'}
            onMouseLeave={e => e.currentTarget.style.background='var(--gold)'}>
              Ver Coleção
            </button>
            <button onClick={() => navigate('#/sobre')} style={{
              background:'none', color:'var(--cream)', padding:'15px 44px',
              border:'1px solid rgba(201,166,104,0.35)', fontFamily:'var(--font-b)',
              fontSize:12, fontWeight:500, letterSpacing:'0.16em', textTransform:'uppercase',
              cursor:'pointer', transition:'all 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor='rgba(201,166,104,0.7)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='rgba(201,166,104,0.35)'}>
              Nossa História
            </button>
          </div>
          <div style={{ marginTop:88, display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
            <span style={{
              fontSize:9, letterSpacing:'0.3em', textTransform:'uppercase', color:'var(--cream-dim)',
              animation:'scrollFade 2.4s ease-in-out infinite',
            }}>Role para baixo</span>
            {/* Animated scroll line */}
            <div style={{ position:'relative', width:1, height:52, overflow:'hidden' }}>
              <div style={{
                position:'absolute', top:0, left:0, width:1, height:'100%',
                background:'rgba(201,166,104,0.12)',
              }}/>
              <div style={{
                position:'absolute', left:0, width:1, height:'50%',
                background:'linear-gradient(to bottom, transparent, var(--gold), transparent)',
                animation:'scrollLine 2.4s ease-in-out infinite',
              }}/>
            </div>
            {/* Chevron */}
            <svg width="10" height="6" viewBox="0 0 10 6" style={{ animation:'scrollChevron 2.4s ease-in-out infinite', marginTop:-4 }}>
              <polyline points="1,1 5,5 9,1" fill="none" stroke="rgba(201,166,104,0.45)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </section>

      {/* CRAFT STRIP */}
      <section style={{
        background:'var(--surface)', padding:'52px 48px',
        borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)'
      }}>
        <div style={{ maxWidth:1000, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:40 }}>
          {[
            { sym:'◈', title:'CNC & Laser', sub:'Gravação de alta precisão — qualquer texto, logo ou arte.' },
            { sym:'◇', title:'Madeiras Nobres', sub:'Ipê, Imbuia, Cedrinho e Jatobá selecionados do Brasil.' },
            { sym:'◉', title:'Envio Nacional', sub:'Para todo o Brasil com embalagem premium e seguro.' },
          ].map(({ sym, title, sub }) => (
            <div key={title} style={{ textAlign:'center', padding:'8px' }}>
              <div style={{ fontSize:26, color:'var(--gold)', marginBottom:14, lineHeight:1 }}>{sym}</div>
              <h3 style={{ fontFamily:'var(--font-h)', fontSize:19, fontWeight:600, marginBottom:8 }}>{title}</h3>
              <p style={{ color:'var(--cream-dim)', fontSize:13, lineHeight:1.75 }}>{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding:'80px 48px', maxWidth:1280, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <p style={{ fontFamily:'var(--font-s)', color:'var(--gold)', fontSize:21, marginBottom:8 }}>Nossa Coleção</p>
          <h2 style={{ fontFamily:'var(--font-h)', fontSize:'clamp(30px,4vw,52px)', fontWeight:400 }}>Arte para Cada Momento</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
          {[
            { id:'tabuas', label:'Tábuas de Madeira', sub:'Rústicas & Nobres' },
            { id:'conjuntos', label:'Conjuntos', sub:'Faca + Tábua' },
            { id:'presentes', label:'Presentes', sub:'Personalizados a Laser' },
            { id:'natal', label:'Natal', sub:'Decoração Natalina' },
          ].map(cat => (
            <div key={cat.id}
              onClick={() => navigate(`#/loja?cat=${cat.id}`)}
              style={{ cursor:'pointer', border:'1px solid var(--border)', padding:'32px 20px', textAlign:'center', background:'var(--card)', transition:'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(201,166,104,0.5)'; e.currentTarget.style.transform='translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(201,166,104,0.12)'; e.currentTarget.style.transform='translateY(0)'; }}>
              <div style={{ width:80, height:56, margin:'0 auto 18px', overflow:'hidden', border:'1px solid var(--border)' }}>
                <WoodPlaceholder category={cat.id}/>
              </div>
              <h3 style={{ fontFamily:'var(--font-h)', fontSize:18, fontWeight:600, marginBottom:6 }}>{cat.label}</h3>
              <p style={{ color:'var(--cream-dim)', fontSize:11, letterSpacing:'0.08em' }}>{cat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section style={{ padding:'0 48px 80px', maxWidth:1280, margin:'0 auto' }}>
        <GoldDivider/>
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <p style={{ fontFamily:'var(--font-s)', color:'var(--gold)', fontSize:21, marginBottom:8 }}>Destaques</p>
          <h2 style={{ fontFamily:'var(--font-h)', fontSize:'clamp(28px,3.5vw,48px)', fontWeight:400 }}>Peças Mais Amadas</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24 }}>
          {featured.map(p => <ProductCard key={p.id} product={p} navigate={navigate}/>)}
        </div>
        <div style={{ textAlign:'center', marginTop:48 }}>
          <button onClick={() => navigate('#/loja')} style={{
            background:'none', border:'1px solid var(--gold)', color:'var(--gold)',
            padding:'12px 52px', fontFamily:'var(--font-b)', fontSize:11,
            fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', cursor:'pointer',
            transition:'all 0.3s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(201,166,104,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='none'; }}>
            Ver Todos os Produtos
          </button>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section style={{ padding:'72px 48px', background:'var(--surface)', borderTop:'1px solid var(--border)', textAlign:'center' }}>
        <p style={{ fontFamily:'var(--font-s)', color:'var(--gold)', fontSize:22, marginBottom:10 }}>Nos siga no Instagram</p>
        <h2 style={{ fontFamily:'var(--font-h)', fontSize:38, fontWeight:400, marginBottom:16 }}>@godblessing.brasil</h2>
        <p style={{ color:'var(--cream-dim)', fontSize:14, marginBottom:36 }}>Acompanhe novidades, bastidores e inspirações</p>
        <a href="https://instagram.com/godblessing.brasil" target="_blank" rel="noreferrer" style={{
          display:'inline-block', background:'var(--gold)', color:'#1a0f00', padding:'13px 40px',
          fontFamily:'var(--font-b)', fontSize:11, fontWeight:800,
          letterSpacing:'0.16em', textTransform:'uppercase', transition:'all 0.3s',
        }}>
          Seguir no Instagram
        </a>
      </section>

      <Footer navigate={navigate}/>
    </div>
  );
};

// ── SHOP PAGE ──
const ShopPage = ({ products, categories, navigate, gridCols = 4 }) => {
  const initCat = () => {
    try {
      const p = new URLSearchParams((window.location.hash.split('?')[1]) || '');
      return p.get('cat') || 'all';
    } catch { return 'all'; }
  };
  const [activeCat, setActiveCat] = useState(initCat);
  const [sort, setSort] = useState('featured');

  const allCats = [{ id:'all', name:'Todos' }, ...categories];
  let filtered = products.filter(p => p.active);
  if (activeCat !== 'all') filtered = filtered.filter(p => p.category === activeCat);
  if (sort === 'price_asc') filtered = [...filtered].sort((a,b) => a.price - b.price);
  else if (sort === 'price_desc') filtered = [...filtered].sort((a,b) => b.price - a.price);
  else filtered = [...filtered].sort((a,b) => (b.featured?1:0) - (a.featured?1:0));

  const cols = Math.max(2, Math.min(6, gridCols));

  return (
    <div style={{ paddingTop:76 }}>
      <div style={{ padding:'56px 48px 32px', maxWidth:1280, margin:'0 auto' }}>
        <p style={{ fontFamily:'var(--font-s)', color:'var(--gold)', fontSize:18 }}>Coleção Completa</p>
        <h1 style={{ fontFamily:'var(--font-h)', fontSize:'clamp(36px,5vw,64px)', fontWeight:400 }}>Nossa Loja</h1>
      </div>
      <div style={{ borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', background:'var(--surface)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 48px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', gap:0 }}>
            {allCats.map(cat => (
              <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{
                background:'none', border:'none',
                borderBottom: activeCat===cat.id ? '2px solid var(--gold)' : '2px solid transparent',
                color: activeCat===cat.id ? 'var(--gold)' : 'var(--cream-dim)',
                padding:'16px 22px', fontFamily:'var(--font-b)', fontSize:11,
                fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase',
                cursor:'pointer', transition:'all 0.2s',
              }}>{cat.name}</button>
            ))}
          </div>
          <div style={{ display:'flex', gap:4, alignItems:'center' }}>
            {[['featured','Destaque'],['price_asc','Menor Preço'],['price_desc','Maior Preço']].map(([val,label]) => (
              <button key={val} onClick={() => setSort(val)} style={{
                padding:'8px 16px',
                background: sort===val ? 'rgba(201,166,104,0.12)' : 'none',
                border: `1px solid ${sort===val ? 'rgba(201,166,104,0.45)' : 'rgba(201,166,104,0.12)'}`,
                color: sort===val ? 'var(--gold)' : 'var(--cream-dim)',
                fontFamily:'var(--font-b)', fontSize:10, fontWeight:700,
                letterSpacing:'0.12em', textTransform:'uppercase', cursor:'pointer',
                transition:'all 0.2s',
              }}
              onMouseEnter={e => { if(sort!==val){ e.currentTarget.style.borderColor='rgba(201,166,104,0.3)'; e.currentTarget.style.color='var(--cream)'; }}}
              onMouseLeave={e => { if(sort!==val){ e.currentTarget.style.borderColor='rgba(201,166,104,0.12)'; e.currentTarget.style.color='var(--cream-dim)'; }}}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'44px 48px 80px' }}>
        <p style={{ color:'var(--cream-dim)', fontSize:12, marginBottom:28, letterSpacing:'0.06em' }}>
          {filtered.length} produto{filtered.length!==1?'s':''} encontrado{filtered.length!==1?'s':''}
        </p>
        <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols}, 1fr)`, gap:24 }}>
          {filtered.map(p => <ProductCard key={p.id} product={p} navigate={navigate}/>)}
        </div>
      </div>
      <Footer navigate={navigate}/>
    </div>
  );
};

// ── PRODUCT DETAIL ──
const ProductDetailPage = ({ products, navigate, addToCart }) => {
  const id = parseInt(window.location.hash.split('/').pop());
  const product = products.find(p => p.id === id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const fmt = n => `R$ ${n.toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.')}`;

  if (!product) return (
    <div style={{ paddingTop:160, textAlign:'center', minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
      <h2 style={{ fontFamily:'var(--font-h)', fontSize:32, marginBottom:12 }}>Produto não encontrado</h2>
      <button onClick={() => navigate('#/loja')} style={{
        marginTop:16, background:'var(--gold)', color:'#1a0f00', padding:'12px 36px',
        border:'none', fontFamily:'var(--font-b)', fontSize:12, fontWeight:700,
        letterSpacing:'0.14em', cursor:'pointer',
      }}>Ir para a Loja</button>
    </div>
  );

  const related = products.filter(p => p.category===product.category && p.id!==product.id && p.active).slice(0,4);

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div style={{ paddingTop:76 }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'56px 48px' }}>
        {/* Breadcrumb */}
        <div style={{ display:'flex', gap:8, alignItems:'center', color:'var(--cream-dim)', fontSize:12, marginBottom:52 }}>
          {[['#/', 'Início'], ['#/loja', 'Loja']].map(([p,l]) => (
            <React.Fragment key={p}>
              <button onClick={() => navigate(p)} style={{ background:'none', border:'none', color:'var(--cream-dim)', cursor:'pointer', fontSize:12, fontFamily:'var(--font-b)' }}>{l}</button>
              <span style={{ opacity:0.4 }}>/</span>
            </React.Fragment>
          ))}
          <span style={{ color:'var(--cream)' }}>{product.name}</span>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'start' }}>
          {/* Image */}
          <div style={{ position:'sticky', top:100, height:520, overflow:'hidden', border:'1px solid var(--border)' }}>
            {product.image && !imgErr
              ? <img src={product.image} alt={product.name} onError={() => setImgErr(true)} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              : <WoodPlaceholder category={product.category}/>
            }
          </div>

          {/* Info */}
          <div>
            <div style={{ fontSize:10, color:'var(--gold-dim)', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:14, fontFamily:'var(--font-b)', fontWeight:700 }}>
              {product.material}
            </div>
            <h1 style={{ fontFamily:'var(--font-h)', fontSize:'clamp(28px,3vw,46px)', fontWeight:600, lineHeight:1.2, marginBottom:22 }}>
              {product.name}
            </h1>
            <div style={{ display:'flex', alignItems:'baseline', gap:16, marginBottom:30 }}>
              <span style={{ fontFamily:'var(--font-h)', fontSize:38, fontWeight:600, color:'var(--gold)' }}>
                {fmt(product.price)}
              </span>
              {product.originalPrice && (
                <span style={{ fontSize:18, color:'var(--cream-dim)', textDecoration:'line-through' }}>
                  {fmt(product.originalPrice)}
                </span>
              )}
            </div>
            <GoldDivider/>
            <p style={{ color:'var(--cream-dim)', fontSize:15, lineHeight:1.95, marginBottom:30 }}>
              {product.description}
            </p>
            <div style={{
              background:'rgba(201,166,104,0.05)', border:'1px solid var(--border)',
              padding:'20px 24px', marginBottom:30, display:'grid', gridTemplateColumns:'1fr 1fr', gap:16,
            }}>
              {[['Dimensões', product.dimensions], ['Material', product.material]].map(([k,v]) => (
                <div key={k}>
                  <p style={{ fontSize:9, color:'var(--gold-dim)', letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:5 }}>{k}</p>
                  <p style={{ color:'var(--cream)', fontSize:14 }}>{v}</p>
                </div>
              ))}
            </div>

            {/* Qty + Cart */}
            <div style={{ display:'flex', gap:14, alignItems:'center', marginBottom:14 }}>
              <div style={{ display:'flex', border:'1px solid var(--border)' }}>
                {[['−', ()=>setQty(q=>Math.max(1,q-1))], [qty, null], ['+', ()=>setQty(q=>q+1)]].map(([label, fn], i) => (
                  <button key={i} onClick={fn||undefined} style={{
                    width: i===1 ? 44 : 40, height:46, background:'none',
                    border: i===1 ? '1px solid var(--border)' : 'none',
                    borderTop:'none', borderBottom:'none',
                    color:'var(--cream)', fontSize: i===1 ? 15 : 20,
                    cursor: fn ? 'pointer' : 'default',
                    fontFamily:'var(--font-b)', fontWeight: i===1 ? 500 : 300,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>{label}</button>
                ))}
              </div>
              <button onClick={handleAdd} style={{
                flex:1, height:46,
                background: added ? 'rgba(37,211,102,0.15)' : 'var(--gold)',
                border: added ? '1px solid rgba(37,211,102,0.5)' : 'none',
                color: added ? 'rgba(37,211,102,0.9)' : '#1a0f00',
                fontFamily:'var(--font-b)', fontSize:11, fontWeight:800,
                letterSpacing:'0.16em', textTransform:'uppercase', cursor:'pointer', transition:'all 0.35s',
              }}>
                {added ? 'Adicionado ao Carrinho ✓' : 'Adicionar ao Carrinho'}
              </button>
            </div>
            <a href={`https://wa.me/5500000000000?text=Olá! Tenho interesse: ${encodeURIComponent(product.name)} — ${fmt(product.price)}`}
              target="_blank" rel="noreferrer" style={{
                display:'block', width:'100%', padding:'13px', textAlign:'center',
                border:'1px solid rgba(37,211,102,0.4)',
                color:'rgba(37,211,102,0.85)', fontFamily:'var(--font-b)', fontSize:11,
                fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase',
                transition:'all 0.2s', boxSizing:'border-box',
              }}>
              Pedir via WhatsApp
            </a>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop:80 }}>
            <GoldDivider/>
            <h2 style={{ fontFamily:'var(--font-h)', fontSize:30, marginBottom:32, fontWeight:400 }}>Produtos Relacionados</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24 }}>
              {related.map(p => <ProductCard key={p.id} product={p} navigate={navigate}/>)}
            </div>
          </div>
        )}
      </div>
      <Footer navigate={navigate}/>
    </div>
  );
};

Object.assign(window, { HomePage, ShopPage, ProductDetailPage });
