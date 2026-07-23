# Optimus UI Locale

i18n and l7n locales for the components of [Optimus UI](https://www.openng.org/), vendored from the community supported [PrimeLocale](https://github.com/primefaces/primelocale) repository.

## Installation

```bash
npm install @openng/optimus-ui-locale
```

## Usage

Import a locale from its subpath and pass it to the Optimus UI configuration:

```ts
import { de } from '@openng/optimus-ui-locale/js/de.js';

provideOptimus({
    translation: de
});
```

Or import the aggregate `all` export, which contains every locale keyed by language code (e.g. `all.de`):

```ts
import { all } from '@openng/optimus-ui-locale';

provideOptimus({
    translation: all.de
});
```

Or import the raw JSON for a single locale — note that each JSON file wraps its messages under the language-code key, so the messages are at `de.de`, not `de`:

```ts
import de from '@openng/optimus-ui-locale/de.json';

provideOptimus({
    translation: de.de
});
```

The package ships ESM modules (`js/`), CommonJS modules (`cjs/`), and the raw `*.json` files.

## Contributing

Translations are maintained upstream in the [PrimeLocale](https://github.com/primefaces/primelocale) repository — please contribute new languages and fixes there.

## License

MIT — based on [PrimeLocale](https://github.com/primefaces/primelocale) by PrimeTek Informatics.
