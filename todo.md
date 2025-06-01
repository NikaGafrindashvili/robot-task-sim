
## Phase 0: Project Setup & Initial Configuration

-   [ ] Initialize Next.js project (`robot-task-sim`) with TypeScript.
-   [ ] Install Tailwind CSS and set it up.
-   [ ] Install Shadcn UI and configure it.
    -   [ ] Install `lucide-react` as an icon dependency for Shadcn/general use.
-   [ ] Install Zustand for state management.
-   [ ] Set up testing environment (Jest, React Testing Library).

## Phase 1: Foundational Setup (Core Types, Store, Basic Grid)

### 1.1 Core Type Definitions (Prompt 1)
-   [ ] Create `src/types/index.ts`.
-   [ ] Define `Robot` type.
-   [ ] Define `Task` type.
-   [ ] Define `SimulationState` type (including `placementMode` and `lastAssignedRobotIndex`).

### 1.2 Zustand Store Setup (Prompt 2)
-   [ ] Create `src/store/simulationStore.ts`.
-   [ ] Import types into the store file.
-   [ ] Create Zustand store (`useSimulationStore`) with initial `SimulationState`.
-   [ ] Implement `setGridSize` action.
-   [ ] Implement `setRobots` action.
-   [ ] Implement `setTasks` action.
-   [ ] Implement `setPlacementMode` action.
-   [ ] Implement `addRobot` action (with unique ID generation).
-   [ ] Implement `addTask` action (with unique ID generation).
-   [ ] Implement `clearGrid` action.
-   [ ] Implement `setTickSpeed` action.
-   [ ] Implement `setStrategy` action.
-   [ ] Implement `toggleIsRunning` action.
-   [ ] Implement `setIsRunning` action.
-   [ ] Implement `toggleDynamicTaskSpawning` action.
-   [ ] Implement `resetSimulationState` action (initial version: clear paths/targets, unassign tasks, set `isRunning` false, reset `lastAssignedRobotIndex`).
-   [ ] (Conceptual) Write unit tests for store actions (e.g., `addRobot`, `clearGrid`).

### 1.3 Grid Component - Static Rendering (Prompt 3)
-   [ ] Create `src/components/Grid.tsx`.
-   [ ] `Grid` component: Use `useSimulationStore` for `gridSize`, `robots`, `tasks`.
-   [ ] `Grid` component: Render grid cells based on `gridSize`.
-   [ ] `Grid` component: Style cells with borders and fixed size.
-   [ ] `Grid` component: Render visual representation for `robots` at their positions.
-   [ ] `Grid` component: Render visual representation for `tasks` at their positions.
-   [ ] Update `src/app/page.tsx` to render the `Grid` component.
-   [ ] (Temporary) Add sample robots/tasks in `page.tsx` via store actions for initial display.
-   [ ] (Conceptual) Write component tests for `Grid` (cell count, robot/task rendering).

## Phase 2: User Interaction - Placement & Basic Controls

### 2.1 Grid Click Handler for Placement (Prompt 4)
-   [ ] Create `isCellOccupied(row, col, robots, tasks)` utility function (in `src/lib/utils.ts` or `Grid.tsx`).
-   [ ] (Conceptual) Write unit tests for `isCellOccupied`.
-   [ ] `Grid` component: Add `onClick` handler to each cell.
-   [ ] `Grid` component: Implement logic to add Robot/Task based on `placementMode` if cell is not occupied.
-   [ ] `Grid` component: Use `addRobot` / `addTask` store actions.
-   [ ] `Grid` component: Prevent placement on occupied cells.
-   [ ] Remove temporary sample data loading from `page.tsx` if it conflicts.
-   [ ] (Conceptual) Write component tests for grid click placement.

### 2.2 Control Panel - Basic Layout & Placement Mode Toggle (Prompt 5)
-   [ ] Create `src/components/ControlPanel.tsx`.
-   [ ] `ControlPanel`: Basic layout (fixed width, left side).
-   [ ] `ControlPanel`: Use `useSimulationStore` for `placementMode` and `setPlacementMode`.
-   [ ] `ControlPanel`: Add Shadcn `RadioGroup` or `Button`s for "robot" / "task" placement mode.
-   [ ] `ControlPanel`: Update store on placement mode change.
-   [ ] Update `src/app/page.tsx` layout: `ControlPanel` left, `Grid` right.
-   [ ] (Conceptual) Write component tests for `ControlPanel` placement mode toggle.

