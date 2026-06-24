# Restoration Notes

## Recommended Restoration Route

Use Git rather than keeping the old theme inside live code.

```bash
git checkout eedfae7 -- src/app/globals.css src/components src/app
```

Then inspect the diff and selectively keep any post-overhaul functionality that should remain.

## CSS Snapshot

The file `css-or-theme-snapshot.css` contains the pre-overhaul `src/app/globals.css`.

To restore only the old CSS:

```bash
cp docs/archive/current-pe-labs-aesthetic/css-or-theme-snapshot.css src/app/globals.css
```

Run:

```bash
npm run check
```

## Caution

Do not restore old styling by leaving parallel theme systems in live CSS. Use one active design system at a time.
