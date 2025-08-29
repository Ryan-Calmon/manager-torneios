# Torneio Manager

Sistema para gerenciar torneios com controle e exibição em tempo real.

## Requisitos

- **Python 3.10+**
- **Node.js** (inclui npm)
- **Git** (para clonar o projeto)

## Instalação

### 1. Clone o projeto

```sh
git clone https://github.com/Ryan-Calmon/manager-torneios.git
cd manager-torneios
```

### 2. Backend (Flask)

#### a) Crie o ambiente virtual

```sh
python -m venv venv
```

#### b) Ative o ambiente virtual

```sh
.\venv\Scripts\activate
```

#### c) Instale as dependências do backend

```sh
pip install -r requirements.txt
```

#### d) Rode o backend

```sh
python src/main.py
```

O backend estará disponível em `http://localhost:5000`.

---

### 3. Frontend (React)

#### a) Entre na pasta do frontend

```sh
cd torneio-app
```

#### b) Instale as dependências do React

```sh
npm install
```

> **Não precisa instalar o React globalmente, o `npm install` já baixa tudo que precisa.**

#### c) Rode o frontend

```sh
npm start
```

O frontend estará disponível em `http://localhost:3000`.

---

## Como usar

- **Abra duas abas do navegador:**
  - Uma para o modo controle (`http://localhost:3000`)
  - Outra para o modo exibição (TV)

- **O modo controle permite adicionar, remover e iniciar jogos.**
- **O modo exibição mostra os próximos jogos automaticamente.**

---

## Observações

- Sempre ative o ambiente virtual antes de rodar o backend.
- O frontend e backend funcionam juntos, mas são independentes.
- Se mudar de PC, repita todos os passos acima.

---


- Para instalar Python: [https://www.python.org/downloads/windows/](https://www.python.org/downloads/windows/)
- Para instalar Node.js: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
- Para instalar Git: [https://git-scm.com/download/win](https://git-scm.com/download/win)

---

## Estrutura

```
manager-torneios/
│
├── torneio-backend/
│   ├── src/
│   ├── requirements.txt
│   └── ...
│
└── torneio-app/
    ├── src/
    ├── package.json
    └── ...
```

---
