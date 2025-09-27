# API Contract: GET /api/gallery

## Overview

Endpoint to load all saved characters from the gallery JSON file for display.

## Path

`GET /api/gallery`

## Request

- **Method**: GET
- **Headers**: None
- **Body**: N/A

## Response

- **Status**: 200 OK
- **Body**: JSON array of Character objects
  ```json
  [
  	{
  		"name": "string",
  		"species": "string",
  		"playbook": "string",
  		"presentation": "string",
  		"demeanor": "string",
  		"item": "string",
  		"scene": "string",
  		"portrait": "string (URL or base64)",
  		"prompt": "string (optional)",
  		"createdAt": "ISO timestamp"
  	}
  ]
  ```
- **Error**: 500 if file read failure; return empty [] on corruption.

## Notes

- Reads from src/lib/server/gallery.json; reset to [] if invalid.
- No params (full list); client renders grid/list.
- Aligns with FR-007; fast load for small scale.

**Version**: 1.0 | **Date**: 2025-09-26
