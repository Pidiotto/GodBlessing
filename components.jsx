// components.jsx — Shared UI components
const { useState, useEffect } = React;

// ── LOGO SVG ──
const GodBlessingLogo = ({ size = 80, onClick }) => (
  <svg width={size} height={size} viewBox="0 0 200 200"
    style={{ cursor: onClick ? 'pointer' : 'default', flexShrink: 0 }}
    onClick={onClick}>
    {/* BG circle */}
    <circle cx="100" cy="100" r="98" fill="#110b04"/>
    {/* Outer gold ring */}
    <circle cx="100" cy="100" r="96" fill="none" stroke="#c9a668" strokeWidth="1.6"/>
    {/* Second ring */}
    <circle cx="100" cy="100" r="88" fill="none" stroke="#c9a668" strokeWidth="0.5"/>
    {/* Dashed inner ring */}
    <circle cx="100" cy="100" r="81" fill="none" stroke="rgba(201,166,104,0.28)" strokeWidth="0.6" strokeDasharray="3,5"/>

    {/* Cross at top */}
    <line x1="100" y1="17" x2="100" y2="46" stroke="#c9a668" strokeWidth="2"/>
    <line x1="85"  y1="28" x2="115" y2="28" stroke="#c9a668" strokeWidth="2"/>
    {/* Small dots flanking cross */}
    <circle cx="72" cy="35" r="1.8" fill="#c9a668" opacity="0.55"/>
    <circle cx="128" cy="35" r="1.8" fill="#c9a668" opacity="0.55"/>

    {/* GOD */}
    <text x="100" y="84" textAnchor="middle"
      fontFamily="'Cormorant Garamond',Georgia,serif"
      fontWeight="700" fontSize="38" fill="#f5ede0" letterSpacing="14">GOD</text>

    {/* Ornamental rule with diamond */}
    <line x1="22" y1="96" x2="78" y2="96" stroke="#c9a668" strokeWidth="0.9"/>
    <polygon points="100,90 107,96 100,102 93,96" fill="#c9a668"/>
    <line x1="122" y1="96" x2="178" y2="96" stroke="#c9a668" strokeWidth="0.9"/>

    {/* Blessing script */}
    <text x="100" y="132" textAnchor="middle"
      fontFamily="'Dancing Script',cursive"
      fontWeight="700" fontSize="42" fill="#c9a668">Blessing</text>

    {/* Thin rule below script */}
    <line x1="38" y1="145" x2="162" y2="145" stroke="rgba(201,166,104,0.35)" strokeWidth="0.7"/>

    {/* ARTE EM MADEIRA — arc path so it never overflows */}
    <defs>
      <path id="arcBottom" d="M 30,140 A 72,72 0 0,0 170,140"/>
    </defs>
    <text fontFamily="'Raleway',sans-serif" fontSize="10.5" fill="#a08050"
      fontWeight="600" letterSpacing="3">
      <textPath href="#arcBottom" startOffset="50%" textAnchor="middle">
        ARTE EM MADEIRA
      </textPath>
    </text>

    {/* Bottom accent trio */}
    <circle cx="72"  cy="178" r="1.6" fill="rgba(201,166,104,0.38)"/>
    <circle cx="100" cy="180" r="2.4" fill="rgba(201,166,104,0.55)"/>
    <circle cx="128" cy="178" r="1.6" fill="rgba(201,166,104,0.38)"/>

    {/* Tiny diamond ornaments at corners */}
    {[[26,68],[174,68],[26,132],[174,132]].map(([x,y],i) => (
      <polygon key={i} points={`${x},${y-4} ${x+3},${y} ${x},${y+4} ${x-3},${y}`} fill="rgba(201,166,104,0.3)"/>
    ))}
  </svg>
);

// ── WOOD TEXTURE PLACEHOLDER ──
const WoodPlaceholder = ({ category = 'tabuas' }) => {
  const palettes = {
    tabuas:    ['#7a4f2d', '#9b6b42', '#5c3a1e'],
    conjuntos: ['#4a2c13', '#7a4f2d', '#3a2010'],
    presentes: ['#8b4513', '#b06020', '#6b2e0e'],
    natal:     ['#3a2815', '#5c4020', '#2a1a0a'],
  };
  const [a, b, c] = palettes[category] || palettes.tabuas;
  return (
    <div style={{
      width:'100%', height:'100%',
      background:`linear-gradient(140deg,${c} 0%,${a} 35%,${b} 65%,${c} 100%)`,
      position:'relative', overflow:'hidden'
    }}>
      <svg width="100%" height="100%" style={{ position:'absolute', inset:0 }} preserveAspectRatio="none">
        {[...Array(20)].map((_,i) => (
          <line key={i} x1="0" y1={`${(100/20)*i}%`} x2="100%"
            y2={`${(100/20)*i + (i%3===0?3.5 : i%3===1?-2.5:1)}%`}
            stroke={`rgba(255,255,255,${i%4===0?0.06:0.02})`} strokeWidth="0.8"/>
        ))}
        {[...Array(5)].map((_,i) => (
          <ellipse key={`k${i}`} cx={`${12+i*18}%`} cy={`${35+Math.sin(i*1.8)*22}%`}
            rx={`${2.5+i%2*1.5}%`} ry="1.8%"
            fill="none" stroke="rgba(0,0,0,0.09)" strokeWidth="0.6"/>
        ))}
      </svg>
      <div style={{ position:'absolute', inset:0,
        background:'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 100%)' }}/>
      <span style={{
        position:'absolute', bottom:8, right:10,
        fontFamily:"'Dancing Script',cursive",
        color:'rgba(255,255,255,0.28)', fontSize:13, letterSpacing:'0.02em'
      }}>God Blessing</span>
    </div>
  );
};

