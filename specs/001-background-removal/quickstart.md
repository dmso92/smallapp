# Quickstart: Validación de eliminación local de fondos

This guide is for validating the feature after implementation. It does not prescribe
implementation code.

## Prerequisites

- Node.js `^22.12.0 || ^24.0.0 || >=26.0.0` with npm.
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
```

Expected outcome: focused input-validation tests and the production build pass.
Browser workflows, output dimensions and transparency, comparison interaction, error
recovery, clipboard permissions, and image privacy are checked manually below.

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

## Local Verification Record

- `npm run test`: passed, 6 focused signature and image-validation tests.
- `npm run build`: passed, including strict TypeScript checking and production bundling.
- `npm audit`: passed with zero reported vulnerabilities after installing the locked
  dependency tree.
- Browser checks on localhost successfully processed PNG by file picker, JPEG by
  drag-and-drop, and WebP by paste. The interactive comparison responded to keyboard
  input; clipboard copy succeeded; an unsupported GIF was rejected while the previous
  result remained available.
- The WebP result was verified in-browser as `image/png`, 32 × 32 pixels, with
  transparent pixels. The download action created a `.png` link to the result Blob;
  the browser automation harness did not expose a saved-download event.
- The browser network capture observed 58 requests and no request bodies. External
  requests were font resources and versioned IMG.LY model/WASM resources; the user
  image remained local. The model loaded successfully from localhost against the
  public asset origin. Production-host CORS must still be checked for its deployed
  origin. The dev browser logged the expected single-thread WASM fallback because
  cross-origin isolation is not configured; the processing flow still succeeded.
- A blocked model-resource request produced a visible recoverable error. Because the
  library memoizes a rejected initialization promise for the page lifetime, recovery
  from a resource-fetch failure requires reloading the page and choosing the image
  again; the error explains this. After the blocked route was removed and the page
  reloaded, processing succeeded.
