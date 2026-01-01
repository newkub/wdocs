---
title: Installation
description: Learn how to install and set up the WDocs system in your project.
icon: mdi:download
cover: https://via.placeholder.com/800x200
---

# Installation

Follow these steps to install the project.

This guide will walk you through the process of installing WDocs using your favorite package manager.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **Bun**: Version 1.x or higher (recommended)

## Installation Steps

Choose one of the following package managers to install WDocs.

### Using Bun

```bash
bun add wdocs
```

### Using npm

```bash
npm install wdocs
```

### Using pnpm

```bash
pnpm add wdocs
```

## Configuration

After installation, you'll need to create a `wdocs.config.ts` file in your project root. Here is a basic configuration to get you started:

| Option      | Type     | Description                          |
| :---------- | :------- | :----------------------------------- |
| `title`     | `string` | The title of your documentation site.|
| `description` | `string` | A short description for SEO purposes.|

> **Note:** For a full list of configuration options, please refer to the [Configuration Guide](/guide/configuration).
