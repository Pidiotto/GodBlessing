// pages2.jsx — Cart, Checkout, About
const { useState } = React;

const fmt = n => `R$ ${n.toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.')}`;

// Tiny image helper with fallback
const CartItemImg = ({ product }) => {
  const [err, setErr] = useState(false);
  return product.image && !err
    ? <img src={product.image} alt={product.name} onError={() => setErr(true)}
        style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
    : <WoodPlaceholder category={product.category}/>;
};

// ── FREIGHT CALCULATOR ENGINE ──
// Peso estimado por categoria (kg)
const PESO_CAT = { tabuas:1.2, conjuntos:2.0, presentes:1.0, natal:0.6 };

const calcFrete = (cep, cart) => {
  // Peso total real
  const pesoTotal = cart.reduce((s, i) => {
    const base = PESO_CAT[i.product.category] || 1.0;
    return s + base * i.qty;
  }, 0);

  // Região por prefixo CEP (2 primeiros dígitos)
  const prefix = parseInt((cep.replace(/\D/g,'') || '00000').substring(0,2));
  // Zona: 1=SP capital, 2=SP interior/Sul próx, 3=Sul+RJ+MG, 4=Centro-Oeste+NE litoral, 5=Norte/NE interior
  let zona = 1;
  if      (prefix >= 1  && prefix <= 9)  zona = 1; // SP capital
  else if (prefix >= 10 && prefix <= 19) zona = 1; // Grande SP
  else if (prefix >= 20 && prefix <= 28) zona = 2; // RJ
  else if (prefix >= 29 && prefix <= 29) zona = 3; // ES
  else if (prefix >= 30 && prefix <= 39) zona = 2; // MG
  else if (prefix >= 40 && prefix <= 48) zona = 3; // BA
  else if (prefix >= 49 && prefix <= 49) zona = 3; // SE
  else if (prefix >= 50 && prefix <= 56) zona = 3; // PE/AL
  else if (prefix >= 57 && prefix <= 57) zona = 4; // AL interior
  else if (prefix >= 58 && prefix <= 59) zona = 4; // PB/RN
  else if (prefix >= 60 && prefix <= 63) zona = 4; // CE
  else if (prefix >= 64 && prefix <= 64) zona = 5; // PI
  else if (prefix >= 65 && prefix <= 65) zona = 4; // MA/PA
  else if (prefix >= 66 && prefix <= 68) zona = 5; // PA/AP/AM
  else if (prefix >= 69 && prefix <= 69) zona = 5; // RR/AC/RO
  else if (prefix >= 70 && prefix <= 73) zona = 3; // DF/GO
  else if (prefix >= 74 && prefix <= 76) zona = 3; // GO/MT
  else if (prefix >= 77 && prefix <= 77) zona = 4; // TO
  else if (prefix >= 78 && prefix <= 78) zona = 3; // MT
  else if (prefix >= 79 && prefix <= 79) zona = 3; // MS
  else if (prefix >= 80 && prefix <= 87) zona = 2; // PR
  else if (prefix >= 88 && prefix <= 89) zona = 2; // SC
  else if (prefix >= 90 && prefix <= 99) zona = 2; // RS

  // Tabela base por zona (R$/kg + fixo)
  const tabela = [
    { zona:1, pac:[7.50,  2.80], sedex:[14.00,  5.00], transp:[9.00,  3.50] },
    { zona:2, pac:[10.00, 3.50], sedex:[22.00,  6.00], transp:[12.00, 4.00] },
    { zona:3, pac:[13.00, 4.00], sedex:[31.00,  7.50], transp:[15.00, 4.50] },
    { zona:4, pac:[17.00, 5.00], sedex:[42.00,  9.00], transp:[20.00, 5.50] },
    { zona:5, pac:[22.00, 6.50], sedex:[58.00, 12.00], transp:[28.00, 7.00] },
  ];
  const t = tabela.find(r => r.zona === zona) || tabela[0];

  // Peso cubado (tábuas: 35x20x3cm = 2100cm³ ÷ 300 = 7kg cubado... usamos o maior)
  const pesoCubado = pesoTotal * 1.4; // fator simplificado de madeira em caixa
  const pesoCobranca = Math.max(pesoTotal, pesoCubado);

  const calc = ([fixo, porKg]) => Math.max(fixo, fixo + porKg * pesoCobranca);

  // Prazos por zona (dias úteis)
  const prazoPac   = [5,6,8,10,14][zona-1];
  const prazoSedex = [1,2,3,4,6][zona-1];
  const prazoTransp= [4,5,6,8,12][zona-1];

  return [
    {
      id:'pac', nome:'PAC - Correios',
      preco: calc(t.pac),
      prazo: prazoPac,
      tag: 'Econômico',
    },
    {
      id:'sedex', nome:'SEDEX - Correios',
      preco: calc(t.sedex),
      prazo: prazoSedex,
      tag: 'Expresso',
    },
    {
      id:'transportadora', nome:'Transportadora',
      preco: calc(t.transp),
      prazo: prazoTransp,
      tag: 'Recomendado',
    },
  ];
};

