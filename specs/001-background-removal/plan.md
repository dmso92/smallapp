# Implementation Plan: Eliminación local de fondos de imágenes

**Branch**: `001-background-removal` | **Date**: 2026-10-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-background-removal/spec.md`

## Summary

Build a client-only React SPA that accepts PNG, JPEG, and WebP images through file
selection, drag-and-drop, or paste; removes the background in the browser with
`@imgly/background-removal`; and offers an interactive before/after comparison,
PNG download at the input dimensions, and clipboard copy. Use Vite, TypeScript, and
Tailwind CSS, with a dark, minimal responsive interface. No application backend is
introduced. Model/runtime assets may be fetched by the browser; the user's image must
remain local.

## Technical Context

**Language/Version**: TypeScript (strict mode), modern browser JavaScript runtime

**Primary Dependencies**: React, Vite, Tailwind CSS, `@imgly/background-removal` with
its declared compatible `onnxruntime-web` peer; Vitest and Testing Library for
unit/component tests; Playwright for browser workflow tests

**Storage**: N/A; image and processing state are held in browser memory only

**Testing**: Vitest + Testing Library for input/state/component behavior; Playwright for
browser-level file, drag/drop, download, responsive, and clipboard workflows; manual
network inspection to verify image privacy; deployed resource URL/CORS verification

**Target Platform**: Current desktop and mobile browsers that support the library's
browser runtime; clipboard writes require a secure context, browser support, and
user permission/activation

**Project Type**: Single-project client-side web application

**Performance Goals**: Keep the interface responsive while processing; communicate
model resource loading and processing phases; show a numeric percentage only for
resource downloads with reliable progress; allow a user to finish the primary workflow
within the specification's two-minute target, excluding initial model-resource download

**Constraints**: No backend; user images are not uploaded; model assets may be downloaded
to the browser on demand; output remains the library's transparent PNG at source pixel
dimensions; process one image at a time; clipboard support is capability-dependent;
no arbitrary input size cap; do not create a custom processing worker for the default
CPU/WASM path

**Scale/Scope**: One SPA, one image at a time, one primary background-removal journey,
responsive desktop and narrow-screen UI

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Plan alignment | Gate |
|-----------|---------------|------|
| I. Client-Only SPA | All app behavior runs in the browser; no application backend. | PASS |
| II. Approved Technology Stack | React, Vite, TypeScript, and Tailwind CSS are the required stack. Test tools support validation only. | PASS |
| III. Client-Side Background Removal | Use `@imgly/background-removal`; do not upload user images. | PASS |
| IV. Minimal User Interface | One focused upload, progress, comparison, and export flow. | PASS |
| V. Modular Components | Separate input, progress/error, comparison, and export responsibilities. | PASS |

No constitutional violations or exceptions are proposed.
The same checks were repeated after the Phase 1 design artifacts were drafted; all
principles remain satisfied and no exception is needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-background-removal/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
index.html
package.json
vite.config.ts
tsconfig.json
postcss.config.js
tailwind.config.js
src/
├── main.tsx
├── App.tsx
├── index.css
├── components/
│   ├── ImageDropzone.tsx
│   ├── ProcessingStatus.tsx
│   ├── ImageComparison.tsx
│   └── ResultActions.tsx
├── hooks/
│   └── useBackgroundRemoval.ts
├── lib/
│   ├── image-input.ts
│   └── image-export.ts
└── types/
    └── image-processing.ts
tests/
├── unit/
├── components/
└── e2e/
```

**Structure Decision**: Use one Vite SPA with focused feature components, a single
processing hook, and small browser-image helpers. The repository currently contains
Spec Kit configuration and feature documents but no application package or source
files, so this plan establishes the application structure rather than adapting an
existing code layout. Use the library's default browser execution path and fetch model
assets only when needed. Do not configure cross-origin isolation headers unless a later
deployment decision verifies the benefits and compatibility of COOP/COEP with the
chosen asset origin. Avoid persistence and backend packages.

## Complexity Tracking

No constitution violations; no added architectural complexity requires exception.
