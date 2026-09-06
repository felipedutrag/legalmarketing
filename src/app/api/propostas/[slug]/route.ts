import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const TEMPLATES_DIR = join(process.cwd(), 'data', 'propostas', 'templates')
const LIVE_PATH = join(process.env.VERCEL ? '/tmp' : process.cwd(), 'data', 'propostas_live.json')

function loadLive(): Record<string, unknown> {
  if (!existsSync(LIVE_PATH)) return {}
  return JSON.parse(readFileSync(LIVE_PATH, 'utf-8'))
}

function aplicarEdicoes(html: string, edicoes: Record<string, string>): string {
  for (const [field, value] of Object.entries(edicoes)) {
    if (field === 'updated_at') continue
    const regex = new RegExp(`(<[^>]+data-live=["']${field}["'][^>]*>)([^<]*)(</`, 'g')
    html = html.replace(regex, (_, open: string, _old: string, close: string) => `${open}${value}${close}`)
  }
  return html
}

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params
  const templatePath = join(TEMPLATES_DIR, `${slug}.html`)

  if (!existsSync(templatePath)) {
    return new Response('Página não encontrada', { status: 404 })
  }

  let html = readFileSync(templatePath, 'utf-8')
  const live = loadLive() as Record<string, Record<string, string>>
  if (live[slug]) {
    html = aplicarEdicoes(html, live[slug])
  }

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}
