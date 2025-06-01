# Robot Task Simulation – Developer Specification

## 👥 Team Information
- **Team Members**: Aleksandre Chakhvashvili, Nino Gagnidze
- **Selected Base Project**: Robot Task Simulation

## 🎯 Project Vision
**Problem Statement**: Visualize how multiple robots can be assigned and execute tasks on a 2D grid using different strategies in a dynamic environment.

**Target Users**: Learners, researchers, and educators interested in task allocation algorithms, robotics, and UI simulations.

**Value Proposition**: Demonstrates core principles of multi-agent coordination, pathfinding, and state-driven UI rendering with real-time feedback.

## 🏗️ Architecture & Technical Design

### Tech Stack
- **Frontend**: Next.js + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: Zustand
- **Backend**: None (fully frontend-based MVP)

### UI Layout
- **Grid**: Large, scrollable, and displayed on the right (default 30x75)
- **Control Panel**: Always visible on the left, containing all controls

### State Model (Zustand)
```ts
type Robot = {
  id: string;
  position: [number, number];
  targetTaskId?: string | null;
  path?: [number, number][];
};

type Task = {
  id: string;
  position: [number, number];
  assigned: boolean;
};

type SimulationState = {
  gridSize: [number, number];
  robots: Robot[];
  tasks: Task[];
  tickSpeed: 1 | 2 | 5;
  strategy: "nearest" | "round-robin";
  isRunning: boolean;
  dynamicTaskSpawning: boolean;
};
```

## 🧭 User Interactions

### Before Simulation
- Place/remove robots and tasks (click to place)
- Randomize layout or clear entire grid
- Set grid size (default 30x75; settable before start)
- Configure speed, strategy, and toggle dynamic tasks

### During Simulation
- Start / Pause / Resume
- Reset (resets state but keeps layout)
- Robots move 1 cell/tick orthogonally
- Robots complete tasks on arrival (task disappears)
- Simulation ends when all tasks are completed

## 🧠 Simulation Logic

### Task Assignment Strategies
- **Nearest-First**: Idle robot is assigned closest unassigned task (Manhattan distance)
- **Round-Robin**: Tasks distributed cyclically among robots
- Strategy is fixed at simulation start

### Timing & Ticks
- Speed options: 1, 2, 5 ticks/second
- All robots move simultaneously 1 cell per tick
- Idle robots seek new task immediately

### Task Lifecycle
- Tasks can appear at start and dynamically over time
- Max 20 tasks at any time
- Toggle to enable/disable dynamic spawning

## 🎨 Visual Behavior
- Robots and tasks shown with simple icons
- Robots move visibly 1 step at a time
- Highlight robot paths with faint lines to assigned tasks
- No labels, no sound, minimal UI

## 🧪 Testing Plan

### Unit Tests
- Strategy logic (nearest-first, round-robin)
- Manhattan pathfinding logic
- Task completion and reassignment rules

### Component Tests
- Grid rendering and click placement
- UI controls (buttons, dropdowns, toggles)

### Simulation Tests
- Robot step movement per tick
- Task completion flow
- Automatic simulation stop

### Manual QA
- Grid fills screen width and scrolls properly
- Strategy verification by observation
- Invalid placement prevention

## ⚠️ Error Handling

- Reject overlapping placements
- Prevent simulation start if no robots or tasks placed
- Show inline or alert messages for invalid actions
- Reset clears state safely in Zustand

---