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

Приложение настроено для деплоя на GitHub Pages с базовым путём `/car-service/`.

После push в `main` workflow `.github/workflows/deploy.yml` собирает и публикует приложение.
