# 📄 Microsoft Word Web Clone

A modern Microsoft Word-inspired document editor built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and **shadcn/ui**. This project recreates the familiar Microsoft Word experience in the browser with a ribbon interface, rich text editing, page-based document layout, formatting tools, image insertion, zoom controls, keyboard shortcuts, and extensible architecture for future enhancements.

---
(Screenshot_2026-06-23_06-13-12.png)
## ✨ Features

### 🏠 Home Tab
- Bold, Italic, Underline, Strikethrough
- Font Family Selection
- Font Size Controls
- Font Color & Text Highlight
- Paragraph Alignment
- Bullets & Numbering
- Line Spacing
- Styles Gallery
- Find & Replace

### 📥 Insert Tab
- Insert Images
- Insert Tables
- Insert Hyperlinks
- Header & Footer Support
- Comments
- Symbols

### 📄 Document Editing
- Multi-page Document Layout
- A4 Page Rendering
- Margin Guides
- Context Menu
- Undo / Redo
- Selection Tracking
- Formatting Synchronization

### 🔍 View Controls
- Zoom Slider (10% – 500%)
- Print Layout
- Web Layout
- Word Count
- Page Count

### ⌨️ Productivity
- Keyboard Shortcuts
- Save & Open Documents
- Print Support
- Context-Aware Formatting


---
(Screenshot_2026-06-23_06-14-26.png)
## 🏗️ Tech Stack

| Technology | Purpose |
|------------|----------|
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| shadcn/ui | UI Components |
| Lucide React | Icons |
| React Context API | State Management |
| Native Browser APIs | Rich Text Editing |

---

## 📂 Project Structure

```bash
src/
│
├── components/
│   ├── dialogs/
│   ├── toolbars/
│   ├── ui/
│   ├── AppShell.tsx
│   ├── Ribbon.tsx
│   ├── TitleBar.tsx
│   ├── EditorCanvas.tsx
│   ├── StatusBar.tsx
│   └── DocumentPage.tsx
│
├── contexts/
│   └── EditorContext.tsx
│
├── hooks/
│   ├── useEditorState.ts
│   ├── useSelection.ts
│   ├── useUndoRedo.ts
│   └── useKeyboardShortcuts.ts
│
├── state/
│   ├── editorReducer.ts
│   └── initialState.ts
│
├── types/
│   ├── editor.ts
│   └── actions.ts
│
├── utils/
│   ├── formatting.ts
│   ├── selection.ts
│   └── history.ts
│
├── App.tsx
└── main.tsx
```

---

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/miyuppie/word-web-clone.git
cd word-web-clone
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The application will be available at:

```bash
http://localhost:5173
```

---

## 📦 Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## 🎨 Design Goals

This project is designed to closely resemble Microsoft Word while maintaining a modern React architecture.

### Goals

- Familiar Microsoft Word experience
- Responsive and modern UI
- Extensible component architecture
- Strong TypeScript support
- Rich text editing without heavy editor frameworks
- Clean separation of state and UI

---

## 📄 Supported Features

### Text Formatting

- Bold
- Italic
- Underline
- Strikethrough
- Font Family
- Font Size
- Font Color
- Highlight Color
- Clear Formatting

### Paragraph Formatting

- Align Left
- Align Center
- Align Right
- Justify
- Bulleted Lists
- Numbered Lists
- Increase/Decrease Indent
- Line Spacing

### Media

- Image Upload
- Image Placement
- Image Alignment

### Document Management

- Save Document
- Open Document
- Print Document
- Multi-page Layout

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|-----------|----------|
| Ctrl + B | Bold |
| Ctrl + I | Italic |
| Ctrl + U | Underline |
| Ctrl + Z | Undo |
| Ctrl + Y | Redo |
| Ctrl + S | Save |
| Ctrl + P | Print |
| Ctrl + A | Select All |
| Ctrl + C | Copy |
| Ctrl + V | Paste |
| Ctrl + X | Cut |
| Ctrl + L | Align Left |
| Ctrl + E | Center Align |
| Ctrl + R | Align Right |
| Ctrl + J | Justify |

---

## 🧠 State Management

The editor uses a centralized state architecture powered by React Context and useReducer.

```typescript
EditorState {
  content,
  selection,
  activeFormatting,
  activeRibbonTab,
  dialogs,
  history,
  zoom,
  viewMode
}
```

This approach provides:

- Predictable state updates
- Undo/Redo support
- Consistent formatting synchronization
- Easier debugging

---

## ⚡ Performance Optimizations

- Lazy-loaded Ribbon Tabs
- Debounced Selection Tracking
- Optimized Undo History
- Image Size Limiting
- Efficient Re-renders
- Virtualization Ready

---

## ♿ Accessibility

- Keyboard Navigation
- ARIA Labels
- Screen Reader Support
- Focus Management
- WCAG AA Color Compliance

---

## 🔮 Future Roadmap

### Phase 1
- Rich Text Editing
- Ribbon UI
- Multi-page Layout
- Undo/Redo

### Phase 2
- Tables
- Headers & Footers
- Advanced Styles
- Page Numbering

### Phase 3
- DOCX Import
- DOCX Export
- PDF Export
- Cloud Storage

### Phase 4
- Real-Time Collaboration
- Comments
- Track Changes
- AI Writing Assistant

---

## 📸 Screenshots

Add screenshots once available:

```text
docs/screenshots/editor.png
docs/screenshots/home-tab.png
docs/screenshots/insert-dialog.png
```

---

## 🤝 Contributing

Contributions are welcome.

```bash
# Fork the repository

# Create a feature branch
git checkout -b feature/new-feature

# Commit changes
git commit -m "Add new feature"

# Push changes
git push origin feature/new-feature
```

Open a Pull Request and describe your changes.

---

## 📜 License

MIT License

---

## 👨‍💻 Author

### Okanlawon Olayemi

Mechatronics Engineer | Software Engineer | AI & Robotics Enthusiast

Building innovative solutions in:

- Artificial Intelligence
- Robotics
- Internet of Things (IoT)
- Educational Technology
- Full Stack Web Development

---

⭐ Star this repository if you find it useful.