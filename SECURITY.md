# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please do NOT open a public issue.

Email: security@codejambo-rentflow.example

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will acknowledge within 48 hours and provide a remediation timeline within 5 business days.

## Supported Versions

Only the `main` branch is supported with security updates.

## Security Controls

This repository enforces:
- Pre-commit secret scanning (gitleaks)
- SAST and dependency scanning in CI
- Branch protection on `main`: 2 approvals required, status checks must pass
