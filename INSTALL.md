# Installation Guide

## Fix Tailwind CSS Issue

The project was created with Tailwind CSS but we're using SCSS modules. To fix the error:

### 1. Remove Tailwind Dependencies
```bash
npm uninstall tailwindcss @tailwindcss/postcss postcss autoprefixer
```

### 2. Install Required Dependencies
```bash
npm install axios @reduxjs/toolkit react-redux
```

### 3. Clean Installation
```bash
rm -rf node_modules package-lock.json
npm install
```

## Fix Hydration Warnings

If you see hydration warnings about `bis_skin_checked` attributes:

### Cause
Browser extensions (like ad blockers) modify the DOM before React loads, causing server/client HTML mismatch.

### Solution
The code already includes `suppressHydrationWarning={true}` to handle this issue.

## Dependencies Overview

### Core Dependencies
- **@reduxjs/toolkit**: Redux Toolkit for state management
- **react-redux**: React bindings for Redux
- **axios**: HTTP client for API requests
- **@mui/material**: Material UI components
- **@mui/icons-material**: Material UI icons
- **chart.js**: Chart library
- **react-chartjs-2**: React wrapper for Chart.js
- **sass**: SCSS support

### Development Dependencies
- **@types/chart.js**: TypeScript types for Chart.js
- **typescript**: TypeScript compiler
- **eslint**: Code linting

## What Changed

1. **Removed RTK Query**: No more `@reduxjs/toolkit/query/react`
2. **Added Axios**: Direct HTTP requests with axios
3. **Updated Redux Slice**: Now uses async thunks instead of RTK Query
4. **Simplified Store**: No more RTK Query middleware
5. **Removed Tailwind**: Using SCSS modules instead
6. **Fixed Hydration**: Added suppressHydrationWarning for browser extensions

## Architecture Benefits

- **Simpler**: No complex RTK Query setup
- **Flexible**: Direct control over HTTP requests
- **Lightweight**: Fewer dependencies
- **Standard**: Uses common axios patterns
- **Clean**: No Tailwind CSS conflicts
- **Stable**: Handles browser extension interference

## After Installation

Run the development server:
```bash
npm run dev
```

The application will now use axios for API calls and Redux Toolkit slices for state management.
