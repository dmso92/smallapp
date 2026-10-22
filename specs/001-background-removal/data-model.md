# Data Model: Eliminación local de fondos de imágenes

All entities are transient browser-memory values. The feature does not persist images,
processing results, or user metadata.

## Input Image

Represents the single image accepted for the active processing run.

| Field | Type | Rules |
|-------|------|-------|
| `file` | Browser `File` | Must contain a valid PNG, JPEG, or WebP image. |
| `name` | string | Original filename when available; pasted images may use a generated name. |
| `mimeType` | string | Must resolve to `image/png`, `image/jpeg`, or `image/webp`; extension alone is insufficient validation. |
| `width` | positive integer | Decoded source width in pixels. |
| `height` | positive integer | Decoded source height in pixels. |
| `previewUrl` | object URL | Temporary local preview resource; must be revoked when replaced or released. |

## Processing Run

Represents the latest accepted input from intake through completion or failure.

| Field | Type | Rules |
|-------|------|-------|
| `input` | Input Image | One accepted image per run. |
| `status` | enum | `idle`, `validating`, `loading-model`, `decoding`, `removing-background`, `encoding`, `success`, `error`. |
| `progress` | resource progress or unavailable | Optional `{ current, total }` byte counts for resource loading when supplied; do not show as inference percentage. |
| `error` | user-readable message or empty | Set only in `error`; never represent a failed run as successful. |
| `runId` | monotonically increasing identifier | A completion from an older run must not overwrite the latest accepted run. |

### State Transitions

```text
idle -> validating
validating -> loading-model -> decoding -> removing-background -> encoding -> success
validating -> error
loading-model -> error
decoding -> error
removing-background -> error
encoding -> error
error -> validating
success -> validating
```

A new valid input creates the current run and supersedes the prior result. An input
rejected during validation does not clear a previously successful result. Late progress
or completion callbacks from a superseded run are ignored. Error recovery starts a new
run; the previous error is cleared when its input is accepted.

## Processed Image

Represents a successful background-removal result.

| Field | Type | Rules |
|-------|------|-------|
| `blob` | browser `Blob` | Contains the output image with transparent background. |
| `mimeType` | string | `image/png`. |
| `width` | positive integer | Must equal the input width in pixels. |
| `height` | positive integer | Must equal the input height in pixels. |
| `previewUrl` | object URL | Temporary local preview resource; revoke when the result is replaced or released. |
| `downloadName` | string | Derived from the input filename with a `.png` extension. |

## Relationships

- One processing run has one input image and has zero or one processed image.
- A processed image exists only when the run status is `success`.
- UI state and temporary object URLs belong to the active run; they are not durable data.