// ── FREIGHT SELECTOR WIDGET ──
const FreteWidget = ({ cart, onSelect, selected }) => {
  const [cep,      setCep]     = useState('');
  const [options,  setOptions] = useState(null);
  const [loading,  setLoading] = useState(false);
  const [erro,     setErro]    = useState('');

  const calcular = () => {
    const raw = cep.replace(/\D/g,'');
    if (raw.length !== 8) { setErro('CEP inválido. Digite 8 dígitos.'); return; }
    setErro(''); setLoading(true); setOptions(null);
    setTimeout(() => {
      const opts = calcFrete(raw, cart);
      setOptions(opts);
      onSelect(opts[2]); // default: transportadora
      setLoading(false);
    }, 900);
  };

  const fmtCep = v => {
    const d = v.replace(/\D/g,'').substring(0,8);
    return d.length > 5 ? d.substring(0,5) + '-' + d.substring(5) : d;
  };

  return (
    <div style={{ marginBottom:20 }}>
      <p style={{ fontSize:9, color:'var(--gold-dim)', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:10, fontWeight:700 }}>
        Calcular Frete
      </p>

      {/* CEP input */}
      <div style={{ display:'flex', gap:0 }}>
        <input
          value={cep} placeholder="00000-000"
          onChange={e => { setCep(fmtCep(e.target.value)); setErro(''); setOptions(null); onSelect(null); }}
          onKeyDown={e => e.key==='Enter' && calcular()}
          style={{
            flex:1, padding:'11px 14px', background:'var(--surface)',
            border:'1px solid var(--border)', borderRight:'none',
            color:'var(--cream)', fontFamily:'var(--font-b)', fontSize:14,
            outline:'none', letterSpacing:'0.05em',
          }}/>
        <button onClick={calcular} disabled={loading} style={{
          padding:'11px 18px', background:'var(--gold)', border:'none',
          color:'#1a0f00', fontFamily:'var(--font-b)', fontSize:10,
          fontWeight:800, letterSpacing:'0.12em', textTransform:'uppercase',
          cursor:'pointer', whiteSpace:'nowrap',
          opacity: loading ? 0.7 : 1, transition:'opacity 0.2s',
        }}>
          {loading ? '...' : 'Calcular'}
        </button>
      </div>
      {erro && <p style={{ color:'rgba(224,85,85,0.8)', fontSize:11, marginTop:6 }}>{erro}</p>}

      {/* Loading shimmer */}
      {loading && (
        <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:8 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{
              height:54, borderRadius:0,
              background:'linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.09) 50%,rgba(255,255,255,0.04) 75%)',
              backgroundSize:'400px 100%',
              animation:'gbShimmer 1.4s linear infinite',
              border:'1px solid var(--border)',
            }}/>
          ))}
        </div>
      )}

      {/* Options */}
      {options && !loading && (
        <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:8 }}>
          {options.map(opt => (
            <button key={opt.id} onClick={() => onSelect(opt)} style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'13px 16px',
              background: selected?.id===opt.id ? 'rgba(201,166,104,0.1)' : 'var(--surface)',
              border: `1px solid ${selected?.id===opt.id ? 'rgba(201,166,104,0.55)' : 'var(--border)'}`,
              cursor:'pointer', transition:'all 0.2s', textAlign:'left', width:'100%',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                {/* Radio */}
                <div style={{
                  width:14, height:14, borderRadius:'50%',
                  border:`2px solid ${selected?.id===opt.id ? 'var(--gold)' : 'rgba(255,255,255,0.2)'}`,
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                }}>
                  {selected?.id===opt.id && <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--gold)' }}/>}
                </div>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ color:'var(--cream)', fontSize:12, fontFamily:'var(--font-b)', fontWeight:600 }}>{opt.nome}</span>
                    {opt.tag==='Recomendado' && (
                      <span style={{ fontSize:8, background:'rgba(201,166,104,0.15)', color:'var(--gold)', padding:'2px 6px', fontFamily:'var(--font-b)', fontWeight:800, letterSpacing:'0.1em' }}>★ MELHOR</span>
                    )}
                  </div>
                  <span style={{ color:'var(--cream-dim)', fontSize:11, fontFamily:'var(--font-b)' }}>
                    Prazo: {opt.prazo} dia{opt.prazo!==1?'s':''} útei{opt.prazo!==1?'s':'l'}
                  </span>
                </div>
              </div>
              <span style={{
                fontFamily:'var(--font-h)', fontSize:17,
                color: selected?.id===opt.id ? 'var(--gold)' : 'var(--cream)',
                fontWeight:600,
              }}>{fmt(opt.preco)}</span>
            </button>
          ))}
          <p style={{ fontSize:10, color:'var(--cream-dim)', marginTop:4, lineHeight:1.6 }}>
            * Valores estimados. Frete final confirmado no fechamento do pedido.
          </p>
        </div>
      )}
    </div>
  );
};

