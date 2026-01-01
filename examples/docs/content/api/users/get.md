---
api: true
method: GET
path: /api/users
description: Retrieve a list of users.
parameters:
  - name: limit
    in: query
    description: Maximum number of users to return.
    required: false
    schema:
      type: integer
      default: 10
responses:
  '200':
    description: A list of users.
  '400':
    description: Invalid request.
---

This endpoint retrieves a list of users.
