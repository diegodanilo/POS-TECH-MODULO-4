# 📊 Dashboard Financeiro – Angular + Firebase

## 📌 Visão Geral

Este projeto é uma aplicação **web (SPA)** desenvolvida em **Angular**, com foco em **gestão financeira pessoal**.  
A aplicação permite que usuários autenticados visualizem, organizem e analisem suas transações financeiras por meio de um **dashboard interativo**, com indicadores, alertas e visão consolidada dos dados.

O projeto foi estruturado seguindo **boas práticas de arquitetura**, **clean code**, **programação reativa** e **foco em performance e manutenibilidade**.

---

## 🚀 Principais Funcionalidades

- 🔐 Autenticação de usuários (Firebase Authentication)
- 📄 Gerenciamento de transações financeiras
- 📊 Dashboard financeiro com:
  - Saldo total
  - Total de receitas
  - Total de despesas
  - Alertas de gastos
- 🧭 Menu lateral com navegação
- ⚡ Carregamento otimizado com Lazy Loading
- 🔄 Atualização reativa dos dados
- 📱 Interface mobile-first, preparada para uso em WebView

---

## 🛠️ Tecnologias Utilizadas

- Angular
- TypeScript
- RxJS
- Firebase (Authentication e Firestore)
- Ng-Zorro (UI Components)
- Arquitetura por Features
- ChangeDetectionStrategy.OnPush

---

## 📂 Estrutura do Projeto (resumida)

```txt
src/app
├── core            # Autenticação, layout e guards
├── features        # Funcionalidades (dashboard, extrato, auth)
├── shared          # Componentes reutilizáveis
└── app-routing     # Rotas e lazy loading

---

## Como startar o projeto

1. Install dependencies

```bash
   npm install
   ```

2. Start the app

   ```bash
   npm start
   ```

## URL do projeto local

➡️ http://localhost:4202

---



