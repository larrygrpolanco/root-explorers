# API Contract: POST /api/generate

## Overview

Endpoint to submit quiz data, construct prompt, call Gemini API, and return generated portrait. Server-side only; handles secure API key.

## Path

`POST /api/generate`

## Request

- **Method**: POST
- **Headers**: Content-Type: application/json
- **Body**: JSON object matching partial Character (quiz state)
  ```json
  {
  	"name": "string (required, non-empty)",
  	"species": "string (enum: predefined species list)",
  	"playbook": "string (enum: predefined playbooks list)",
  	"presentation": "string (max 200 chars)",
  	"demeanor": "string (max 200 chars)",
  	"item": "string (max 200 chars)",
  	"scene": "string (max 200 chars)"
  }
  ```
- **Validation**: Server validates enums, required fields, lengths; defaults empty customs to first option.

## Response

- **Status**: 200 OK on success, 500 on error (API failure, invalid input)
- **Body**: JSON full Character object
  ```json
  {
  	"name": "string",
  	"species": "string",
  	"playbook": "string",
  	"presentation": "string",
  	"demeanor": "string",
  	"item": "string",
  	"scene": "string",
  	"portrait": "string (URL or base64 image)",
  	"prompt": "string (constructed prompt for edit)"
  }
  ```
- **Error**: { "error": "Generation failed. Please try again." } with retry encouraged.

## Notes

- Constructs prompt template with inserted values + Root style reference image.
- Async: Expect 5-30s; client shows loading.
- Aligns with FR-004, error handling per spec.

**Version**: 1.0 | **Date**: 2025-09-26
