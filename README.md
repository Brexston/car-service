# Car Service

Офлайн PWA-приложение для ведения истории обслуживания личных автомобилей.

## Возможности

- Учёт нескольких автомобилей
- Быстрое добавление записей (масло, фильтр, ремонт, другое)
- Напоминания о замене масла
- Экспорт и импорт данных в JSON
- Полностью офлайн после установки

## Стек

- Vue 3, Vite, TypeScript
- Pinia, Vue Router
- Dexie (IndexedDB)
- UnoCSS
- vite-plugin-pwa
- Lucide Icons

## Разработка

```bash
npm install --engine-strict=false
npm run dev
```

## Сборка

```bash
npm run build:ci
```

Результат в папке `dist/`.

## GitHub Pages

URL: https://brexston.github.io/car-service/

1. В репозитории откройте **Settings → Pages**
2. В **Build and deployment → Source** выберите **GitHub Actions**
3. Push в `main` запускает workflow `.github/workflows/deploy.yml`

Повторный деплой вручную: **Actions → Deploy to GitHub Pages → Run workflow**
