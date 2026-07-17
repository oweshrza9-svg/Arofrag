# AROFRAG - Project Status

Last Updated:
17 July 2026

Repository:
https://github.com/oweshrza9-svg/Arofrag

---

# Project Overview

AROFRAG is a premium attar/perfume e-commerce website.

## Tech Stack

Frontend
- HTML5
- CSS3
- Vanilla JavaScript

Backend
- Node.js
- Express.js

Database
- MongoDB

Version Control
- Git
- GitHub

---

# Folder Structure

Frontend
- index.html
- shop.html
- product.html
- cart.html
- checkout.html
- wishlist.html
- login.html
- about.html
- contact.html

JavaScript
- app.js
- main.js
- product.js
- shop.js
- cart.js
- checkout.js
- wishlist.js
- util.js

Backend
- server.js
- routes/
- controllers/
- models/
- middleware/

Database
- MongoDB

---

# AI Team Roles

## ChatGPT (Tech Lead)

Responsibilities

- Project architecture
- Full-stack debugging
- Backend + frontend integration
- Code review
- Performance optimization
- Explain concepts
- Final approval before code changes

Never rewrite large sections unless required.

---

## Grok (Independent Debugger)

Responsibilities

- JavaScript debugging
- Console error analysis
- Browser issues
- Alternative debugging ideas

Never redesign project architecture.

---

## GitHub Copilot

Responsibilities

- Autocomplete
- Boilerplate
- Small helper functions
- Repetitive code

---

# Development Rules

1. Never redesign UI unless requested.

2. Never modify unrelated files.

3. Fix one subsystem at a time.

4. Root cause first.

5. Smallest possible fix.

6. Test before moving on.

7. Commit after every successful subsystem.

---

# Debug Workflow

Problem

↓

Reproduce

↓

Console Errors

↓

Network

↓

Root Cause

↓

Fix

↓

Regression Test

↓

Commit

---

# Completed Features

## Backend

- Express Server
- MongoDB Connection
- Product API

## Frontend

- Homepage
- Shop Page
- Product Page
- Cart UI
- Wishlist UI

---

# Known Bugs

## Homepage

Status:
IN PROGRESS

Problems

- Signature Collection rendering
- Duplicate JavaScript loading
- Homepage script organization

---

## Product Page

Status:
IN PROGRESS

Problems

- Product loading verification
- Gallery
- Size selector

---

## Cart

Status:
PENDING

Problems

- Cart synchronization
- Quantity update

---

## Checkout

Status:
PENDING

Problems

- getCart undefined
- Validation

---

## Wishlist

Status:
PENDING

Problems

- Sync with products
- Remove item

---

# Current Priorities

Priority 1

Homepage

Priority 2

Product Page

Priority 3

Cart

Priority 4

Checkout

Priority 5

Wishlist

Priority 6

Authentication

Priority 7

Admin Panel

---

# Before Asking Any AI

Always provide

Project

AROFRAG

Repository

https://github.com/oweshrza9-svg/Arofrag

Page

Problem

Expected Result

Actual Result

Console Errors

Network Errors

Relevant Files

Do not rewrite the project.

Find only the root cause.

Suggest the smallest fix.

---

# Commit History

Example

✔ Homepage renders products

✔ Product page fixed

✔ Cart working

✔ Checkout fixed

✔ Wishlist fixed

---

# Decisions

Use MongoDB as the single source of truth.

Do not use static JSON.

Do not duplicate JavaScript constants.

Do not load unnecessary scripts on pages.

Each HTML page should load only the scripts it actually needs.

---

# Notes

Any new bug should be added here before debugging begins.

After fixing, move it to Completed.
