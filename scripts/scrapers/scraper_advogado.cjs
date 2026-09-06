const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const CIDADE = (process.argv[2] || process.env.CIDADE || 'santos')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]+/g, '')
    .trim()
    .replace(/\s+/g, '+')
    .toLowerCase();

function gerarSlug(nome) {
    return nome
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
}

function montarMensagem(slug) {
    return `Olá! Encontrei o perfil do seu escritório no Google Meu Negócio e desenvolvemos uma demonstração sob medida para vocês.

Criamos uma Landing Page interativa com sistema de qualificação de leads por Inteligência Artificial em tempo real — o visitante escolhe a área e a IA faz a triagem inicial antes de mandar para o seu WhatsApp.

Você pode visualizar o preview funcional aqui:
https://www.legalmarketing.club/propostas/${slug}`;
}

async function scrapeAndClean() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: ['--start-maximized']
    });
    const page = await browser.newPage();

    console.log(`--- INICIANDO SCRAPER DE ADVOGADOS (${CIDADE}) ---`);
    const url = `https://www.google.com/maps/search/advogados+em+${CIDADE}`;
    await page.goto(url, { waitUntil: 'networkidle2' });

    const sidePanelSelector = 'div[role="feed"]';
    await page.waitForSelector(sidePanelSelector);

    const rawLeads = [];
    const limit = 50;

    let itemIndex = 0;
    let attempts = 0;
    const MAX_ATTEMPTS = 20;

    while (rawLeads.length < limit && attempts < MAX_ATTEMPTS) {
        attempts++;
        try {
            const listItems = await page.$$('.hfpxzc');
            if (itemIndex >= listItems.length) break;

            await listItems[itemIndex].click();
            await new Promise(r => setTimeout(r, 2500));

            const details = await page.evaluate(() => {
                const name = document.querySelector('h1.DUwDvf')?.innerText || 'Desconhecido';
                const phoneBtn = document.querySelector('button[data-tooltip="Copiar número de telefone"]');
                const phone = phoneBtn ? phoneBtn.getAttribute('aria-label') : 'Não encontrado';
                const websiteBtn = document.querySelector('a[data-tooltip="Abrir website"]');
                const website = websiteBtn ? websiteBtn.getAttribute('href') : 'N/A';

                let cleanPhone = (phone || '').replace(/\D/g, '');
                if (cleanPhone && cleanPhone.length <= 11) cleanPhone = '55' + cleanPhone;

                return {
                    nome: name,
                    whatsapp: cleanPhone,
                    website: website
                };
            });

            // Pula leads sem dados válidos (nome "Desconhecido", sem telefone ou sem site)
            // e tenta o próximo item em vez de registrar o lead incompleto.
            const isUnknown = !details.nome || /desconhecid/i.test(details.nome);
            const hasNoPhone = !details.whatsapp || details.whatsapp.length < 12;
            if (isUnknown || hasNoPhone) {
                console.log(`Pulo ${itemIndex + 1} (dados insuficientes): ${details.nome || '(sem nome)'}`);
                itemIndex++;
                continue;
            }

            const slug = gerarSlug(details.nome)
            const linkPersonalizado = `https://www.legalmarketing.club/propostas/${slug}`
            const mensagem = montarMensagem(slug)
            const waLink = details.whatsapp.length >= 10
                ? `https://wa.me/${details.whatsapp}?text=${encodeURIComponent(mensagem)}`
                : 'N/A'

            const lead = {
                ...details,
                link_personalizado: linkPersonalizado,
                wa_link: waLink
            }

            console.log(`[${rawLeads.length + 1}/${limit}] Extraído: ${lead.nome}`);
            rawLeads.push(lead);
            itemIndex++;
        } catch (e) {
            console.error(`Erro no item ${itemIndex}:`, e.message);
            itemIndex++;
        }
    }

    const rootPath = path.join(__dirname, '../../data/advogados_leads.json');

    const dest = rootPath;
    if (!fs.existsSync(path.dirname(dest))) fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, JSON.stringify(rawLeads, null, 2), 'utf8');

    const csvPath = rootPath.replace('.json', '.csv')
    const csvHeader = 'nome,whatsapp,website,link_personalizado,wa_link'
    const csvRows = rawLeads.map(l =>
        `"${l.nome}","${l.whatsapp}","${l.website}","${l.link_personalizado}","${l.wa_link}"`
    )
    fs.writeFileSync(csvPath, [csvHeader, ...csvRows].join('\n'), 'utf8')

    console.log(`\n--- FINALIZADO ---`);
    console.log(`Leads extraídos: ${rawLeads.length}`);
    console.log(`JSON: data/advogados_leads.json`);
    console.log(`CSV:  data/advogados_leads.csv (importar no ManyChat)`);

    await browser.close();
}

scrapeAndClean().catch(err => {
    console.error('ERRO NO SISTEMA:', err);
    process.exit(1);
});