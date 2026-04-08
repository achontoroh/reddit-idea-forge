---
description: "Run at the START of every Linear ticket implementation. Logs the initial prompt, context, and ticket reference to PROMPTS.md for the task deliverable."
---

# Log Prompt — Task Documentation

## When to use
Run this skill BEFORE starting any implementation task from Linear. It logs your prompt to `PROMPTS.md` which is a required deliverable.

## Workflow

### 1. At the START of a task, append an entry to `PROMPTS.md`:

```markdown
---

### Prompt N: [Short descriptive title]
**Ticket:** IF-XX
**Context:** [What phase, what you're trying to achieve]
**Prompt:**
\```
[Paste the actual prompt you give to Claude Code]
\```
**Result:** [TO BE FILLED after completion]
```

### 2. At the END of the task, update the **Result** field:

Go back to the entry and fill in:
- What was generated (files created, components built)
- Any notable decisions or iterations
- Whether the task was completed successfully

### 3. Numbering
- Find the last prompt number in PROMPTS.md
- Increment by 1
- Keep sequential, don't skip numbers

## What makes a good prompt log entry
- **Context** should explain WHY you're doing this, not just WHAT
- **Prompt** should be the actual text you sent (abbreviated if very long)
- **Result** should mention specific files created and key decisions made

## Example

```markdown
### Prompt 3: Auth Implementation
**Ticket:** IF-18
**Context:** Phase 2 Foundation — implementing user registration, login, and logout with Supabase Auth. Need protected routes and session management.
**Prompt:**
\```
Implement auth flow for the app. Follow CLAUDE.md architecture. 
Create register page at /auth/register, login at /auth/login. 
Use Supabase Auth with email+password. Add middleware for 
protected routes that redirects to /auth/login. After successful 
auth, redirect to /dashboard.
\```
**Result:** Created 6 files: login/page.tsx, register/page.tsx, middleware.ts, 
lib/supabase/client.ts, lib/supabase/server.ts, lib/supabase/middleware.ts. 
Used @supabase/ssr for App Router integration. Auth flow works end-to-end.
```

## Important
- You MUST have at least 5 entries by the end of the project
- The task says 5-10 prompts — aim for 8-10 for a stronger submission
- Not every prompt needs logging — log the significant ones (new features, complex debugging, key decisions)
