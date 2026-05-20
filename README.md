# God Blessing

Site estático em React usando CDN e Babel no navegador.

## Arquivos principais

- `index.html` — página principal
- `app.jsx` — lógica da aplicação e roteamento
- `admin.jsx` — painel de administração / edição de tema
- `components.jsx` — componentes React reutilizáveis
- `pages.jsx` — páginas do site
- `pages2.jsx` — páginas adicionais
- `data.jsx` — dados e conteúdo usados pelo app

## Como testar localmente

### Opção 1: Abrir direto no navegador

1. Abra `index.html` no navegador.
2. Funciona como página estática, mas alguns recursos podem exigir servidor local.

### Opção 2: Usar servidor local

No terminal, dentro da pasta do projeto:

```bash
python -m http.server 8000
```

Depois abra:

```text
http://localhost:8000/index.html
```

Se você usa o VS Code, pode também usar a extensão **Live Server**.

## Deploy sugerido

### Vercel

Recomendado para deploy rápido de sites estáticos:

1. Crie um repositório no GitHub com este projeto.
2. Conecte o repositório no Vercel.
3. Configure a pasta de publicação como a raiz (`/`).
4. O Vercel publicará automaticamente em `https://<nome>.vercel.app`.

### GitHub Pages

Também funciona bem para este site estático:

1. Crie um repositório no GitHub.
2. Faça push dos arquivos.
3. Vá em `Settings > Pages` no repositório.
4. Selecione a branch `main` e a pasta `/root`.
5. Salve e acesse o URL `https://<usuario>.github.io/<repo>/`.

## Observações

- O projeto não depende de um `package.json` ou build local.
- O React e o Babel são carregados via CDN em `index.html`.
- Mantenha o arquivo `index.html` na raiz para facilitar deploy e acesso direto.
