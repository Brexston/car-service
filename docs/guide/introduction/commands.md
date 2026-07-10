# Доступные команды

В разделе `scripts` файла `package.json` находятся основные команды для разработки, сборки и деплоя проекта. Ниже
приведены их описания и примеры использования.

```json [package.json]
{
	"scripts": {
		"dev": "vite",
		"watch": "vite build --watch",
		"build": "time npm run lint && vite build",
		"build-initial": "npm run lint && vite build -m initial",
		"deploy-layout": "dotenv -- sh -c 'time npm run lint && vite build -m deploy && time rsync -az --delete --progress dist/ html.xpager.ru@html.xpager.ru:/srv/www/html.xpager.ru/htdocs/public/$VITE_APP_NAME'",
		"lint": "eslint --fix && vue-tsc -b && stylelint . --fix",
		"lint:ci": "eslint && vue-tsc -b && stylelint .",
		"hooks:install": "sh ./config/install-git-hooks.sh",
		"docs:dev": "vitepress dev docs",
		"docs:build": "vitepress build docs",
		"docs:deploy": "dotenv -- sh -c 'time vitepress build -m deploy docs && time rsync -az --delete --progress docs/.vitepress/dist/ html.xpager.ru@html.xpager.ru:/srv/www/html.xpager.ru/htdocs/public/$VITE_APP_DOCS_NAME'",
		"postinstall": "npm run hooks:install"
	}
}
```

## Разработка

```sh
npm run dev
```

Запускает локальный dev-сервер с горячей перезагрузкой. Используется для разработки проекта в реальном времени.

## Сборка

```sh
npm run watch
```
Собирает проект без линтинга и запускает режим отслеживания изменений в исходных файлах.  
Используется для разработки проекта на этапе программирования фронтенда и бэкенда.

___

```sh
npm run build
```
Выполняет полную сборку проекта:
- сначала запускается линтинг кода (`eslint`, `vue-tsc`, `stylelint`);
- затем проект собирается через Vite.

___

```sh
npm run build-initial
```

Вариант сборки проекта с HTML-файлами, из которых бэкендеры будут брать разметку для своих шаблонов.

## Деплой

```sh
npm run deploy-layout
```

Автоматизирует выгрузку скомпилированной вёрстки на сервер `html.xpager.ru`.

Выполняет следующие действия:
- Загружает переменные окружения из `.env`;
- Запускает линтинг и сборку;
- Загружает содержимое папки `dist` на сервер по `rsync`, в директорию, соответствующую переменной
`VITE_APP_NAME`.

:::warning ВАЖНО
Убедись, что переменная `VITE_APP_NAME` определена в `.env`, иначе путь для выгрузки будет некорректным.
:::

## Проверка качества кода

```sh
npm run lint
```

Запускает сразу три проверки:
- `eslint` с автоисправлением ошибок;
- `vue-tsc` (TypeScript-проверка компонентов Vue без генерации файлов);
- `stylelint` для проверки стилей с автоисправлением.

```sh
npm run lint:ci
```

Запускает те же проверки без автоисправления. Подходит для CI и финальной проверки перед отправкой изменений.

## Git hooks

```sh
npm run hooks:install
```

Подключает локальные git hooks из `config/githooks` через `core.hooksPath`.
Обычно команда запускается автоматически после `npm install`.

Pre-commit hook запускает `npm run build`, если в staged-изменениях есть файлы проекта.
Когда фронтенд лежит внутри общего репозитория, hook проверяет только файлы внутри своей папки.

## Документация ([VitePress](https://vitepress.dev/))

```sh
npm run docs:dev
```
Запускает dev-сервер для локальной разработки документации (docs/).

___

```sh
npm run docs:build
```
Собирает статическую версию документации.

___

```sh
npm run docs:deploy
```
Выгружает документацию на `html.xpager.ru`.
