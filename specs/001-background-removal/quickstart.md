# Quickstart: Validación de eliminación local de fondos

This guide is for validating the feature after implementation. It does not prescribe
implementation code.

## Prerequisites

- Node.js LTS with npm.
- A modern browser capable of running the browser image-processing library.
- A stable connection for the browser's initial model/runtime resource download.
- Test fixtures: one valid PNG, JPEG, and WebP, one unsupported file, and one corrupt
  image renamed with an accepted extension.

## Setup and Run

From the repository root:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite. The first processing attempt may need to fetch
model/runtime assets. The image itself must remain on-device.

## Automated Validation

Run the project checks:

```powershell
npm run test
npm run build
npm run test:e2e
```

Expected outcome: unit/component, production build, and browser workflow checks pass.
The test suite should cover valid/invalid input, state changes, output dimensions and
transparency, comparison interaction, error recovery, and unsupported clipboard
capabilities.

## Manual End-to-End Scenarios

1. **File picker**: Load each supported fixture. Confirm processing phases, successful
   result, interactive comparison, and no horizontal overflow on desktop and narrow
   viewport.
2. **Drag-and-drop**: Drop a supported image and confirm it follows the same flow.
   Drop an unsupported file and confirm a clear rejection.
3. **Paste**: Copy an image and use `Ctrl+V` / `Cmd+V` on the application. Confirm the
   result, then try pasting text or using a browser that denies clipboard access.
4. **Download**: Download the result as PNG. Verify its pixel dimensions equal the
   source dimensions and that transparent pixels remain transparent.
5. **Clipboard**: Copy a successful result where supported; confirm user feedback.
   Where unsupported or denied, confirm a clear explanation and working download.
6. **Recovery**: Simulate a processing/resource failure; confirm an error is shown and
   a later valid image can succeed.
7. **Privacy**: In browser developer tools, inspect network requests while processing.
   Confirm model/runtime resources may download but no request contains or uploads the
   user's image.

## Expected Outcomes

- All supported formats work through picker, drop, and paste.
- Errors remain recoverable and never appear as successful results.
- The downloaded PNG is transparent and preserves original pixel dimensions.
- No user image is transmitted to a server.
