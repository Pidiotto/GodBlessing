// data.jsx — Products, categories, storage helpers

// ── Image pools by category (Unsplash, repeated OK) ──
const I = {
  tabuas: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1481671703460-040cb8a2d909?w=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&q=80&fit=crop',
  ],
  conjuntos: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1481671703460-040cb8a2d909?w=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=80&fit=crop',
  ],
  presentes: [
    'https://images.unsplash.com/photo-1481671703460-040cb8a2d909?w=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80&fit=crop',
  ],
  natal: [
    'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1481671703460-040cb8a2d909?w=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&q=80&fit=crop',
  ],
};
const img = (cat, idx) => I[cat][idx % I[cat].length];

const PRODUCTS_INITIAL = [
  // ── TÁBUAS ──
  { id:1,  name:'Tábua Rústica Ipê',           slug:'tabua-rustica-ipe',       category:'tabuas',    price:189, originalPrice:229, description:'Tábua artesanal em madeira Ipê nobre, uma das mais resistentes do Brasil. Cada peça é única, trabalhada à mão com acabamento em azeite de oliva. Ideal para pães, queijos e charcutaria.', dimensions:'35 × 20 × 2 cm', material:'Madeira Ipê',            customizable:true, active:true, featured:true,  image:img('tabuas',0) },
  { id:2,  name:'Tábua de Carne Imbuia Nobre',  slug:'tabua-carne-imbuia',      category:'tabuas',    price:249, originalPrice:null, description:'Tábua em madeira Imbuia de alta qualidade, com bela coloração natural que vai do castanho claro ao escuro. Resistente e higiênica, perfeita para churrasco.',                                  dimensions:'40 × 25 × 3 cm', material:'Madeira Imbuia',         customizable:true, active:true, featured:true,  image:img('tabuas',1) },
  { id:3,  name:'Tábua Coração de Pão',         slug:'tabua-coracao-pao',       category:'tabuas',    price:149, originalPrice:null, description:'Tábua artesanal em formato de coração, perfeita para servir pães artesanais. Gravação personalizada disponível a laser.',                                                                       dimensions:'28 × 25 × 1.5 cm',material:'Cedro Rosa',             customizable:true, active:true, featured:false, image:img('tabuas',2) },
  { id:4,  name:'Tábua Oval Premium Cedrinho',  slug:'tabua-oval-premium',      category:'tabuas',    price:219, originalPrice:null, description:'Design oval elegante em Cedrinho brasileiro. Inclui alça entalhada à mão para fácil manuseio e apresentação sofisticada.',                                                                   dimensions:'38 × 22 × 2.5 cm',material:'Cedrinho Brasileiro',    customizable:true, active:true, featured:false, image:img('tabuas',3) },
  { id:5,  name:'Tábua Grande de Charcutaria',  slug:'tabua-charcutaria',       category:'tabuas',    price:299, originalPrice:369, description:'Tábua generosa para frios, queijos e acompanhamentos. Com canaleta de suco e acabamento fosco elegante. A peça central de qualquer reunião.',                                               dimensions:'50 × 30 × 3 cm', material:'Madeira Jatobá',          customizable:true, active:true, featured:true,  image:img('tabuas',4) },
  // ── CONJUNTOS ──
  { id:6,  name:'Conjunto Faca + Tábua Artesanal', slug:'conjunto-faca-tabua',  category:'conjuntos', price:389, originalPrice:459, description:'Conjunto perfeito: tábua artesanal em Ipê + faca de carne com cabo em madeira nobre. Embalagem presente inclusa.',                                                                          dimensions:'Tábua 35×20cm | Faca 28cm', material:'Ipê + Aço Inox + Madeira',   customizable:true, active:true, featured:true,  image:img('conjuntos',0) },
  { id:7,  name:'Conjunto Premium Cedrinho',    slug:'conjunto-premium-cedrinho',category:'conjuntos', price:459, originalPrice:null, description:'Conjunto sofisticado: tábua oval + faca chef + faca de pão, todos com cabos em Cedrinho harmonizados. Caixa artesanal de bambu inclusa.',                                                dimensions:'3 peças | caixa 45×30cm', material:'Cedrinho + Aço Inox 420',    customizable:true, active:true, featured:false, image:img('conjuntos',1) },
  { id:8,  name:'Kit Churrasco Completo',       slug:'kit-churrasco',           category:'conjuntos', price:549, originalPrice:659, description:'O presente perfeito: tábua grande, faca de churrasco, garfo trinchante e chaira, todos com cabos em madeira nobre combinados. Inclui suporte de parede.',                                  dimensions:'4 peças + suporte',       material:'Jatobá + Aço Inox 420',     customizable:true, active:true, featured:true,  image:img('conjuntos',2) },
  { id:9,  name:'Conjunto Personalizado Casal', slug:'conjunto-casal',          category:'conjuntos', price:429, originalPrice:null, description:'Dois sets completos de tábua + faca com os nomes do casal gravados a laser. Ideal para casamentos e aniversários.',                                                                       dimensions:'2 sets completos',        material:'Imbuia + Aço Inox',         customizable:true, active:true, featured:false, image:img('conjuntos',3) },
  { id:10, name:'Kit Chef Artesanal',           slug:'kit-chef',                category:'conjuntos', price:499, originalPrice:589, description:'Para quem leva a cozinha a sério: tábua de corte grande, faca chef, faca de legumes e desossar, todos em madeira nobre brasileira.',                                                      dimensions:'4 peças | caixa magnética',material:'Cedro + Aço Inox 420',      customizable:true, active:true, featured:false, image:img('conjuntos',4) },
  // ── PRESENTES ──
  { id:11, name:'Tábua com Nome Gravado a Laser',slug:'tabua-nome-laser',       category:'presentes', price:269, originalPrice:null, description:'Tábua premium com nome, data ou mensagem especial gravada a laser com alta precisão. Um presente único que dura para sempre.',                                                            dimensions:'35 × 20 × 2 cm',         material:'Ipê ou Imbuia (à escolha)', customizable:true, active:true, featured:true,  image:img('presentes',0) },
  { id:12, name:'Kit Presente Noivos',          slug:'kit-noivos',              category:'presentes', price:599, originalPrice:749, description:'Presente inesquecível: tábua grande com nomes e data gravados, faca e garfo decorativos. Caixa premium com lacre de cera inclusa.',                                                     dimensions:'Kit 3 peças | caixa premium', material:'Imbuia Nobre + Aço Inox',customizable:true, active:true, featured:true,  image:img('presentes',1) },
  { id:13, name:'Tábua com Versículo Gravado',  slug:'tabua-versiculo',         category:'presentes', price:219, originalPrice:null, description:'Tábua com versículo favorito ou mensagem bíblica gravada com precisão laser. Uma peça que inspira fé todos os dias.',                                                                  dimensions:'30 × 18 × 2 cm',         material:'Cedro Rosa',                customizable:true, active:true, featured:false, image:img('presentes',2) },
  { id:14, name:'Porta-Velas em Madeira Nobre', slug:'porta-velas',             category:'presentes', price:129, originalPrice:null, description:'Porta-vela artesanal em madeira nobre selecionada. Acabamento natural que realça os veios únicos da madeira.',                                                                         dimensions:'15 × 15 × 3 cm',         material:'Ipê ou Cedro',              customizable:true, active:true, featured:false, image:img('presentes',3) },
  { id:15, name:'Kit Corporativo com Logo',     slug:'kit-corporativo',         category:'presentes', price:349, originalPrice:null, description:'Brindes exclusivos para sua empresa: tábua premium com logo gravado + faca personalizada. Mínimo 10 unidades.',                                                                       dimensions:'Personalizável por unidade',material:'Ipê ou Imbuia',            customizable:true, active:true, featured:false, image:img('presentes',4) },
  // ── NATAL ──
  { id:16, name:'Estrela de Natal em Madeira',  slug:'estrela-natal',           category:'natal',     price:89,  originalPrice:null, description:'Estrela natalina em madeira nobre, recortada a CNC com detalhes refinados. Personalizável com nome da família.',                                                                      dimensions:'20 × 20 cm',             material:'Compensado Naval + Verniz', customizable:true, active:true, featured:false, image:img('natal',0) },
  { id:17, name:'Enfeites de Árvore CNC',       slug:'enfeites-arvore-cnc',     category:'natal',     price:119, originalPrice:null, description:'Kit de enfeites natalinos recortados a CNC. 6 peças com acabamento em verniz acetinado. Fita de juta inclusa.',                                                                       dimensions:'Kit 6 peças | 8-12 cm',  material:'MDF Premium + Pinus',       customizable:true, active:true, featured:false, image:img('natal',1) },
  { id:18, name:'Porta-Vela Natalino Entalhado',slug:'porta-vela-natal',        category:'natal',     price:139, originalPrice:null, description:'Porta-vela natalino com cena de presépio entalhada a CNC. A chama ilumina os detalhes da madeira de forma mágica.',                                                                  dimensions:'18 × 12 × 4 cm',         material:'Pinus Nórdico',             customizable:true, active:true, featured:true,  image:img('natal',2) },
  { id:19, name:'Kit Decoração Natal Premium',  slug:'kit-natal-premium',       category:'natal',     price:259, originalPrice:329, description:'Kit completo: estrela, anjo, sino, árvore, rena e bola — todos em madeira nobre com acabamento premium.',                                                                            dimensions:'Kit 6 peças + caixa rústica',material:'Ipê + Cedro + MDF',       customizable:true, active:true, featured:true,  image:img('natal',3) },
  { id:20, name:'Natividade em Madeira Nobre',  slug:'natividade',              category:'natal',     price:399, originalPrice:499, description:'Presépio completo com 9 figuras esculpidas em madeiras nobres brasileiras. Peça colecionável e heirloom.',                                                                            dimensions:'9 figuras | 15-25 cm',   material:'Imbuia + Ipê Nobre',        customizable:true, active:true, featured:true,  image:img('natal',4) },
];

const CATEGORIES_INITIAL = [
  { id:'tabuas',    name:'Tábuas de Madeira' },
  { id:'conjuntos', name:'Conjuntos'         },
  { id:'presentes', name:'Presentes'         },
  { id:'natal',     name:'Natal'             },
];

const gbLoad = (key, def) => {
  try { const v = localStorage.getItem('gb_' + key); return v ? JSON.parse(v) : def; }
  catch { return def; }
};
const gbSave = (key, val) => {
  try { localStorage.setItem('gb_' + key, JSON.stringify(val)); } catch {}
};

// Cache version — bump this string to force products/categories to reset
const GB_VER = 'v3';
if (localStorage.getItem('gb_ver') !== GB_VER) {
  localStorage.removeItem('gb_products');
  localStorage.removeItem('gb_categories');
  localStorage.setItem('gb_ver', GB_VER);
}


Object.assign(window, { PRODUCTS_INITIAL, CATEGORIES_INITIAL, gbLoad, gbSave });
