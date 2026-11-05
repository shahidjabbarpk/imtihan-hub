// Live notice feed for the app (data/news.json): results announced, roll number slips, date sheets,
// admissions, MDCAT/ECAT/NET, CSS/PPSC, scholarships. Runs every few hours on GitHub Actions and
// needs no key: it reads Google News RSS searches for Pakistani exam news and keeps the relevant,
// recent headlines (with a link to the full story). Items added by hand in the admin panel
// ("manual": true) are always kept.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const OUT = new URL('../../data/news.json', import.meta.url);
const DAYS = 45;
const MAX = 90;

// [search query, tag]
const QUERIES = [
  ['BISE result announced', 'Result'],
  [`matric result ${new Date().getFullYear()} board`, 'Result'],
  ['inter result board Pakistan', 'Result'],
  ['roll number slip board exams Pakistan', 'Roll No Slip'],
  ['date sheet matric inter board Pakistan', 'Date Sheet'],
  ['MDCAT PMDC', 'MDCAT'],
  ['MDCAT result', 'MDCAT'],
  ['ECAT UET', 'ECAT / NET'],
  ['NUST NET admission', 'ECAT / NET'],
  ['university admissions open Pakistan', 'Admission'],
  ['HEC scholarship', 'Scholarship'],
  ['CSS exam FPSC', 'CSS / Jobs'],
  ['PPSC written test result', 'CSS / Jobs'],
  ['NTS test result', 'CSS / Jobs'],
  ['IBCC equivalence', 'Admission'],
  ['new syllabus board Pakistan', 'Syllabus'],
  ['supplementary exams board Pakistan', 'Date Sheet'],
];

// a headline must mention at least one of these to be kept (filters out unrelated news)
const RELEVANT = /\b(bise|board|matric|ssc|hssc|inter(mediate)?|fsc|result|roll ?no|roll number|date ?sheet|mdcat|ecat|net|nust|uet|pmdc|hec|admission|scholarship|css|pms|fpsc|ppsc|spsc|kppsc|bpsc|nts|ets|ibcc|syllabus|exam|test|merit|entry test|university)\b/i;
const NOISE = /\b(cricket|psl|t20|odi|football|stock|kse|dollar rate|gold rate|weather|petrol)\b/i;
// Google mixes in Indian exam news (CBSE, Indian Punjab "PPSC/PCS"...): keep only Pakistani items
const INDIA = /\b(india|indians?|cbse|icse|cisce|jee|neet|upsc|wbssc|wbbse|telangana|tgbie|ts inter|ap inter|andhra|bihar|bseb|up board|upmsp|rajasthan|rbse|karnataka|kerala|tamil|maharashtra|gujarat|haryana|hpbose|jkbose|mp board|mpbse|sarkari|pcs|ssc cgl|cuet|nta|delhi|mumbai|kolkata|chennai|bengaluru|jagran|ndtv|hindustan|times of india|india today|indiatoday|news18|jagranjosh|careers360|shiksha|zee)\b/i;
const PK_WORDS = /\b(pakistan|pakistani|bise|fbise|federal board|lahore|karachi|islamabad|rawalpindi|peshawar|quetta|multan|faisalabad|gujranwala|sargodha|bahawalpur|sahiwal|dg khan|sukkur|larkana|mirpurkhas|mardan|abbottabad|swat|malakand|kohat|bannu|dera ismail khan|ajk|gilgit|sindh|punjab board|kp board|khyber|balochistan|pmdc|mdcat|hec|ecat|nust|uet|giki|pieas|comsats|fpsc|spsc|kppsc|bpsc|ajkpsc|nts|ibcc|css|pms|sukkur iba)\b/i;
const PK_SOURCE = /(dawn|tribune|the news|thenews|geo|ary|samaa|dunya|express|propakistani|urdupoint|ilmkidunya|daily pakistan|dailypakistan|business recorder|brecorder|app\.com\.pk|associated press of pakistan|pakistan today|nation\.com\.pk|the nation|bol news|24 news|hum news|aaj|92 news|radio pakistan|ptv|jang|nawaiwaqt|pakistan observer|pakobserver|eduvision|paperpk|tarbiyah)/i;

