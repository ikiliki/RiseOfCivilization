---
name: technical-spec
description: Write technical specification from architecture. Use when creating implementation-ready specs for the coder.
---

# Technical Specification

Write implementation-ready technical spec from architecture design.

## Output

Add `## Technical Specification` to feature doc or create `docs/tech-specs/<feature>.md`.

## Required Sections

1. **API Contract**
   - Method, path, request/response shape
   - Error codes, validation rules

2. **Database Schema**
   - Tables, columns, indexes
   - Migration notes

3. **Client Components**
   - Component tree, props, state
   - Placement (components, features, pages)

4. **Server Modules**
   - Routes, handlers, services
   - Dependencies

5. **Implementation Order**
   - Step 1: DB migration
   - Step 2: API
   - Step 3: Client
   - (or dependency-ordered list)

6. **Verification**
   - Commands to run
   - Test scenarios

## Format

Use markdown tables for API/schema. Be explicit enough for coder to implement without guessing.
