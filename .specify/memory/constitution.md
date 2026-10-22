<!--
Sync Impact Report
Version change: unratified template -> 1.0.0
Modified principles: none; initial adoption
Added principles: Client-Only SPA; Approved Technology Stack; Client-Side Background Removal;
  Minimal User Interface; Modular Components
Added sections: Runtime and Data Boundaries; Development Workflow and Quality
Removed sections: none
Follow-up TODO: confirm the original ratification date and replace its TODO marker.
-->
# Small Image Background Remover Constitution

## Core Principles

### I. Client-Only SPA
The application MUST run as a single-page application entirely in the user's browser.
It MUST NOT require or introduce a backend service for application functionality.
This keeps the product small and deployable as a static client application.

### II. Approved Technology Stack
The application MUST use React, Vite, TypeScript, and Tailwind CSS. New dependencies
or technologies outside this stack MUST be justified as necessary to meet a requirement
and documented in the relevant feature plan.

### III. Client-Side Background Removal
The application MUST use `@imgly/background-removal` in the browser for background
removal. Images MUST be processed on the client and MUST NOT be sent to a server for
this operation. This preserves the client-only product boundary.

### IV. Minimal User Interface
The user interface MUST remain focused on the image background-removal workflow.
New UI elements MUST directly support that workflow and MUST avoid unnecessary
complexity.

### V. Modular Components
React components MUST be separated by clear UI or behavior responsibilities.
Shared behavior MUST be reused rather than duplicated when doing so improves clarity
without adding unnecessary abstraction.

## Runtime and Data Boundaries

The product is a browser-only SPA with no backend. Background removal MUST use
`@imgly/background-removal` in the client. Any future feature that would require
server-side processing or transfer of user images conflicts with this constitution
and requires an approved constitutional amendment before implementation.

## Development Workflow and Quality

Changes MUST preserve the client-only architecture and the approved technology stack.
For behavior changes, contributors MUST validate the affected workflow with relevant
automated tests or, where automated coverage is impractical, a documented manual check.
Reviews MUST verify that UI and component changes remain minimal, modular, and aligned
with these principles.

## Governance

This constitution takes precedence over conflicting project guidance. Amendments MUST
be made by updating this file, describing the rationale and impact, and obtaining
project-owner approval before implementation work that depends on the amendment.
Constitution versions use semantic versioning: MAJOR for incompatible principle or
governance changes, MINOR for new principles or materially expanded requirements,
and PATCH for clarifications that do not change obligations.
Every feature plan and code review MUST check for compliance with this constitution.
Any conflict or exception MUST be documented, reviewed, and resolved through an
amendment before the affected work proceeds.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): confirm original adoption date | **Last Amended**: 2026-10-21
