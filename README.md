# Exam Tayari

Pakistan exam-prep app (Expo 57 / React Native 0.86, expo-router). Package `com.examtayari.mza`.

- `src/data/` – MCQ banks (`mcq-*.ts`, tuple format), boards, tests, universities, scholarships, guides
- `src/lib/session.ts` – builds practice / mock / daily / custom sessions; `src/app/quiz.tsx` runs them
- `npm run check-data` – validates every MCQ and link · `npm run typecheck`
- `npm run icons` – regenerates icons (Python + Pillow)
- `npm run apk` / `npm run aab` – release builds (JDK 17, ANDROID_HOME). Signing: `credentials/keystore.properties`
- **Runs by itself** (public GitHub repo `shahidjabbarpk/imtihan-hub`, Actions enabled):
  - `.github/workflows/news.yml` – every 4 h, `scripts/auto/news.mjs` puts Pakistani exam headlines (results, roll no slips, date sheets, MDCAT, CSS…) into `data/news.json`. No key needed.
  - `.github/workflows/content.yml` – every Monday, `scripts/auto/grow.mjs` adds AI-written MCQs (kept only when a second model agrees on the answer), Urdu translations and 3 model papers to `data/content.json`. Needs repo secret `NVIDIA_API_KEY`; without it only model papers are added.
  - The app downloads `data/content.json` on start (new MCQs, past papers, Urdu, test-pattern overrides) and keeps it offline.
- **Admin panel (no coding):** `docs/admin.html` on GitHub Pages – add MCQs / bulk paste from Excel, past-paper PDFs or solved papers, notices, test-pattern changes. Needs a fine-grained GitHub token (Contents: read & write on this repo).
- **Leaderboard:** Firestore of Firebase project `pakjobs-daily-sj` (collections `imtihan_points`, `imtihan_grand`); rules + tests live in the pakjobs-daily repo (`firebase/`).
- Before release: real AdMob ids in `src/lib/config.ts` + `app.json` (androidAppId)
