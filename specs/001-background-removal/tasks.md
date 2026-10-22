# Tasks: Eliminación local de fondos de imágenes

**Input**: Design documents from `/specs/001-background-removal/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md, quickstart.md

**Tests**: Include focused Vitest coverage for deterministic image-format validation. Validate browser-only workflows with the independent manual checks in `quickstart.md`.

**Organization**: Tasks are grouped by the four prioritized user stories. Story tasks are labeled `[US1]` through `[US4]`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other `[P]` tasks in the same phase because it touches separate files and has no unmet prerequisite.
- **[Story]**: User story identifier from `spec.md`.
- Every task description names the target file path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the client SPA scaffold and required development scripts.

- [X] T001 Create `package.json` with React, Vite, TypeScript, Tailwind CSS, `@imgly/background-removal` and its compatible `onnxruntime-web` peer dependency; include `dev`, `build`, and `preview` scripts.
- [X] T002 Configure strict TypeScript and integrate Tailwind CSS 4 through Vite in `tsconfig.json`, `vite.config.ts`, and `src/index.css`.
- [X] T003 [P] Create the HTML entry and React bootstrap in `index.html` and `src/main.tsx`, mounting the SPA into the root element.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define shared processing types, global app ownership, and safe browser resource cleanup before implementing stories.

- [X] T004 Create shared input, result, progress, status, and failure types in `src/types/image-processing.ts`; include the statuses `idle`, `validating`, `loading-model`, `decoding`, `removing-background`, `encoding`, `success`, and `error`.
- [X] T005 Create the shared React application shell in `src/App.tsx` and global Tailwind base styles in `src/index.css`.
- [X] T006 [P] Implement browser object-URL creation and cleanup helpers in `src/lib/image-resources.ts`; revoke preview URLs when the corresponding input or result is replaced or released.

**Checkpoint**: SPA scaffold and shared contracts are ready; user-story work can begin.

---

## Phase 3: User Story 1 - Eliminar el fondo de una imagen (Priority: P1) 🎯 MVP

**Goal**: Load one valid image from the file picker, remove its background locally, and show accurate processing, success, or recoverable error states.

**Independent Test**: Select a valid PNG, JPEG, and WebP individually; verify local processing, visible initialization/removal feedback, transparent result, and successful retry after a forced processing failure. Confirm the user's image is not sent to an application server.

### Implementation for User Story 1

- [X] T007 [P] [US1] Implement image validation in `src/lib/image-input.ts`; accept only `image/png`, `image/jpeg`, or `image/webp`, verify the file decodes as an image, and reject by content rather than trusting the filename extension.
- [X] T008 [P] [US1] Implement the processing lifecycle in `src/hooks/useBackgroundRemoval.ts` using `@imgly/background-removal`; pass the local `File`/`Blob`, map resource and compute callbacks to accurate states, show numeric progress only for reliable resource byte progress, and ignore stale callbacks using a run identifier.
- [X] T009 [P] [US1] Create the file-picker version of `ImageDropzone` in `src/components/ImageDropzone.tsx`; allow PNG, JPEG, and WebP selection and report the selected file to the application.
- [X] T010 [P] [US1] Create processing and recoverable error feedback in `src/components/ProcessingStatus.tsx`; show initialization, decoding, background-removal, and encoding labels without fabricating an inference percentage.
- [X] T011 [US1] Connect validation, file selection, `useBackgroundRemoval`, status, transparent result preview, and input/result URL cleanup in `src/App.tsx`; keep a previous successful result when a newly selected file is rejected.

**Checkpoint**: The P1 background-removal flow works independently through file selection.

---

## Phase 4: User Story 2 - Cargar una imagen de la forma preferida (Priority: P2)

**Goal**: Support drag-and-drop and keyboard paste in addition to the file picker, with identical validation and processing behavior.

**Independent Test**: Load each supported format by drop and paste; confirm each starts the same processing flow. Drop an unsupported file, paste text, and test an empty/blocked clipboard; confirm clear errors without losing a prior successful result.

### Implementation for User Story 2

- [X] T012 [US2] Extend `src/components/ImageDropzone.tsx` with drag-enter/over/leave/drop handling and hover/active-drop feedback; forward dropped files through the existing validation and processing path.
- [X] T013 [US2] Add `Ctrl+V`/`Cmd+V` image paste handling to `src/App.tsx`; accept clipboard image files only, route them through the shared validation path, and show an actionable message when the clipboard contains no readable image.
- [X] T014 [US2] Unify picker, drop, and paste dispatch in `src/App.tsx` and `src/lib/image-input.ts`; route every valid image through the same validation/processing callback and preserve the prior result when validation rejects a file.

**Checkpoint**: Picker, drag-and-drop, and paste provide equivalent image intake behavior.

---

## Phase 5: User Story 3 - Revisar, copiar y descargar el resultado (Priority: P2)

**Goal**: Compare original and processed images interactively and export the transparent result as PNG at source pixel dimensions.

**Independent Test**: Process an image and move the comparison control; download and inspect a PNG for alpha transparency and identical width/height; copy PNG from a secure context and confirm clear fallback feedback when clipboard write is denied.

### Implementation for User Story 3

- [X] T015 [P] [US3] Create the interactive original/result split slider in `src/components/ImageComparison.tsx`; expose an accessible keyboard-operable range control and render processed transparency distinctly.
- [X] T016 [P] [US3] Implement result export helpers in `src/lib/image-export.ts`; use the returned PNG `Blob` without upscaling, retain alpha and source dimensions, derive a `.png` download name, and write clipboard data as `image/png` only from an explicit user action.
- [X] T017 [US3] Create result download and clipboard actions in `src/components/ResultActions.tsx`; use labels «Descargar PNG (HD)» and «Copiar al portapapeles», confirm successful copy, and report unavailable/denied clipboard writes while keeping download available.
- [X] T018 [US3] Integrate `ImageComparison` and `ResultActions` in `src/App.tsx` only when processing succeeds; bind both to the same processed PNG result and release obsolete preview URLs.

**Checkpoint**: A completed run can be compared, downloaded transparently at source dimensions, and copied where browser permissions allow.

---

## Phase 6: User Story 4 - Usar una interfaz clara y enfocada (Priority: P3)

**Goal**: Deliver the requested premium dark visual design while keeping the complete workflow legible and usable on narrow screens.

**Independent Test**: Review idle, drag, loading, error, success, comparison, and action states on desktop and a narrow viewport; verify dark styling, Plus Jakarta Sans, hover/drag feedback, readable controls, and no horizontal overflow.

### Implementation for User Story 4

- [X] T019 [P] [US4] Apply the deep slate/zinc theme, Plus Jakarta Sans typography, subtle borders, restrained glass surfaces, and soft shadows in `src/index.css`.
- [X] T020 [US4] Style the centered floating application card, status layout, and responsive page spacing in `src/App.tsx` and `src/index.css`; preserve all primary actions without horizontal scrolling on narrow screens.
- [X] T021 [US4] Add the refined dashed dropzone, hover/drag transitions, and polished focus/disabled states in `src/components/ImageDropzone.tsx`, `src/components/ProcessingStatus.tsx`, and `src/components/ResultActions.tsx`.
- [X] T022 [US4] Refine the comparison slider and transparent-result presentation across narrow and wide viewports in `src/components/ImageComparison.tsx`.

**Checkpoint**: The full flow retains the requested visual hierarchy and responsive behavior across all states.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Confirm the completed increments meet privacy, robustness, and documented workflow expectations.

- [X] T023 Review error recovery, stale-run handling, and browser object-URL cleanup across `src/hooks/useBackgroundRemoval.ts`, `src/App.tsx`, and `src/lib/image-resources.ts`.
- [X] T024 Verify model/runtime resource loading and asset CORS from localhost without transmitting user images; record the production-origin CORS caveat in `specs/001-background-removal/quickstart.md`.
- [X] T025 Add Vitest coverage for supported image signatures and invalid file content in `tests/unit/image-input.test.ts`.
- [X] T026 Run `npm run test`, `npm run build`, and the manual end-to-end checks documented in `specs/001-background-removal/quickstart.md`; record environment-specific corrections in that guide.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user-story implementation.
- **User Story 1 (Phase 3)**: Depends on the shared types, SPA shell, and resource lifecycle from Phase 2.
- **User Story 2 (Phase 4)**: Depends on User Story 1's file validation and processing entry point so all intake methods share behavior.
- **User Story 3 (Phase 5)**: Depends on User Story 1's processed PNG result and Phase 2 resource lifecycle; independent of User Story 2's additional intake methods.
- **User Story 4 (Phase 6)**: Depends on the shared shell and the UI components from User Stories 1–3 that it styles.
- **Polish (Phase 7)**: Depends on all desired stories being complete.

### User Story Dependencies

- **US1 (P1)**: First user-facing increment after Phase 2; no other user story dependency.
- **US2 (P2)**: Depends on US1's shared validation and processing path.
- **US3 (P2)**: Depends on US1's result lifecycle; can proceed independently of US2 once US1 is complete.
- **US4 (P3)**: Depends on the components introduced in US1–US3.

### Parallel Opportunities

- In Setup, T002 and T003 can proceed in parallel after or alongside package-manifest planning because they modify separate configuration/entry files.
- In Foundational, T004 and T006 can proceed in parallel; T005 uses the shared types once available.
- In US1, T007–T010 can proceed in parallel because validation, processing, picker UI, and status UI are separate files; integrate them with T011 after completion.
- In US3, T015 and T016 can proceed in parallel; T017 depends on export helpers, and T018 integrates the completed result surfaces.
- In US4, T019 can proceed in parallel with T021; T020 and T022 depend on the styled component structure being available.

## Parallel Example: User Story 1

```text
After Phase 2, work these files in parallel:
- T007: Validate image inputs in src/lib/image-input.ts
- T008: Implement browser processing lifecycle in src/hooks/useBackgroundRemoval.ts
- T009: Create picker intake in src/components/ImageDropzone.tsx
- T010: Create processing feedback in src/components/ProcessingStatus.tsx
Then integrate them through T011 in src/App.tsx.
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational tasks.
2. Complete US1 and validate file-picker processing, feedback, retry behavior, and local-only image handling.
3. Stop for an independent P1 review before implementing additional intake modes or polish.

### Incremental Delivery

1. Setup + Foundational → application scaffold.
2. US1 → working local background-removal MVP.
3. US2 → drag-and-drop and clipboard image intake.
4. US3 → comparison, PNG download, and clipboard copy.
5. US4 → premium responsive visual treatment.
6. Polish → verify privacy, resource hosting behavior, and the quickstart workflow.
