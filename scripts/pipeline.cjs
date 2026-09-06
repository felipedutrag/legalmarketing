require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');

const CIDADE = process.argv[2] || process.env.CIDADE || 'praia grande'

const SCRAPER = path.join(__dirname, 'scrapers/scraper_advogado.cjs');
const GENERATOR = path.join(__dirname, 'generators/gerar_landing.cjs');

function rodar(script, nome) {
  console.log(`\n=== ${nome} ===`);
  try {
    execSync(`node "${script}" "${CIDADE}"`, { stdio: 'inherit', cwd: path.join(__dirname, '../..') });
  } catch {
    console.error(`ERRO no ${nome}. Abortando.`);
    process.exit(1);
  }
}

console.log(`🚀 INICIANDO PIPELINE PARA ${CIDADE.toUpperCase()}\n`);
rodar(SCRAPER, 'SCRAPER (Google Maps → leads.json)');
rodar(GENERATOR, 'GERADOR (Gemini → landing pages)');

console.log('\n=== GIT PUSH (deploy automático) ===');
try {
  execSync('git add -A', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  execSync('git commit -m "pipeline: leads + landing pages"', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  execSync('git push origin main', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
} catch {
  console.log('Git push finalizado (ou nada novo)');
}

console.log('\n✅ PIPELINE FINALIZADO');
console.log(`📁 Templates em: data/propostas/templates/`);