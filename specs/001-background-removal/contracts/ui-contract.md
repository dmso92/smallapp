# User Interface Contract

This client-only application exposes no server API. Its public contract is the visible
browser interaction and the files/actions it produces.

## Image Intake

- Accepted formats: PNG (`image/png`), JPEG (`image/jpeg`), and WebP (`image/webp`).
- Intake methods: file picker, drag-and-drop, and keyboard paste (`Ctrl+V` / `Cmd+V`).
- Each intake method starts the same validation and processing flow.
- Reject unsupported or undecodable images with an understandable message and the
  accepted formats. Do not upload images to an application server.
- The first release processes one image at a time. A valid new image supersedes the
  prior run; rejected input leaves the prior successful result intact.

## Processing Feedback

- Expose a distinct idle state and visible processing, success, and error states.
- During processing, announce resource loading, image decoding, background removal,
  and output encoding using accurate phase messages. Show numeric progress only for
  resource downloads when reliable byte progress is available; do not show a
  fabricated inference percentage.
- The first run may download model/runtime assets. These downloads must not contain
  the user's image; processing must fail visibly if required assets are unavailable.
- Processing and model/resource failures must produce a recoverable error state.

## Result and Actions

- Display the original and processed image in an interactive before/after comparison.
- Make the processed image's transparency distinguishable from the page background.
- Download action label: **Descargar PNG (HD)**.
- Download format: PNG with transparency and the same pixel width and height as the
  source image; no upscaling.
- Clipboard action label: **Copiar al portapapeles**.
- Confirm a successful copy. If the browser disallows image clipboard writes, explain
  that copying is unavailable and keep download usable.

## Visual and Responsive Behavior

- Default to a deep dark theme with a centered, uncluttered card, subtle borders,
  restrained glass effects, soft shadows, and Plus Jakarta Sans.
- The dropzone communicates hover and active drag states.
- On narrow viewports, all primary actions remain visible and operable without
  horizontal scrolling.