## Phase 3: Simulation Configuration Controls (Control Panel)

### 3.1 Clear Grid & Configuration Controls (Prompt 6)
-   [ ] `ControlPanel`: Add "Clear Grid" Shadcn `Button` -> `clearGrid` action.
-   [ ] `ControlPanel`: Add Shadcn `Input` fields for "Rows" and "Columns" -> `gridSize` & `setGridSize`.
-   [ ] `ControlPanel`: Add Shadcn `Select` for "Tick Speed" (1, 2, 5) -> `tickSpeed` & `setTickSpeed`.
-   [ ] `ControlPanel`: Add Shadcn `Select` for "Strategy" (nearest, round-robin) -> `strategy` & `setStrategy`.
-   [ ] `ControlPanel`: Add Shadcn `Switch` for "Dynamic Task Spawning" -> `dynamicTaskSpawning` & `toggleDynamicTaskSpawning`.
-   [ ] (Conceptual) Write component tests for new controls in `ControlPanel`.

### 3.2 Simulation Start/Pause/Resume and Reset Buttons (Prompt 7)
-   [ ] `ControlPanel`: Add "Start"/"Pause" Shadcn `Button` -> `toggleIsRunning` action.
-   [ ] `ControlPanel`: Button label changes based on `isRunning`.
-   [ ] `ControlPanel`: Prevent simulation start if no robots or tasks (alert/log).
-   [ ] `ControlPanel`: Add "Reset" Shadcn `Button` -> `resetSimulationState` action.
-   [ ] (Conceptual) Write component tests for Start/Pause and Reset buttons.

## Phase 4: Core Simulation Logic - Pathfinding and Movement

### 4.1 Pathfinding Utilities (Prompt 8)
-   [ ] Create/update `src/lib/utils.ts` or `src/lib/pathfinding.ts`.
-   [ ] Implement `calculateManhattanDistance(pos1, pos2)` function.
-   [ ] Write unit tests for `calculateManhattanDistance`.
-   [ ] Implement `findPath(startPos, endPos, gridSize, obstacles)` (BFS algorithm).
-   [ ] Write comprehensive unit tests for `findPath`.

### 4.2 Simulation Tick & Robot Movement (Prompt 9)
-   [ ] `simulationStore`: Add `moveRobot(robotId, nextPosition, remainingPath)` action.
-   [ ] (Conceptual) Unit test `moveRobot` store action.
-   [ ] Create `src/hooks/useSimulationRunner.ts` custom hook.
-   [ ] `useSimulationRunner`: Manage `setInterval` based on `isRunning` and `tickSpeed`.
-   [ ] `useSimulationRunner`: In tick, iterate robots; if robot has path, call `moveRobot` action.
-   [ ] `useSimulationRunner`: Clear interval on `isRunning` false or unmount; update on `tickSpeed` change.
-   [ ] `src/app/page.tsx`: Call `useSimulationRunner()` hook.
-   [ ] (Manual Test) Manually assign a path to a robot to test movement.

## Phase 5: Task Assignment Logic

### 5.1 Nearest-First Strategy (Prompt 10)
-   [ ] `simulationStore`: Add `assignTaskToRobot(robotId, taskId, path)` action.
-   [ ] (Conceptual) Unit test `assignTaskToRobot` store action.
-   [ ] Create `src/lib/assignmentStrategies.ts`.
-   [ ] `assignmentStrategies`: Implement `assignTasksNearestFirst(robots, tasks, gridSize, obstacles)` function.
-   [ ] Write unit tests for `assignTasksNearestFirst`.
-   [ ] `useSimulationRunner`: Integrate `assignTasksNearestFirst` logic.
    -   [ ] Prepare `obstacles` list.
    -   [ ] Filter idle robots and unassigned tasks.
    -   [ ] Call `assignTasksNearestFirst` if strategy is "nearest".
    -   [ ] Call `assignTaskToRobot` for each returned assignment.
-   [ ] (Manual Test) Verify Nearest-First assignment and robot movement.

