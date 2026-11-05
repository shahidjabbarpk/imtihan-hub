import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import type { Mcq } from '@/data/types';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const isUrdu = (s: string) => /[؀-ۿ]/.test(s);

/**
 * A printable practice paper (fresh random MCQs) with the answer key on the last page, saved as
 * PDF and handed to the share sheet so it can be printed, kept offline or sent on WhatsApp.
 */
export async function exportPaper(title: string, qs: Mcq[], minutes: number): Promise<void> {
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @page { margin: 26px; }
  body { font-family: Helvetica, Arial, sans-serif; color: #111827; font-size: 12.5px; }
  h1 { font-size: 20px; margin: 0; color: #0B1F5C; }
  .meta { color: #5B6474; margin: 4px 0 16px; }
  .name { border: 1px solid #CBD5E1; border-radius: 6px; padding: 8px 10px; margin-bottom: 16px; }
  .q { margin-bottom: 12px; page-break-inside: avoid; }
  .q b { display: block; margin-bottom: 4px; }
  .ur { direction: rtl; text-align: right; }
  .o { display: inline-block; width: 46%; margin: 2px 0; }
  .key { page-break-before: always; }
  .key span { display: inline-block; width: 18%; margin: 3px 0; }
  .wm { position: fixed; top: 42%; left: -10%; width: 120%; text-align: center; transform: rotate(-30deg);
        font-size: 72px; font-weight: 800; letter-spacing: 6px; color: rgba(29,78,216,0.06); z-index: 0; }
  .foot { position: fixed; bottom: 0; left: 0; right: 0; text-align: center; font-size: 10px; color: #8A94A6; }
  .content { position: relative; z-index: 1; }
  </style></head><body><div class="wm">Imtihan Hub</div><div class="foot">Imtihan Hub – MCQs, Mock Tests, Results &amp; Past Papers</div><div class="content">
  <h1>${esc(title)}</h1>
  <div class="meta">${qs.length} MCQs &nbsp;•&nbsp; ${minutes} minutes &nbsp;•&nbsp; Practice paper (not an official past paper)</div>
  <div class="name">Name: ______________________ &nbsp;&nbsp; Date: __________ &nbsp;&nbsp; Score: ____ / ${qs.length}</div>
  ${qs.map((q, i) => `<div class="q ${isUrdu(q.q) ? 'ur' : ''}"><b>${i + 1}. ${esc(q.q)}</b>${q.o.map((o, j) => `<span class="o">(${'ABCD'[j]}) ${esc(o)}</span>`).join('')}</div>`).join('')}
  <div class="key"><h1>Answer Key</h1><div class="meta">Attempt the paper first, then check.</div>
  ${qs.map((q, i) => `<span>${i + 1}. ${'ABCD'[q.a]}</span>`).join('')}</div>
  </div></body></html>`;
  if (Platform.OS === 'web') {
    await Print.printAsync({ html });
    return;
  }
  const { uri } = await Print.printToFileAsync({ html });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: title, UTI: 'com.adobe.pdf' });
  } else {
    await Print.printAsync({ uri });
  }
}