/** Better tag from the headline itself; falls back to the tag of the search that found it. */
function tagFor(title, fallback) {
  if (/roll ?no|roll number|admit card/i.test(title)) return 'Roll No Slip';
  if (/date ?sheet|schedule|exams? (begin|start)/i.test(title)) return 'Date Sheet';
  if (/mdcat|pmdc|mbbs|bds/i.test(title)) return 'MDCAT';
  if (/ecat|net|nust|uet|giki|fast/i.test(title)) return 'ECAT / NET';
  if (/css|pms|fpsc|ppsc|spsc|kppsc|bpsc|nts|recruitment/i.test(title)) return 'CSS / Jobs';
  if (/scholarship/i.test(title)) return 'Scholarship';
  if (/result|gazette|position holders/i.test(title)) return 'Result';
  if (/admission/i.test(title)) return 'Admission';
  if (/syllabus|curriculum/i.test(title)) return 'Syllabus';
  return fallback;
}

const decode = (s) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').trim();
const tag = (xml, t) => decode((xml.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)) ?? [])[1] ?? '');
const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

async function search(q) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q + ' when:30d')}&hl=en-PK&gl=PK&ceid=PK:en`;
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ImtihanHubBot/1.0)' } });
  if (!r.ok) throw new Error(`${r.status} for ${q}`);
  const xml = await r.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => {
    const it = m[1];
    const rawTitle = tag(it, 'title');
    const source = tag(it, 'source');
    const title = source && rawTitle.endsWith(` - ${source}`) ? rawTitle.slice(0, -(source.length + 3)) : rawTitle;
    return { title, url: tag(it, 'link'), date: new Date(tag(it, 'pubDate') || Date.now()), source };
  });
}

const old = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : { items: [] };
const manual = (old.items ?? []).filter((i) => i.manual);
const seen = new Set(manual.map((i) => norm(i.title)));
const fresh = [];
const cutoff = Date.now() - DAYS * 86_400_000;
let failures = 0;

for (const [q, t] of QUERIES) {
  try {
    for (const it of await search(q)) {
      if (!it.title || !it.url || it.date.getTime() < cutoff) continue;
      if (!RELEVANT.test(it.title) || NOISE.test(it.title)) continue;
      if (INDIA.test(`${it.title} ${it.source}`) || !(PK_WORDS.test(it.title) || PK_SOURCE.test(it.source))) continue;
      const k = norm(it.title);
      if (seen.has(k)) continue;
      seen.add(k);
      fresh.push({
        id: createHash('sha1').update(it.url).digest('hex').slice(0, 12),
        title: it.title.slice(0, 160),
        body: it.source ? `Source: ${it.source}` : undefined,
        url: it.url,
        date: it.date.toISOString().slice(0, 10),
        tag: tagFor(it.title, t),
      });
    }
  } catch (e) {
    failures++;
    console.warn('search failed:', String(e));
  }
  await new Promise((r) => setTimeout(r, 800));
}

if (failures === QUERIES.length) {
  console.error('every search failed - keeping the old feed');
  process.exit(0);
}

// keep the previous automatic items that are still recent, so a quiet day does not empty the feed
for (const i of old.items ?? []) {
  if (i.manual || seen.has(norm(i.title)) || Date.parse(i.date) < cutoff) continue;
  if (INDIA.test(`${i.title} ${i.body ?? ''}`)) continue;
  seen.add(norm(i.title));
  fresh.push(i);
}

const items = [...manual, ...fresh.sort((a, b) => b.date.localeCompare(a.date))].slice(0, MAX);
writeFileSync(OUT, JSON.stringify({ updatedAt: new Date().toISOString(), items }, null, 1) + '\n');
console.log(`news.json: ${items.length} items (${manual.length} manual), ${failures} failed searches`);