### 5.2 Round-Robin Strategy (Prompt 11)
-   [ ] `simulationStore`: Add `setLastAssignedRobotIndex(index)` action.
-   [ ] `simulationStore`: Ensure `lastAssignedRobotIndex` is part of state and reset correctly.
-   [ ] `assignmentStrategies`: Implement `assignTasksRoundRobin(robots, tasks, gridSize, obstacles, lastAssignedRobotIndex)` function.
-   [ ] Write unit tests for `assignTasksRoundRobin`.
-   [ ] `useSimulationRunner`: Integrate `assignTasksRoundRobin` logic.
    -   [ ] Call `assignTasksRoundRobin` if strategy is "round-robin".
    -   [ ] Call `assignTaskToRobot` for each assignment.
    -   [ ] Call `setLastAssignedRobotIndex`.
-   [ ] (Manual Test) Verify Round-Robin assignment.

## Phase 6: Task Completion and Simulation End Condition

### 6.1 Task Completion & Simulation End (Prompt 12)
-   [ ] `simulationStore`: Add `completeTask(robotId, taskId)` action (removes task, resets robot).
-   [ ] (Conceptual) Unit test `completeTask` store action.
-   [ ] `useSimulationRunner`: Add task completion logic.
    -   [ ] After robot movement, check if robot reached `targetTask` position.
    -   [ ] If so, call `completeTask` action.
-   [ ] `useSimulationRunner`: Add simulation end condition logic.
    -   [ ] If `isRunning`, `tasks.length === 0`, and `!dynamicTaskSpawning`, call `setIsRunning(false)`.
-   [ ] (Manual Test) Verify task completion and simulation auto-stop.

## Phase 7: Dynamic Features & Visual Enhancements

### 7.1 Dynamic Task Spawning (Prompt 13)
-   [ ] `useSimulationRunner`: Add dynamic task spawning logic.
    -   [ ] If `dynamicTaskSpawning` is true and `tasks.length < 20`.
    -   [ ] Chance to spawn per tick.
    -   [ ] Generate random, unoccupied position.
    -   [ ] Use `isCellOccupied` for check.
    -   [ ] Call `addTask` store action.
-   [ ] (Manual Test) Verify dynamic task spawning.

### 7.2 Visual Enhancements (Prompt 14)
-   [ ] Install `lucide-react` (if not already done via Shadcn).
-   [ ] `Grid.tsx`: Replace robot/task representations with `lucide-react` icons (e.g., `<Bot />`, `<PackageCheck />`).
-   [ ] `Grid.tsx`: Implement path visualization (simplified: highlight cells in `robot.path` with a faint background color).
-   [ ] (Manual Test) Verify icons and path highlighting.

## Phase 8: Testing, Refinement, and Final Polish

### 8.1 Grid Scrolling & UI Polish (Prompt 15)
-   [ ] `src/app/page.tsx`: Ensure `Grid` container is scrollable (`overflow: auto`).
-   [ ] Ensure `ControlPanel` remains fixed during grid scroll.
-   [ ] `Grid.tsx`: Add user feedback for attempting to place on an occupied cell (console warning or simple visual cue).
-   [ ] `ControlPanel.tsx`: Add user feedback for attempting to start simulation without robots/tasks (console warning or simple visual cue).
-   [ ] Perform a general UI review: styling, spacing, usability.
-   [ ] (Manual Test) Verify grid scrolling and refined feedback messages.

### 8.2 Comprehensive Testing & QA
-   [ ] Write component tests for critical UI components (Control Panel interactions, Grid rendering based on state variations).
-   [ ] (If feasible) Write more integrated simulation tests (e.g., via React Testing Library, simulate ticks and verify state changes over time).
-   [ ] Perform thorough Manual QA:
    -   [ ] Test all user interactions in `ControlPanel`.
    -   [ ] Test robot/task placement and removal (via Clear Grid).
    -   [ ] Verify both assignment strategies by observation.
    -   [ ] Verify robot movement, task completion, dynamic spawning.
    -   [ ] Test simulation start/pause/reset functionalities.
    -   [ ] Test edge cases (e.g., no path found, grid full).
    -   [ ] Test on different screen sizes (responsiveness of layout, scrolling).
-   [ ] Code Review and Refactor:
    -   [ ] Review for clarity, consistency.
    -   [ ] Check for performance bottlenecks (especially in rendering or tick logic).
    -   [ ] Ensure adherence to best practices.

---