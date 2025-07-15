# Tab Filtering Tests

This directory contains tests for the tab filtering functionality.

## Running Tests

```bash
node tests/test-filter.js
```

## Test Coverage

- Single special character filtering (only searches titles)
- Multiple character patterns  
- Regular text filtering (searches both titles and URLs)
- Regex escaping for special characters
- Empty input handling

## Background

These tests were created to address filtering issues with special regex characters, particularly when users type "." expecting to find tabs with titles starting with dots, rather than matching every tab (since most URLs contain dots).