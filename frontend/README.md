# 🚀 TechLead HQ - Cockpit de Gestão Técnica & Squads

Plataforma desenhada para o dia a dia do **Tech Lead**, cobrindo todas as responsabilidades chave:
- **Weekly Agenda Builder**: geração de pautas estruturadas com timeboxing e IA Gemini 2.5 Flash.
- **Slides da Weekly**: apresentador ao vivo em tela cheia com notas de oratória personalizadas.
- **Cadence & Boards**: acompanhamento de atualizações do **Mural & Publisher** com lembretes automáticos para POs e Scrum Masters.
- **Hub de Guildas**: incentivo a desenvolvedores tímidos para palestrar, com gerador de convite amigável via IA.
- **Team Gatherings**: planejador de almoços presenciais, *team days*, retrospectivas técnicas, com controle de orçamento (R$) e checklist de RSVP.
- **Matriz de Stakeholders**: acompanhamento da saúde do relacionamento com **Gestores de Pessoas** e **Clientes**.

---

## 📦 Como Subir para o GitHub (Passo a Passo)

Abra o terminal na pasta raiz onde estão os arquivos do projeto e siga os passos abaixo:

### Passo 1: Autenticar sua conta (caso ainda não tenha feito)
```bash
gh auth login
```
*(Ou utilize suas credenciais Git habituais via HTTPS / SSH)*

### Passo 2: Inicializar o repositório e comitar os arquivos
```bash
git init
git add .
git commit -m "feat: initial commit - TechLead HQ Workspace"
```

### Passo 3: Criar a branch principal e vincular o repositório remoto
Para enviar diretamente para o seu repositório `Gemini_apps`:

```bash
git branch -M main
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/bruxxi/Gemini_apps.git
git push -u origin main
```

> **Dica**: Se o repositório no GitHub já tiver sido criado com um arquivo `README` ou licença inicial pela interface web, utilize o envio forçado para sobrescrever:
> ```bash
> git push -u origin main --force
> ```

---

## 💻 Como Rodar o Projeto Localmente

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Abra no navegador em `http://localhost:5173`.
