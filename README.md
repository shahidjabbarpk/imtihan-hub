# Imtihan Hub

Pakistan exam-prep app (Expo 57 / React Native 0.86, expo-router). Package `com.imtihanhub.mza`.

- `src/data/` – MCQ banks (`mcq-*.ts`, tuple format), boards, tests, universities, scholarships, guides
- `src/lib/session.ts` – builds practice / mock / daily / custom sessions; `src/app/quiz.tsx` runs them
- `npm run check-data` – validates every MCQ and link · `npm run typecheck`
- `npm run icons` – regenerates icons (Python + Pillow)
- `npm run apk` / `npm run aab` – release builds (JDK 17, ANDROID_HOME). Signing: `credentials/keystore.properties`
- Live notices: edit `data/news.json` (`{ items: [{ id, title, date, tag?, body?, url? }] }`) in the public GitHub repo
- Before release: real AdMob ids in `src/lib/config.ts` + `app.json` (androidAppId)
