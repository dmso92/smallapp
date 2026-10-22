# Research: Eliminación local de fondos de imágenes

## Decision 1: Use the browser package directly; do not add an application worker

**Decision**: Call `@imgly/background-removal` in the browser with the local `File`
(`Blob`) and use its standard CPU/WASM execution path. Do not introduce a custom worker
for the first release. Pin the package and its `onnxruntime-web` peer dependency to a
compatible documented version pair.

**Rationale**: The package accepts local `Blob` inputs and runs ONNX/WASM in the
browser. Its documented defaults use CPU, while its worker proxy path is associated
with WebGPU; the repository source notes that CPU/WASM worker proxying is not working.
This meets client-only processing without layering an unsupported worker setup over
the library.

**Alternatives considered**:
- Add a custom worker: unnecessary for the supported default path and adds build and
  lifecycle complexity.
- Require WebGPU: excludes otherwise capable browsers and is not required by the
  product.

Sources: [IMG.LY browser package README](https://github.com/imgly/background-removal-js/blob/12f56cc4f2a90d624e165a715748d22efc7a1d93/packages/web/README.md),
[configuration defaults](https://github.com/imgly/background-removal-js/blob/12f56cc4f2a90d624e165a715748d22efc7a1d93/packages/web/src/schema.ts#L26-L52),
[execution and worker selection](https://github.com/imgly/background-removal-js/blob/12f56cc4f2a90d624e165a715748d22efc7a1d93/packages/web/src/onnx.ts#L13-L44),
[package peer dependency](https://github.com/imgly/background-removal-js/blob/12f56cc4f2a90d624e165a715748d22efc7a1d93/packages/web/package.json#L62-L69).

## Decision 2: Keep model/runtime resources distinct from user-image privacy

**Decision**: Allow the library to fetch its versioned model and WASM resources on
demand from its documented public asset path for the initial deployment. Do not send
the user's selected image or processed output in those requests. Keep resource source
configuration isolated so assets can be self-hosted later with a matching package
version if deployment or availability requirements call for it.

**Rationale**: The library fetches model/runtime assets separately from the app bundle.
This is not an image upload, but it means first-use processing needs a network
connection and users should receive accurate loading feedback. Self-hosting can reduce
external runtime dependence but adds static-asset packaging and deployment work not
required by the current spec.

**Alternatives considered**:
- Bundle all model/runtime assets with the app: increases deployment payload and
  initial delivery for users who may not process an image.
- Require self-hosting immediately: improves control but needs hosting/build decisions
  outside the specified product scope.

Production validation must check the deployed resource URLs and CORS behavior. IMG.LY
documents COOP/COEP headers for `SharedArrayBuffer` performance; treat those headers
as optional optimization, not a functional requirement, because the asset origin and
production host must support the cross-origin isolation policy.

Sources: [IMG.LY asset defaults](https://github.com/imgly/background-removal-js/blob/12f56cc4f2a90d624e165a715748d22efc7a1d93/packages/web/src/schema.ts#L7-L20),
[resource fetching](https://github.com/imgly/background-removal-js/blob/12f56cc4f2a90d624e165a715748d22efc7a1d93/packages/web/src/resource.ts#L31-L80),
[self-hosting and deployment guidance](https://github.com/imgly/background-removal-js/blob/12f56cc4f2a90d624e165a715748d22efc7a1d93/packages/web/README.md#L102-L129),
[MDN: SharedArrayBuffer security requirements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements),
[MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS).

## Decision 3: Report real phases and resource loading progress, not fabricated inference percentages

**Decision**: Map the library's callback events into user-facing loading, decode,
background removal, and output-encoding phases. Show a numeric progress indicator for
resource downloads only when `current` and `total` provide a usable ratio. During
inference, show an activity indicator and phase label rather than claiming a
continuous percentage.

**Rationale**: Resource callbacks report fetched bytes, while computation callbacks
mark a small number of discrete steps. A smooth percentage during inference would
misrepresent the signal and could imply precision the library does not provide.

**Alternatives considered**:
- Display one percentage across loading and compute: resource bytes and compute phases
  use different units, so a combined percentage would be misleading.
- Display only a spinner: accurate, but loses meaningful asset-loading and phase
  feedback that the library exposes.

Sources: [callback type](https://github.com/imgly/background-removal-js/blob/12f56cc4f2a90d624e165a715748d22efc7a1d93/packages/web/src/schema.ts#L41-L52),
[resource progress](https://github.com/imgly/background-removal-js/blob/12f56cc4f2a90d624e165a715748d22efc7a1d93/packages/web/src/resource.ts#L48-L68),
[compute phase events](https://github.com/imgly/background-removal-js/blob/12f56cc4f2a90d624e165a715748d22efc7a1d93/packages/web/src/api/v1.ts#L31-L64).

## Decision 4: Preserve dimensions and alpha using the library's PNG result

**Decision**: Use the library's returned PNG `Blob` as the result and retain its
default source-dimension rescaling. Preview and download the same result; derive
temporary object URLs and revoke them when replaced or released.

**Rationale**: The package returns a `Blob`, PNG is its default output, the mask is
applied to the alpha channel, and default rescaling restores the source dimensions.
Avoiding a second canvas conversion prevents unnecessary re-encoding and makes
transparency and dimensions easier to validate.

**Alternatives considered**:
- Re-encode via a separate canvas for every action: duplicates work and risks changing
  dimensions or transparency.
- Disable rescaling: conflicts with the clarified requirement to preserve source
  dimensions.

Sources: [input types](https://github.com/imgly/background-removal-js/blob/12f56cc4f2a90d624e165a715748d22efc7a1d93/packages/web/src/utils.ts#L15-L24),
[output defaults](https://github.com/imgly/background-removal-js/blob/12f56cc4f2a90d624e165a715748d22efc7a1d93/packages/web/src/schema.ts#L71-L89),
[PNG result and alpha](https://github.com/imgly/background-removal-js/blob/12f56cc4f2a90d624e165a715748d22efc7a1d93/packages/web/src/api/v1.ts#L48-L64),
[dimension rescaling](https://github.com/imgly/background-removal-js/blob/12f56cc4f2a90d624e165a715748d22efc7a1d93/packages/web/src/inference.ts#L33-L64),
[MDN: object URLs](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static).

## Decision 5: Copy PNG only from an explicit user action in a secure context

**Decision**: Write the output as an `image/png` clipboard item only when the user
activates the copy button. Handle rejected or unavailable clipboard writes with
visible feedback and keep download available.

**Rationale**: Browser clipboard writing requires a secure context and may require
permission or transient user activation; browser support can vary. An explicit button
click satisfies the gesture requirement and allows actionable error handling.

**Alternatives considered**:
- Copy automatically after processing: lacks the user's explicit intent and may be
  rejected without an activation gesture.
- Use a nonstandard alpha/RGBA clipboard MIME type: not the interoperable PNG path.

Sources: [MDN: Clipboard API security](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API#security_considerations),
[MDN: Clipboard.write()](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/write),
[MDN: ClipboardItem format support](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem/supports_static),
[MDN: secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Secure_Contexts).

## Dependency and validation decisions

- Use the package's standard browser/WASM path and align `onnxruntime-web` with the
  package's declared peer dependency; avoid an independently floating runtime version.
- Use Vitest and Testing Library for isolated input, state, and component behavior;
  use Playwright for real browser workflows and secure-context clipboard behavior.
- Keep user images and intermediate/output blobs in memory only. Inspect network
  activity during an end-to-end run to verify the image is never transmitted.
- No technical unknown remains that blocks the initial implementation plan.
