import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

const DB_PATH = join(process.env.VERCEL ? '/tmp' : process.cwd(), 'data', 'propostas_live.json')

function load(): Record<string, Record<string, string>> {
  if (!existsSync(DB_PATH)) return {}
  return JSON.parse(readFileSync(DB_PATH, 'utf-8'))
}

function save(data: Record<string, Record<string, string>>) {
  const dir = dirname(DB_PATH)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const db = load()
  return new Response(JSON.stringify(db[params.slug] || {}), { headers: { 'Content-Type': 'application/json' } })
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const body = await request.json() as { updates?: Record<string, string> } & Record<string, string>
    const db = load()
    if (!db[params.slug]) db[params.slug] = {}
    Object.assign(db[params.slug], body.updates || body)
    db[params.slug].updated_at = new Date().toISOString()
    save(db)
    return new Response(JSON.stringify({ status: 'ok', slug: params.slug, data: db[params.slug] }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }
}