// ── CART ICON ──
const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

// ── NAV ──
const Nav = ({ route, navigate, cartCount }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const link = (path, label) => (
    <button key={path} onClick={() => navigate(path)} style={{
      background:'none', border:'none',
      color: route===path ? 'var(--gold)' : 'var(--cream-dim)',
      fontFamily:'var(--font-b)', fontSize:12, fontWeight:600,
      letterSpacing:'0.14em', textTransform:'uppercase', cursor:'pointer',
      padding:'4px 0',
      borderBottom: route===path ? '1px solid var(--gold)' : '1px solid transparent',
      transition:'color 0.2s',
    }}>{label}</button>
  );

  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:1000,
      background: scrolled ? 'rgba(10,8,6,0.96)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(201,166,104,0.14)' : 'none',
      transition:'all 0.4s ease',
      padding:'0 48px',
    }}>
      <div style={{
        maxWidth:1280, margin:'0 auto',
        display:'flex', alignItems:'center', justifyContent:'space-between', height:76
      }}>
        <GodBlessingLogo size={52} onClick={() => navigate('#/')} />
        <div style={{ display:'flex', gap:36, alignItems:'center' }}>
          {link('#/', 'Início')}
          {link('#/loja', 'Loja')}
          {link('#/sobre', 'Sobre')}
          <button onClick={() => navigate('#/carrinho')} style={{
            position:'relative', background:'none',
            border:'1px solid var(--border)', padding:'9px 20px',
            color:'var(--cream)', cursor:'pointer',
            display:'flex', alignItems:'center', gap:8,
            fontFamily:'var(--font-b)', fontSize:12, fontWeight:600,
            letterSpacing:'0.1em', textTransform:'uppercase',
            transition:'border-color 0.2s',
          }}
          onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(201,166,104,0.5)'}
          onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(201,166,104,0.15)'}>
            <CartIcon/>
            <span>Carrinho</span>
            {cartCount > 0 && (
              <span style={{
                position:'absolute', top:-9, right:-9,
                background:'var(--gold)', color:'#1a0f00',
                borderRadius:'50%', width:20, height:20,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:10, fontWeight:800,
              }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

// ── PRODUCT CARD ──
const ProductCard = ({ product, navigate, revealDelay = 0 }) => {
  const [hov, setHov]       = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = React.useRef(null);

  // Scroll-reveal via IntersectionObserver
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const fmt = n => `R$ ${n.toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.')}`;

  return (
    <div ref={ref} className="gb-reveal" style={{ animationDelay:`${revealDelay}ms` }}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={() => navigate(`#/produto/${product.id}`)}
        style={{
          cursor:'pointer', overflow:'hidden', height:'100%',
          border:`1px solid ${hov ? 'rgba(201,166,104,0.45)' : 'rgba(201,166,104,0.12)'}`,
          background:'var(--card)',
          transform: hov ? 'translateY(-5px)' : 'translateY(0)',
          boxShadow: hov
            ? '0 20px 56px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,166,104,0.08)'
            : '0 4px 16px rgba(0,0,0,0.25)',
          transition:'all 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}>
      <div style={{ height:240, position:'relative', overflow:'hidden' }}>
        {/* Shimmer skeleton until image loads */}
        {!loaded && !imgErr && product.image && (
          <div style={{
            position:'absolute', inset:0, zIndex:1,
            background:'linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.11) 50%,rgba(255,255,255,0.04) 75%)',
            backgroundSize:'600px 100%',
            animation:'gbShimmer 1.5s linear infinite',
          }}/>
        )}
        {product.image && !imgErr ? (
          <img src={product.image} alt={product.name}
            onLoad={() => setLoaded(true)}
            onError={() => setImgErr(true)}
            style={{
              width:'100%', height:'100%', objectFit:'cover',
              transform: hov ? 'scale(1.07)' : 'scale(1)',
              transition:'transform 0.5s ease, opacity 0.55s ease',
              opacity: loaded ? 1 : 0,
            }}/>
        ) : (
          <WoodPlaceholder category={product.category}/>
        )}
        {product.originalPrice && (
          <div style={{
            position:'absolute', top:12, left:0,
            background:'var(--gold)', color:'#1a0f00',
            fontSize:9, fontWeight:800, letterSpacing:'0.14em',
            textTransform:'uppercase', padding:'5px 10px',
          }}>Promoção</div>
        )}
        {product.customizable && (
          <div style={{
            position:'absolute', top:12, right:12,
            background:'rgba(10,8,6,0.88)',
            border:'1px solid rgba(201,166,104,0.4)',
            color:'var(--gold)', fontSize:9, fontWeight:700,
            letterSpacing:'0.12em', textTransform:'uppercase', padding:'3px 8px',
          }}>Personalizável</div>
        )}
      </div>
      <div style={{ padding:'20px 22px 24px' }}>
        <div style={{
          fontSize:10, color:'var(--gold-dim)', letterSpacing:'0.18em',
          textTransform:'uppercase', marginBottom:7,
          fontFamily:'var(--font-b)', fontWeight:600,
        }}>{product.material}</div>
        <h3 style={{
          fontFamily:'var(--font-h)', fontSize:18, fontWeight:600,
          color:'var(--cream)', marginBottom:14, lineHeight:1.3,
        }}>{product.name}</h3>
        <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
          <span style={{ fontFamily:'var(--font-h)', fontSize:23, fontWeight:600, color:'var(--gold)' }}>
            {fmt(product.price)}
          </span>
          {product.originalPrice && (
            <span style={{ fontSize:13, color:'var(--cream-dim)', textDecoration:'line-through' }}>
              {fmt(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

// ── GOLD DIVIDER ──
const GoldDivider = () => (
  <div style={{ display:'flex', alignItems:'center', gap:16, margin:'40px 0' }}>
    <div style={{ flex:1, height:1, background:'linear-gradient(to right, transparent, rgba(201,166,104,0.4))' }}/>
    <svg width="14" height="14" viewBox="0 0 14 14">
      <polygon points="7,0 9,5 14,5 10,8 12,13 7,10 2,13 4,8 0,5 5,5"
        fill="var(--gold)" opacity="0.6"/>
    </svg>
    <div style={{ flex:1, height:1, background:'linear-gradient(to left, transparent, rgba(201,166,104,0.4))' }}/>
  </div>
);

// ── FOOTER ──
const Footer = ({ navigate }) => (
  <footer style={{
    background:'var(--surface)', borderTop:'1px solid var(--border)',
    padding:'64px 48px 36px'
  }}>
    <div style={{ maxWidth:1280, margin:'0 auto' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr 1fr', gap:56, marginBottom:52 }}>
        <div>
          <GodBlessingLogo size={72} onClick={() => navigate('#/')}/>
          <p style={{ fontFamily:'var(--font-s)', color:'var(--gold)', fontSize:19, margin:'18px 0 10px' }}>
            Arte em Madeira
          </p>
          <p style={{ color:'var(--cream-dim)', fontSize:13, lineHeight:1.9, maxWidth:280 }}>
            Madeiras nobres brasileiras trabalhadas com amor, fé e precisão artesanal.
            Cada peça conta uma história única.
          </p>
        </div>
        <div>
          <h4 style={{
            fontFamily:'var(--font-b)', fontSize:11, letterSpacing:'0.2em',
            textTransform:'uppercase', color:'var(--gold)', marginBottom:20
          }}>Navegação</h4>
          {[['#/', 'Início'], ['#/loja', 'Loja'], ['#/sobre', 'Nossa História'], ['#/carrinho', 'Carrinho']].map(([p,l]) => (
            <button key={p} onClick={() => navigate(p)} style={{
              display:'block', background:'none', border:'none',
              color:'var(--cream-dim)', fontSize:13, cursor:'pointer',
              padding:'6px 0', fontFamily:'var(--font-b)',
              transition:'color 0.2s', textAlign:'left',
            }}
            onMouseEnter={e=>e.currentTarget.style.color='var(--cream)'}
            onMouseLeave={e=>e.currentTarget.style.color='var(--cream-dim)'}>
              {l}
            </button>
          ))}
        </div>
        <div>
          <h4 style={{
            fontFamily:'var(--font-b)', fontSize:11, letterSpacing:'0.2em',
            textTransform:'uppercase', color:'var(--gold)', marginBottom:20
          }}>Contato</h4>
          <p style={{ color:'var(--cream-dim)', fontSize:13, lineHeight:2.2 }}>
            @godblessing.brasil<br/>
            w.app/godblessingbrasil<br/>
            Envio para todo Brasil
          </p>
        </div>
      </div>
      <div style={{
        borderTop:'1px solid var(--border)', paddingTop:24,
        display:'flex', justifyContent:'space-between', alignItems:'center'
      }}>
        <p style={{ color:'rgba(255,255,255,0.2)', fontSize:12 }}>
          © 2026 God Blessing | Arte em Madeira
        </p>
        <button onClick={() => navigate('#/admin/login')} style={{
          background:'none', border:'none', color:'rgba(255,255,255,0.1)',
          fontSize:11, cursor:'pointer', fontFamily:'var(--font-b)', letterSpacing:'0.1em'
        }}>Admin</button>
      </div>
    </div>
  </footer>
);

Object.assign(window, {
  GodBlessingLogo, WoodPlaceholder, CartIcon, Nav, ProductCard, GoldDivider, Footer
});