// ── CART PAGE ──
const CartPage = ({ cart, navigate, updateCart, removeFromCart }) => {
  const [freteSelected, setFreteSelected] = useState(null);
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const freteVal = freteSelected ? freteSelected.preco : (subtotal > 300 ? 0 : null);
  const total    = subtotal + (freteVal || 0);

  if (!cart.length) return (
    <div style={{ paddingTop:76, minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, textAlign:'center', padding:'160px 32px' }}>
      <div style={{ width:72, height:72, border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:8 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold-dim)" strokeWidth="1.2">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
        </svg>
      </div>
      <h2 style={{ fontFamily:'var(--font-h)', fontSize:34, fontWeight:400 }}>Seu carrinho está vazio</h2>
      <p style={{ color:'var(--cream-dim)', fontSize:14, maxWidth:340 }}>Explore nossa coleção e encontre peças únicas em madeira nobre.</p>
      <button onClick={() => navigate('#/loja')} style={{
        marginTop:12, background:'var(--gold)', color:'#1a0f00', padding:'13px 44px',
        border:'none', fontFamily:'var(--font-b)', fontSize:11,
        fontWeight:800, letterSpacing:'0.16em', textTransform:'uppercase', cursor:'pointer',
      }}>Ir para a Loja</button>
    </div>
  );

  return (
    <div style={{ paddingTop:76, minHeight:'100vh' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'56px 48px 80px' }}>
        <h1 style={{ fontFamily:'var(--font-h)', fontSize:52, fontWeight:400, marginBottom:48 }}>Carrinho</h1>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:48, alignItems:'start' }}>

          {/* Items */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {cart.map(item => (
              <div key={item.product.id} style={{
                display:'grid', gridTemplateColumns:'110px 1fr auto',
                gap:22, padding:'20px', background:'var(--card)', border:'1px solid var(--border)',
              }}>
                <div role="button" onClick={() => navigate(`#/produto/${item.product.id}`)}
                  style={{ cursor:'pointer', height:84, overflow:'hidden', border:'1px solid var(--border)' }}>
                  <CartItemImg product={item.product}/>
                </div>
                <div>
                  <h3 style={{ fontFamily:'var(--font-h)', fontSize:17, marginBottom:3 }}>{item.product.name}</h3>
                  <p style={{ color:'var(--cream-dim)', fontSize:11, letterSpacing:'0.06em', marginBottom:14 }}>{item.product.material}</p>
                  <div style={{ display:'flex', border:'1px solid var(--border)', width:'fit-content' }}>
                    <button onClick={() => updateCart(item.product.id, Math.max(1, item.qty-1))}
                      style={{ width:34, height:34, background:'none', border:'none', color:'var(--cream)', cursor:'pointer', fontSize:18 }}>−</button>
                    <span style={{ width:38, height:34, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color:'var(--cream)', borderLeft:'1px solid var(--border)', borderRight:'1px solid var(--border)' }}>{item.qty}</span>
                    <button onClick={() => updateCart(item.product.id, item.qty+1)}
                      style={{ width:34, height:34, background:'none', border:'none', color:'var(--cream)', cursor:'pointer', fontSize:18 }}>+</button>
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', justifyContent:'space-between' }}>
                  <span style={{ fontFamily:'var(--font-h)', fontSize:22, color:'var(--gold)' }}>{fmt(item.product.price * item.qty)}</span>
                  <button onClick={() => removeFromCart(item.product.id)} style={{
                    background:'none', border:'none', color:'var(--cream-dim)',
                    fontSize:10, cursor:'pointer', letterSpacing:'0.12em',
                    fontFamily:'var(--font-b)', fontWeight:600, textTransform:'uppercase',
                  }}>Remover</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', padding:'32px', position:'sticky', top:100 }}>
            <h3 style={{ fontFamily:'var(--font-h)', fontSize:22, marginBottom:24 }}>Resumo do Pedido</h3>

            {/* Frete widget */}
            <FreteWidget cart={cart} onSelect={setFreteSelected} selected={freteSelected}/>

            <div style={{ height:1, background:'var(--border)', marginBottom:20 }}/>

            <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:24 }}>
              <div style={{ display:'flex', justifyContent:'space-between', color:'var(--cream-dim)', fontSize:14 }}>
                <span>Subtotal</span><span>{fmt(subtotal)}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:14 }}>
                <span style={{ color:'var(--cream-dim)' }}>Frete</span>
                {freteSelected ? (
                  <div style={{ textAlign:'right' }}>
                    <span style={{ color:'var(--cream)' }}>{fmt(freteSelected.preco)}</span>
                    <div style={{ fontSize:10, color:'var(--cream-dim)', marginTop:2 }}>
                      {freteSelected.prazo} dias úteis
                    </div>
                  </div>
                ) : subtotal > 300 ? (
                  <span style={{ color:'rgba(37,211,102,0.85)' }}>Grátis</span>
                ) : (
                  <span style={{ color:'var(--cream-dim)', fontSize:12 }}>calcule ao lado</span>
                )}
              </div>
              <div style={{ height:1, background:'var(--border)' }}/>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontFamily:'var(--font-h)', fontSize:18 }}>Total</span>
                <span style={{ fontFamily:'var(--font-h)', fontSize:26, color:'var(--gold)' }}>
                  {freteSelected || subtotal > 300 ? fmt(total) : '—'}
                </span>
              </div>
            </div>

            {subtotal > 300 && (
              <p style={{ fontSize:11, color:'rgba(37,211,102,0.75)', marginBottom:16, padding:'10px 12px', background:'rgba(37,211,102,0.06)', border:'1px solid rgba(37,211,102,0.2)', lineHeight:1.6 }}>
                ✓ Parabéns! Você ganhou frete grátis neste pedido.
              </p>
            )}

            <button
              onClick={() => navigate('#/checkout')}
              disabled={!freteSelected && subtotal <= 300}
              style={{
                width:'100%', background:'var(--gold)', color:'#1a0f00', padding:'15px',
                border:'none', fontFamily:'var(--font-b)', fontSize:11, fontWeight:800,
                letterSpacing:'0.18em', textTransform:'uppercase', cursor:'pointer',
                marginBottom:10,
                opacity: (!freteSelected && subtotal <= 300) ? 0.4 : 1,
                transition:'opacity 0.2s',
              }}>
              {!freteSelected && subtotal <= 300 ? 'Calcule o Frete ↑' : 'Finalizar Compra →'}
            </button>
            <button onClick={() => navigate('#/loja')} style={{
              width:'100%', background:'none', color:'var(--cream-dim)', padding:'12px',
              border:'none', fontFamily:'var(--font-b)', fontSize:12, cursor:'pointer',
            }}>← Continuar Comprando</button>
          </div>
        </div>
      </div>
      <Footer navigate={navigate}/>
    </div>
  );
};

