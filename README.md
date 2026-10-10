# TextTools — Multi-Text Find & Replace Web App

A modern, fast, collision-proof multi-text find-and-replace application built with **React**, **Vite**, and **Tailwind CSS**.

Live on Vercel: Deployable with 1-click.

## ✨ Features
- **Collision-Proof Sequential Replacement**: Multi-rule replace engine that tracks each replacement accurately without string collision or infinite recursion.
- **30 Unique Color Schemes**: Up to 30 custom color themes (badges, borders, and diff highlight badges) so rules don't repeat colors.
- **Real-Time Live Preview**: Instant visual preview showing marked highlight badges for all applied transformations.
- **Interactive Undo & Redo**: Dedicated undo/redo buttons and keyboard shortcuts (`Ctrl+Z`, `Ctrl+Y` / `Ctrl+Shift+Z`).
- **Unified PDF & TXT Export**: Download popup with customizable file naming, high-resolution formatting, and clean PDF styling.
- **Pure Client-Side**: 100% private, zero backend or database required. Settings, rules, and input text persist automatically in `localStorage`.
- **Pure Black (#000000) Dark Mode & Clean White Light Mode**.
- **Quick Beautify / Formatter**: Postman & VS Code Prettier style indentation and structure alignment.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+

### Development
```bash
# Clone the repository
git clone https://github.com/Jyothisaik01/texttools.git
cd texttools/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
```

## 🛠️ Tech Stack
- **Framework**: React 18, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Exporting**: jsPDF, Canvas Confetti
- **Deployment**: Vercel

## 📄 License
MIT © Jyothisai karumajji
