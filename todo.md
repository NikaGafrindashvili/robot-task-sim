
## Phase 0: Project Setup & Initial Configuration

-   [x] Initialize Next.js project (`robot-task-sim`) with TypeScript.
-   [x] Install Tailwind CSS and set it up.
-   [x] Install Shadcn UI and configure it.
    -   [x] Install `lucide-react` as an icon dependency for Shadcn/general use.
-   [x] Install Zustand for state management.
-   [x] Set up testing environment (Jest, React Testing Library).

## Phase 1: Foundational Setup (Core Types, Store, Basic Grid)

### 1.1 Core Type Definitions (Prompt 1)
-   [x] Create `src/types/index.ts`.
-   [x] Define `Robot` type.
-   [x] Define `Task` type.
-   [x] Define `SimulationState` type (including `placementMode` and `lastAssignedRobotIndex`).

### 1.2 Zustand Store Setup (Prompt 2)
-   [x] Create `src/store/simulationStore.ts`.
-   [x] Import types into the store file.
-   [x] Create Zustand store (`useSimulationStore`) with initial `SimulationState`.
-   [x] Implement `setGridSize` action.
-   [x] Implement `setRobots` action.
-   [x] Implement `setTasks` action.
-   [x] Implement `setPlacementMode` action.
-   [x] Implement `addRobot` action (with unique ID generation).
-   [x] Implement `addTask` action (with unique ID generation).
-   [x] Implement `clearGrid` action.
-   [x] Implement `setTickSpeed` action.
-   [x] Implement `setStrategy` action.
-   [x] Implement `toggleIsRunning` action.
-   [x] Implement `setIsRunning` action.
-   [x] Implement `toggleDynamicTaskSpawning` action.
-   [x] Implement `resetSimulationState` action (initial version: clear paths/targets, unassign tasks, set `isRunning` false, reset `lastAssignedRobotIndex`).
-   [x] (Conceptual) Write unit tests for store actions (e.g., `addRobot`, `clearGrid`).

### 1.3 Grid Component - Static Rendering (Prompt 3)
-   [x] Create `src/components/Grid.tsx`.
-   [x] `Grid` component: Use `useSimulationStore` for `gridSize`, `robots`, `tasks`.
-   [x] `Grid` component: Render grid cells based on `gridSize`.
-   [x] `Grid` component: Style cells with borders and fixed size.
-   [x] `Grid` component: Render visual representation for `robots` at their positions.
-   [x] `Grid` component: Render visual representation for `tasks` at their positions.
-   [x] Update `src/app/page.tsx` to render the `Grid` component.
-   [x] (Temporary) Add sample robots/tasks in `page.tsx` via store actions for initial display.
-   [x] (Conceptual) Write component tests for `Grid` (cell count, robot/task rendering).

## Phase 2: User Interaction - Placement & Basic Controls

### 2.1 Grid Click Handler for Placement (Prompt 4)
-   [x] Create `isCellOccupied(row, col, robots, tasks)` utility function (in `src/lib/utils.ts` or `Grid.tsx`).
-   [x] (Conceptual) Write unit tests for `isCellOccupied`.
-   [x] `Grid` component: Add `onClick` handler to each cell.
-   [x] `Grid` component: Implement logic to add Robot/Task based on `placementMode` if cell is not occupied.
-   [x] `Grid` component: Use `addRobot` / `addTask` store actions.
-   [x] `Grid` component: Prevent placement on occupied cells.
-   [x] Remove temporary sample data loading from `page.tsx` if it conflicts.
-   [x] (Conceptual) Write component tests for grid click placement.

### 2.2 Control Panel - Basic Layout & Placement Mode Toggle (Prompt 5)
-   [x] Create `src/components/ControlPanel.tsx`.
-   [x] `ControlPanel`: Basic layout (fixed width, left side).
-   [x] `ControlPanel`: Use `useSimulationStore` for `placementMode` and `setPlacementMode`.
-   [x] `ControlPanel`: Add Shadcn `RadioGroup` or `Button`s for "robot" / "task" placement mode.
-   [x] `ControlPanel`: Update store on placement mode change.
-   [x] Update `src/app/page.tsx` layout: `ControlPanel` left, `Grid` right.
-   [x] (Conceptual) Write component tests for `ControlPanel` placement mode toggle.

## Phase 3: Simulation Configuration Controls (Control Panel)