// ── CHECKOUT PAGE ──
const CheckoutPage = ({ cart, navigate, placeOrder }) => {
  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState('pix');
  const [form, setForm] = useState({ name:'', email:'', phone:'', cep:'', address:'', city:'', state:'' });
  const [card, setCard] = useState({ number:'', name:'', expiry:'', cvv:'' });
  const [orderId] = useState(() => 'GB' + Date.now().toString().slice(-6));
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const frete    = subtotal > 300 ? 0 : 29.90;
  const total    = subtotal + frete;
  const pixKey   = 'godblessing@pix.com.br';
  const [copied, setCopied]  = useState(false);

  const copyPix = () => {
    navigator.clipboard?.writeText(pixKey).catch(()=>{});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleNext = () => {
    if (step === 1) { setStep(2); window.scrollTo(0,0); return; }
    placeOrder({ id:orderId, items:[...cart], total, form, payment, date:new Date().toISOString() });
    setStep(3);
  };

  if (step === 3) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'100px 32px' }}>
      <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(201,166,104,0.1)', border:'2px solid var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, margin:'0 auto 28px' }}>
        ✓
      </div>
      <p style={{ fontFamily:'var(--font-s)', color:'var(--gold)', fontSize:22, marginBottom:10 }}>Pedido Confirmado!</p>
      <h2 style={{ fontFamily:'var(--font-h)', fontSize:42, fontWeight:400, marginBottom:18 }}>
        Obrigado, {form.name.split(' ')[0] || 'cliente'}!
      </h2>
      <p style={{ color:'var(--cream-dim)', fontSize:15, lineHeight:1.9, maxWidth:460, marginBottom:10 }}>
        Seu pedido <strong style={{ color:'var(--gold)' }}>#{orderId}</strong> foi recebido com sucesso.<br/>
        Entraremos em contato pelo WhatsApp em breve.
      </p>
      <p style={{ color:'var(--cream-dim)', fontSize:13, marginBottom:44 }}>
        Total pago: <strong style={{ color:'var(--cream)' }}>{fmt(total)}</strong>
      </p>
      <div style={{ display:'flex', gap:14 }}>
        <button onClick={() => navigate('#/')} style={{
          background:'var(--gold)', color:'#1a0f00', padding:'13px 36px',
          border:'none', fontFamily:'var(--font-b)', fontSize:11, fontWeight:800,
          letterSpacing:'0.14em', textTransform:'uppercase', cursor:'pointer',
        }}>Voltar ao Início</button>
        <a href={`https://wa.me/5500000000000?text=Olá! Acabei de fazer o pedido %23${orderId} no valor de ${fmt(total)}. Aguardo confirmação!`}
          target="_blank" rel="noreferrer" style={{
            display:'inline-flex', alignItems:'center', padding:'13px 32px',
            border:'1px solid rgba(37,211,102,0.4)', color:'rgba(37,211,102,0.85)',
            fontFamily:'var(--font-b)', fontSize:11, fontWeight:700,
            letterSpacing:'0.12em', textTransform:'uppercase',
          }}>Confirmar no WhatsApp</a>
      </div>
    </div>
  );

  const labelStyle = { fontSize:9, color:'var(--gold-dim)', letterSpacing:'0.2em', textTransform:'uppercase', display:'block', marginBottom:7, fontWeight:700 };
  const inputStyle = { width:'100%', padding:'12px 14px', background:'var(--card)', border:'1px solid var(--border)', color:'var(--cream)', fontFamily:'var(--font-b)', fontSize:14, outline:'none', boxSizing:'border-box' };

  return (
    <div style={{ paddingTop:76, minHeight:'100vh' }}>
      <div style={{ maxWidth:1020, margin:'0 auto', padding:'52px 48px 80px' }}>
        <h1 style={{ fontFamily:'var(--font-h)', fontSize:48, fontWeight:400, marginBottom:14 }}>
          {step===1 ? 'Seus Dados' : 'Pagamento'}
        </h1>
        {/* Step tabs */}
        <div style={{ display:'flex', borderBottom:'1px solid var(--border)', marginBottom:48 }}>
          {['1. Informações', '2. Pagamento'].map((s,i) => (
            <div key={s} style={{
              padding:'14px 24px', fontSize:11, fontFamily:'var(--font-b)', fontWeight:700,
              letterSpacing:'0.14em', textTransform:'uppercase',
              color: step===i+1 ? 'var(--cream)' : step>i+1 ? 'var(--gold)' : 'var(--cream-dim)',
              borderBottom: step===i+1 ? '2px solid var(--gold)' : '2px solid transparent',
              cursor: step>i+1 ? 'pointer' : 'default', transition:'color 0.2s',
            }} onClick={() => step>i+1 && setStep(i+1)}>{s}</div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:48, alignItems:'start' }}>
          {/* Form */}
          <div>
            {step===1 ? (
              <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <div><label style={labelStyle}>Nome Completo *</label><input style={inputStyle} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Seu nome completo"/></div>
                  <div><label style={labelStyle}>WhatsApp *</label><input style={inputStyle} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="(00) 00000-0000"/></div>
                </div>
                <div><label style={labelStyle}>E-mail *</label><input style={inputStyle} value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="seu@email.com"/></div>
                <div style={{ display:'grid', gridTemplateColumns:'140px 1fr', gap:16 }}>
                  <div><label style={labelStyle}>CEP *</label><input style={inputStyle} value={form.cep} onChange={e=>setForm({...form,cep:e.target.value})} placeholder="00000-000"/></div>
                  <div><label style={labelStyle}>Endereço *</label><input style={inputStyle} value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="Rua, número, bairro"/></div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 100px', gap:16 }}>
                  <div><label style={labelStyle}>Cidade *</label><input style={inputStyle} value={form.city} onChange={e=>setForm({...form,city:e.target.value})} placeholder="Sua cidade"/></div>
                  <div><label style={labelStyle}>Estado</label><input style={inputStyle} value={form.state} onChange={e=>setForm({...form,state:e.target.value})} placeholder="UF"/></div>
                </div>
              </div>
            ) : (
              <div>
                {/* Payment toggle */}
                <div style={{ display:'flex', border:'1px solid var(--border)', marginBottom:36 }}>
                  {[['pix','Pix'], ['cartao','Cartão de Crédito']].map(([m,l],i) => (
                    <button key={m} onClick={() => setPayment(m)} style={{
                      flex:1, padding:'15px', background: payment===m ? 'rgba(201,166,104,0.1)' : 'none',
                      border:'none', borderRight: i===0 ? '1px solid var(--border)' : 'none',
                      color: payment===m ? 'var(--gold)' : 'var(--cream-dim)',
                      fontFamily:'var(--font-b)', fontSize:11, fontWeight:700,
                      letterSpacing:'0.14em', textTransform:'uppercase', cursor:'pointer', transition:'all 0.2s',
                    }}>{l}</button>
                  ))}
                </div>

                {payment==='pix' ? (
                  <div style={{ textAlign:'center' }}>
                    <p style={{ color:'var(--cream-dim)', fontSize:14, marginBottom:28 }}>Escaneie o QR Code ou copie a chave Pix</p>
                    {/* Simulated QR */}
                    <div style={{ width:200, height:200, margin:'0 auto 24px', background:'#fff', padding:14, display:'inline-block' }}>
                      <svg width="172" height="172" viewBox="0 0 172 172">
                        {/* Corner patterns */}
                        {[[4,4],[100,4],[4,100]].map(([x,y],i) => (
                          <g key={i}>
                            <rect x={x} y={y} width="68" height="68" rx="4" fill="none" stroke="#111" strokeWidth="7"/>
                            <rect x={x+16} y={y+16} width="36" height="36" rx="2" fill="#111"/>
                          </g>
                        ))}
                        {/* Data modules */}
                        {[...Array(7)].map((_,r) => [...Array(7)].map((_,c) => {
                          const skip = (r<6&&c<6)||(r<6&&c>5&&c<7)||(r>5&&r<7&&c<6);
                          const on   = (r*11+c*7+r*c*3)%5>1;
                          if (!on) return null;
                          return <rect key={`${r}-${c}`} x={80+c*12} y={80+r*12} width={10} height={10} fill="#111"/>;
                        }))}
                      </svg>
                    </div>
                    <div style={{
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      background:'var(--card)', border:'1px solid var(--border)',
                      padding:'13px 18px', maxWidth:340, margin:'0 auto 16px',
                    }}>
                      <span style={{ fontSize:13, color:'var(--cream)', fontFamily:'var(--font-b)' }}>{pixKey}</span>
                      <button onClick={copyPix} style={{
                        background: copied ? 'rgba(37,211,102,0.2)' : 'var(--gold)',
                        color: copied ? 'rgba(37,211,102,0.9)' : '#1a0f00',
                        border:'none', padding:'7px 14px',
                        fontSize:9, fontWeight:800, letterSpacing:'0.12em',
                        cursor:'pointer', fontFamily:'var(--font-b)', transition:'all 0.3s',
                      }}>{copied ? 'COPIADO ✓' : 'COPIAR'}</button>
                    </div>
                    <p style={{ color:'var(--cream-dim)', fontSize:13 }}>
                      Valor: <strong style={{ color:'var(--gold)', fontSize:16 }}>{fmt(total)}</strong>
                    </p>
                  </div>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                    <div><label style={labelStyle}>Número do Cartão</label><input style={inputStyle} value={card.number} onChange={e=>setCard({...card,number:e.target.value})} placeholder="0000 0000 0000 0000"/></div>
                    <div><label style={labelStyle}>Nome no Cartão</label><input style={inputStyle} value={card.name} onChange={e=>setCard({...card,name:e.target.value})} placeholder="COMO IMPRESSO NO CARTÃO"/></div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                      <div><label style={labelStyle}>Validade</label><input style={inputStyle} value={card.expiry} onChange={e=>setCard({...card,expiry:e.target.value})} placeholder="MM/AA"/></div>
                      <div><label style={labelStyle}>CVV</label><input style={inputStyle} value={card.cvv} onChange={e=>setCard({...card,cvv:e.target.value})} placeholder="000"/></div>
                    </div>
                    <div>
                      <label style={labelStyle}>Parcelamento</label>
                      <select style={{ ...inputStyle }}>
                        {[1,2,3,6,12].map(n=>(
                          <option key={n} value={n}>{n}× de {fmt(total/n)}{n>1?' sem juros':''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order summary */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', padding:'28px', position:'sticky', top:100 }}>
            <h3 style={{ fontFamily:'var(--font-h)', fontSize:20, marginBottom:20 }}>Resumo</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:11, marginBottom:20 }}>
              {cart.map(i => (
                <div key={i.product.id} style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                  <span style={{ color:'var(--cream-dim)' }}>{i.product.name} ×{i.qty}</span>
                  <span style={{ color:'var(--cream)' }}>{fmt(i.product.price*i.qty)}</span>
                </div>
              ))}
              <div style={{ height:1, background:'var(--border)', margin:'5px 0' }}/>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                <span style={{ color:'var(--cream-dim)' }}>Frete</span>
                <span style={{ color: frete===0 ? 'rgba(37,211,102,0.85)' : 'var(--cream-dim)' }}>
                  {frete===0 ? 'Grátis' : fmt(frete)}
                </span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontFamily:'var(--font-h)', fontSize:16 }}>Total</span>
                <span style={{ fontFamily:'var(--font-h)', fontSize:22, color:'var(--gold)' }}>{fmt(total)}</span>
              </div>
            </div>
            <button onClick={handleNext} disabled={step===1&&!form.name} style={{
              width:'100%', background:'var(--gold)', color:'#1a0f00', padding:'15px',
              border:'none', fontFamily:'var(--font-b)', fontSize:11, fontWeight:800,
              letterSpacing:'0.16em', textTransform:'uppercase', cursor:'pointer',
              opacity: step===1&&!form.name ? 0.45 : 1, transition:'opacity 0.2s',
            }}>
              {step===1 ? 'Continuar →' : 'Confirmar Pedido'}
            </button>
          </div>
        </div>
      </div>
      <Footer navigate={navigate}/>
    </div>
  );
};

// ── ABOUT PAGE ──
const AboutPage = ({ navigate }) => (
  <div style={{ paddingTop:76 }}>
    <div style={{ maxWidth:920, margin:'0 auto', padding:'72px 48px 80px' }}>
      <div style={{ textAlign:'center', marginBottom:64 }}>
        <GodBlessingLogo size={118}/>
        <p style={{ fontFamily:'var(--font-s)', color:'var(--gold)', fontSize:22, marginTop:26, marginBottom:12 }}>Nossa História</p>
        <h1 style={{ fontFamily:'var(--font-h)', fontSize:'clamp(34px,5vw,64px)', fontWeight:400 }}>
          Arte em Madeira,<br/><em style={{ fontStyle:'italic' }}>Criada com Fé</em>
        </h1>
      </div>
      <GoldDivider/>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center', marginBottom:64 }}>
        <div style={{ height:420, overflow:'hidden', border:'1px solid var(--border)' }}>
          <WoodPlaceholder category="conjuntos"/>
        </div>
        <div>
          <h2 style={{ fontFamily:'var(--font-h)', fontSize:28, marginBottom:18, fontWeight:600 }}>Madeiras Nobres do Brasil</h2>
          <p style={{ color:'var(--cream-dim)', fontSize:15, lineHeight:1.95, marginBottom:18 }}>
            A God Blessing nasceu da paixão pelas madeiras nobres brasileiras e da crença de que cada peça de arte tem sua própria história a contar.
          </p>
          <p style={{ color:'var(--cream-dim)', fontSize:15, lineHeight:1.95 }}>
            Trabalhamos com Ipê, Imbuia, Cedrinho, Jatobá e outras espécies do Brasil, transformando a beleza natural da madeira em peças que duram gerações.
          </p>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:28, marginBottom:64 }}>
        {[
          { title:'Fé & Propósito', text:'Cada peça é feita com oração e intenção. A arte verdadeira carrega a energia de quem a cria.' },
          { title:'CNC & Laser', text:'Tecnologia de ponta a serviço do artesanato. Gravações precisas que capturam cada detalhe.' },
          { title:'Sustentabilidade', text:'Madeiras certificadas e reaproveitamento de cada fragmento. Respeito à natureza.' },
        ].map(({ title, text }) => (
          <div key={title} style={{ padding:'28px 24px', background:'var(--card)', border:'1px solid var(--border)', textAlign:'center' }}>
            <div style={{ width:36, height:2, background:'var(--gold)', margin:'0 auto 20px' }}/>
            <h3 style={{ fontFamily:'var(--font-h)', fontSize:20, marginBottom:12, fontWeight:600 }}>{title}</h3>
            <p style={{ color:'var(--cream-dim)', fontSize:13, lineHeight:1.85 }}>{text}</p>
          </div>
        ))}
      </div>
      <div style={{ textAlign:'center' }}>
        <button onClick={() => navigate('#/loja')} style={{
          background:'var(--gold)', color:'#1a0f00', padding:'14px 52px',
          border:'none', fontFamily:'var(--font-b)', fontSize:11, fontWeight:800,
          letterSpacing:'0.18em', textTransform:'uppercase', cursor:'pointer',
        }}>Explorar a Loja</button>
      </div>
    </div>
    <Footer navigate={navigate}/>
  </div>
);

Object.assign(window, { CartPage, CheckoutPage, AboutPage });
