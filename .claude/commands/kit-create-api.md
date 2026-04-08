---
name: kit-create-api
description: "Use when creating API routes, Supabase queries, or server-side logic. Contains route patterns, error handling, auth checks, and response typing."
---

# Create API — Server-Side Patterns

## API Route Template

All API routes follow this structure:

```typescript
// src/app/api/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // 1. Auth check (if protected)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse query params
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')

    // 3. Business logic
    let query = supabase.from('ideas').select('*')
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    const { data, error } = await query
      .order('score', { ascending: false })
      .range((page - 1) * 20, page * 20 - 1)

    if (error) throw error

    // 4. Return typed response
    return NextResponse.json({ data })
  } catch (error) {
    console.error('[API] resource GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse body
    const body = await request.json()

    // Validate with Zod (for external inputs)
    // const parsed = SomeSchema.safeParse(body)
    // if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 })

    // Business logic...

    return NextResponse.json({ data: result }, { status: 201 })
  } catch (error) {
    console.error('[API] resource POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## Response Format

All API responses use consistent structure:

```typescript
// Success
{ data: T }
{ data: T, meta: { page: number, total: number } }

// Error
{ error: string }
{ error: string, details?: unknown }
```

## Supabase Query Patterns

```typescript
// Select with filter
const { data, error } = await supabase
  .from('ideas')
  .select('*')
  .eq('category', 'devtools')
  .order('score', { ascending: false })
  .limit(20)

// Insert
const { data, error } = await supabase
  .from('ideas')
  .insert(ideas)
  .select()

// Upsert (for subscriptions — one per user)
const { data, error } = await supabase
  .from('subscriptions')
  .upsert({ user_id: user.id, categories, is_active: true })
  .select()
  .single()

// Update by token (no auth — for unsubscribe)
const { data, error } = await supabase
  .from('subscriptions')
  .update({ is_active: false })
  .eq('unsubscribe_token', token)
  .select()
  .single()
```

## Public vs Protected Routes

- **Protected** (require auth): `/api/ideas/*`, `/api/subscribe/*`, `/api/email/*`
- **Public** (no auth): `/api/unsubscribe/[token]`

For public routes, skip the auth check but validate the token/input thoroughly.

## Environment Variables in Routes

```typescript
// Server-only — safe to use in API routes
const apiKey = process.env.ANTHROPIC_API_KEY!
const resendKey = process.env.RESEND_API_KEY!

// NEVER use NEXT_PUBLIC_ vars for secrets
```
