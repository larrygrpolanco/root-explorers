# Phase 1: Data Model for Root Vagabond Portrait Creator

## Overview

This document defines the key entities, their attributes, relationships, and validation rules extracted from the feature spec, PRD, and research. The model focuses on simplicity: a single Character entity for quiz results and a Gallery as a collection for persistence. No complex schemas; aligns with constitution's Technical Reliability and Simplicity (JSON storage, no DB).

## Entities

### Character

Represents a generated vagabond portrait from quiz inputs and AI output.

**Attributes**:

- `name`: string (required, non-empty, max 50 chars) - User's chosen name.
- `species`: string (required, enum: ['Badger', 'Bird', 'Cat', 'Fox', 'Mouse', 'Owl', 'Rabbit', 'Raccoon', 'Squirrel', 'Wolf', 'Beaver', 'Opossum']) - Selected or default species.
- `playbook`: string (required, enum: ['Adventurer', 'Arbiter', 'Harrier', 'Ranger', 'Ronin', 'Scoundrel', 'Thief', 'Tinker', 'Vagrant']) - Selected playbook.
- `presentation`: string (required, max 200 chars) - Description of attire/appearance (from radio or custom).
- `demeanor`: string (required, max 200 chars) - Behavioral trait (from radio or custom).
- `item`: string (required, max 200 chars) - Signature item (from radio or custom).
- `scene`: string (required, max 200 chars) - Current setting (from radio or custom).
- `portrait`: string (optional, URL or base64) - Generated image from Gemini API.
- `prompt`: string (optional, for edit) - The constructed prompt used for generation.
- `createdAt`: timestamp (auto) - When saved to gallery.

**Validation Rules**:

- Name: Required, trimmed, no leading/trailing spaces; error if empty.
- Species/Playbook: Must match enum; default to first if invalid.
- Descriptions (presentation, demeanor, item, scene): Required; if custom empty, default to first pre-written option; trim and limit to 200 chars (error if exceeded).
- Portrait: Valid URL/base64; required for gallery save.
- Overall: Quiz state object must be complete before API call.

**State Transitions**:

- Draft (quiz in progress) → Generated (post-API) → Saved (to gallery) or Discarded (Try Again/Edit).

### Gallery

A simple collection of saved Characters; persisted as JSON array.

**Attributes**:

- `entries`: array of Character (no additional fields; flat list).

**Validation Rules**:

- On load: If JSON corrupted/missing, reset to empty array [].
- On save: Append new Character; allow duplicates (no uniqueness check).
- Size: No limit, but optimize for <50 entries (instant load).

## Relationships

- One-to-Many: Gallery 1 → \* Characters (composition; gallery owns entries).
- No foreign keys (JSON simplicity); each Character is self-contained.
- Quiz State → Character: Quiz object maps directly to Character attributes (pre-portrait).

## Data Flow

1. Frontend: Svelte store holds quiz state (partial Character).
2. Submission: POST to /api/generate → Server constructs prompt, calls Gemini → Returns full Character (with portrait/prompt).
3. Save: POST to /api/save → Append to gallery.json.
4. View: GET /api/gallery → Return entries array.

## Alignment Notes

- Supports User Experience Simplicity: Minimal fields for quick quiz.
- Creative Flexibility: Custom strings in descriptions.
- Privacy: Local JSON, no user IDs.
- No gaps; model is complete for spec.

**Version**: 1.0 | **Date**: 2025-09-26
