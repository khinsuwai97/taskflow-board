# 📋 TaskFlow Board

A modern, responsive Kanban board application built with React, TypeScript, and Redux Toolkit. Organize your tasks efficiently with drag-and-drop functionality and a beautiful, intuitive interface.

![TaskFlow Board](https://img.shields.io/badge/React-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)
![Redux](https://img.shields.io/badge/Redux-Toolkit-purple.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)

## ✨ Features

- 🎯 **Drag & Drop**: Intuitive task management with @hello-pangea/dnd
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Beautiful UI**: Modern gradient design with smooth animations
- 🔄 **Real-time Updates**: Redux state management for instant updates
- 📊 **Task Priorities**: Organize tasks by Low, Medium, and High priority
- 🗂️ **Multiple Columns**: Create unlimited custom columns
- ✏️ **Inline Editing**: Edit tasks and columns on the fly
- 💾 **Persistent State**: Save your work (with Redux persist)
- 🌈 **Color-coded Columns**: Each column has a unique gradient theme
- 📅 **Task Timestamps**: Track when tasks were created

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm
- Basic knowledge of React and TypeScript

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd taskflow-board
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
taskflow-board/
├── src/
│   ├── components/
│   │   ├── Board.tsx          # Main board component
│   │   ├── Column.tsx         # Column component with tasks
│   │   └── TaskCard.tsx       # Individual task card
│   ├── redux/
│   │   ├── boardSlice.ts      # Redux slice for board state
│   │   ├── store.ts           # Redux store configuration
│   │   └── hooks.ts           # Typed Redux hooks
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   └── styles/
│       └── globals.css        # Global styles
├── public/                     # Static assets
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies
```

## 🎮 Usage

### Creating a Column

1. Click the **"Add Column"** button on the right side of the board
2. Enter a column name (e.g., "To Do", "In Progress", "Done")
3. Click **"Add Column"** to create it

### Adding a Task

1. Click the **"Add Task"** button at the bottom of any column
2. Fill in the task details:
   - **Title**: Brief task description
   - **Description**: Detailed information about the task
   - **Priority**: Choose Low, Medium, or High
3. Click **"Add Task"** to save

### Moving Tasks

- **Drag and drop** tasks between columns or reorder within a column
- Tasks can be moved anywhere on the board
- Smooth animations provide visual feedback

### Editing Tasks

1. Hover over a task card to reveal edit buttons
2. Click the **pencil icon** to edit
3. Modify the title, description, or priority
4. Click **"Save"** to update

### Deleting Tasks or Columns

- **Tasks**: Click the **trash icon** on a task card
- **Columns**: Click the **three-dot menu** on a column header, then select "Delete Column"
- Confirmation prompts prevent accidental deletions

## 🎨 Customization

### Color Themes

Columns automatically cycle through four gradient themes:

- Violet/Purple
- Blue/Cyan
- Emerald/Teal
- Amber/Orange

To customize, edit the `columnColors` array in `Column.tsx`:

```typescript
const columnColors = [
  'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200',
  'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200',
  'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200',
  'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200',
];
```

### Responsive Breakpoints

The app uses these Tailwind breakpoints:

- **Mobile**: < 640px (280px column width)
- **Small**: 640px+ (320px column width)
- **Medium**: 768px+ (360px column width)
- **Large**: 1024px+
- **Extra Large**: 1280px+

## 🛠️ Technologies Used

- **[React 18+](https://react.dev/)** - UI library
- **[Next.js 14+](https://nextjs.org/)** - React framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Redux Toolkit](https://redux-toolkit.js.org/)** - State management
- **[@hello-pangea/dnd](https://github.com/hello-pangea/dnd)** - Drag and drop
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Lucide React](https://lucide.dev/)** - Icons

## 📱 Mobile Responsiveness

The app is fully responsive with these mobile-friendly features:

- ✅ Horizontal scroll with snap points on mobile
- ✅ Touch-friendly buttons and controls
- ✅ Collapsible stats menu on small screens
- ✅ Optimized column and card sizes
- ✅ Smooth drag-and-drop on touch devices
- ✅ Readable text at all screen sizes

## 🔧 Redux State Structure

```typescript
{
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Task Title',
      description: 'Task Description',
      priority: 'medium',
      createdAt: '2026-01-10T00:00:00.000Z'
    }
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2']
    }
  },
  columnOrder: ['column-1', 'column-2', 'column-3']
}
```

## 🚀 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type checking
npm run type-check
```

## 📝 Key Features Explained

### Drag and Drop

Uses `@hello-pangea/dnd` (formerly `react-beautiful-dnd`) for smooth drag-and-drop:

- Drag tasks within columns to reorder
- Drag tasks between columns to move
- Visual feedback during dragging
- Touch support for mobile devices

### State Management

Redux Toolkit manages the application state:

- Centralized state for tasks, columns, and order
- Immutable updates with Immer
- TypeScript integration for type safety
- Easy to extend and modify

### Responsive Design

Tailwind CSS utility classes ensure responsiveness:

- Mobile-first approach
- Flexible grid system
- Smooth transitions and animations
- Dark mode ready (can be extended)

## 🐛 Troubleshooting

### Horizontal scroll issues

If you experience horizontal overflow:

- Check that column widths are consistent
- Ensure `flex-shrink-0` is applied to columns
- Verify container has `overflow-x-auto`

### Drag and drop not working

- Ensure `@hello-pangea/dnd` is properly installed
- Check that `DragDropContext` wraps the board
- Verify `Droppable` and `Draggable` have unique IDs

### TypeScript errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Inspired by Trello and other Kanban board applications
- Icons by [Lucide Icons](https://lucide.dev/)
- Design inspiration from modern UI/UX trends

## 📧 Contact

For questions or feedback, please open an issue on GitHub or contact the maintainers.

---

**Made with ❤️ using React, TypeScript, and Tailwind CSS**

⭐ Star this repository if you find it helpful!
