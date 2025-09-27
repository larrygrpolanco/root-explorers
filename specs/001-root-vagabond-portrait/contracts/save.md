# API Contract: POST /api/save

## Overview

Endpoint to save a generated Character to the gallery JSON file.

## Path

`POST /api/save`

## Request

- **Method**: POST
- **Headers**: Content-Type: application/json
- **Body**: JSON full Character object (from /generate response)
  ```json
  {
  	"name": "string (required)",
  	"species": "string",
  	"playbook": "string",
  	"presentation": "string",
  	"demeanor": "string",
  	"item": "string",
  	"scene": "string",
  	"portrait": "string (required, URL or base64)",
  	"prompt": "string (optional)",
  	"createdAt": "ISO timestamp (auto if missing)"
  }
  ```
- **Validation**: Server checks required fields (name, portrait); appends createdAt if absent.

## Response

- **Status**: 200 OK on success, 400 on invalid data, 500 on file write error
- **Body**: { "success": true, "message": "Character saved to gallery" }
- **Error**: { "error": "Invalid character data" } or { "error": "Save failed" }

## Notes

- Appends to gallery.json array; allows duplicates.
- Server-side fs write; atomic if possible (backup/rollback on fail).
- Aligns with FR-006; called after user clicks Save on results.

**Version**: 1.0 | **Date**: 2025-09-26