### 3.1 Clear Grid & Configuration Controls (Prompt 6)
-   [x] `ControlPanel`: Add "Clear Grid" Shadcn `Button` -> `clearGrid` action.
-   [x] `ControlPanel`: Add Shadcn `Input` fields for "Rows" and "Columns" -> `gridSize` & `setGridSize`.
-   [x] `ControlPanel`: Add Shadcn `Select` for "Tick Speed" (1, 2, 5) -> `tickSpeed` & `setTickSpeed`.
-   [x] `ControlPanel`: Add Shadcn `Select` for "Strategy" (nearest, round-robin) -> `strategy` & `setStrategy`.
-   [x] `ControlPanel`: Add Shadcn `Switch` for "Dynamic Task Spawning" -> `dynamicTaskSpawning` & `toggleDynamicTaskSpawning`.
-   [x] (Conceptual) Write component tests for new controls in `ControlPanel`.

### 3.2 Simulation Start/Pause/Resume and Reset Buttons (Prompt 7)
-   [x] `ControlPanel`: Add "Start"/"Pause" Shadcn `Button` -> `toggleIsRunning` action.
-   [x] `ControlPanel`: Button label changes based on `isRunning`.
-   [x] `ControlPanel`: Prevent simulation start if no robots or tasks (alert/log).
-   [x] `ControlPanel`: Add "Reset" Shadcn `Button` -> `resetSimulationState` action.
-   [x] (Conceptual) Write component tests for Start/Pause and Reset buttons.

## Phase 4: Core Simulation Logic - Pathfinding and Movement

### 4.1 Pathfinding Utilities (Prompt 8)
-   [x] Create/update `src/lib/utils.ts` or `src/lib/pathfinding.ts`.
-   [x] Implement `calculateManhattanDistance(pos1, pos2)` function.
-   [x] Write unit tests for `calculateManhattanDistance`.
-   [x] Implement `findPath(startPos, endPos, gridSize, obstacles)` (BFS algorithm).
-   [x] Write comprehensive unit tests for `findPath`.

### 4.2 Simulation Tick & Robot Movement (Prompt 9)
-   [x] `simulationStore`: Add `moveRobot(robotId, nextPosition, remainingPath)` action.
-   [x] (Conceptual) Unit test `moveRobot` store action.
-   [x] Create `src/hooks/useSimulationRunner.ts` custom hook.
-   [x] `useSimulationRunner`: Manage `setInterval` based on `isRunning` and `tickSpeed`.
-   [x] `useSimulationRunner`: In tick, iterate robots; if robot has path, call `moveRobot` action.
-   [x] `useSimulationRunner`: Clear interval on `isRunning` false or unmount; update on `tickSpeed` change.
-   [x] `src/app/page.tsx`: Call `useSimulationRunner()` hook.
-   [x] (Manual Test) Manually assign a path to a robot to test movement.

## Phase 5: Task Assignment Logic

### 5.1 Nearest-First Strategy (Prompt 10)
-   [x] `simulationStore`: Add `assignTaskToRobot(robotId, taskId, path)` action.
-   [x] (Conceptual) Unit test `assignTaskToRobot` store action.
-   [x] Create `src/lib/assignmentStrategies.ts`.
-   [x] `assignmentStrategies`: Implement `assignTasksNearestFirst(robots, tasks, gridSize, obstacles)` function.
-   [x] Write unit tests for `assignTasksNearestFirst`.
-   [x] `useSimulationRunner`: Integrate `assignTasksNearestFirst` logic.
    -   [x] Prepare `obstacles` list.
    -   [x] Filter idle robots and unassigned tasks.
    -   [x] Call `assignTasksNearestFirst` if strategy is "nearest".
    -   [x] Call `assignTaskToRobot` for each returned assignment.
-   [x] (Manual Test) Verify Nearest-First assignment and robot movement.

### 5.2 Round-Robin Strategy (Prompt 11)
-   [x] `simulationStore`: Add `setLastAssignedRobotIndex(index)` action.
-   [x] `simulationStore`: Ensure `lastAssignedRobotIndex` is part of state and reset correctly.
-   [x] `assignmentStrategies`: Implement `assignTasksRoundRobin(robots, tasks, gridSize, obstacles, lastAssignedRobotIndex)` function.
-   [x] Write unit tests for `assignTasksRoundRobin`.
-   [x] `useSimulationRunner`: Integrate `assignTasksRoundRobin` logic.
    -   [x] Call `assignTasksRoundRobin` if strategy is "round-robin".
    -   [x] Call `assignTaskToRobot` for each assignment.
    -   [x] Call `setLastAssignedRobotIndex`.
-   [x] (Manual Test) Verify Round-Robin assignment.

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