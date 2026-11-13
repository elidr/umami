# Elida customizations

This fork of [umami-software/umami](https://github.com/umami-software/umami) carries a few branding changes on top of upstream. This file lists every one of them so they can be checked, and re-applied if needed, after pulling in a new Umami release.

Upstream base when these were made: **v3.5.0** (commit `b18d514`).

## Customized files at a glance

| Change | Commit | Files |
| --- | --- | --- |
| Brand logo | `70f3812` | `src/components/common/BrandLogo.tsx` (new), `src/app/login/LoginForm.tsx`, `src/app/(main)/SideNav.tsx`, `src/app/(main)/MobileNav.tsx` |
| Favicon | `d6f11fe` | `public/favicon.ico`, `public/favicon-16x16.png`, `public/favicon-32x32.png`, `public/apple-touch-icon.png`, `public/android-chrome-192x192.png`, `public/android-chrome-512x512.png`, `public/mstile-150x150.png` |
| Primary color `#CF4737` | `cf78684` | `src/app/global.css` |
| This guide | | `CUSTOMIZATIONS.md` |

## How to update from upstream

1. On GitHub, open the fork and click **Sync fork**, then **Update branch**. If GitHub reports a conflict, use the command line instead:
   ```bash
   git remote add upstream https://github.com/umami-software/umami.git   # first time only
   git fetch upstream
   git merge upstream/master
   ```
2. If a merge conflict appears in one of the files above, keep upstream's version of the file and then re-apply the change using the steps below. This is usually easier than untangling the conflict line by line.
3. Run through the **Checklist after an update** at the bottom.
4. Push to `master`. Vercel deploys automatically to analytics.elida.io.

A handy way to see exactly what this fork changes compared to upstream at any time:
```bash
git diff upstream/master -- src/app/global.css src/app/login src/app/\(main\)/SideNav.tsx src/app/\(main\)/MobileNav.tsx src/components/common/BrandLogo.tsx public/
```

## 1. Brand logo

Replaces the Umami icon and the word "umami" on the login page and in the top left of the dashboard (desktop side nav and mobile header).

**New file** `src/components/common/BrandLogo.tsx`:
```tsx
// Custom brand logo shown on the login page and in the navigation.
// Replace BRAND_LOGO_URL to change it.
export const BRAND_LOGO_URL = 'https://offer.elida.io/assets/68a8d877843fc017edd29b28_logo.svg';

export function BrandLogo({ height = 24 }: { height?: number }) {
  return (
    <img
      src={BRAND_LOGO_URL}
      alt="Logo"
      style={{ height, width: 'auto', maxWidth: '100%', display: 'block' }}
    />
  );
}
```

**`src/app/login/LoginForm.tsx`**
- Import: replace `import { Logo } from '@/components/svg';` with `import { BrandLogo } from '@/components/common/BrandLogo';`
- Replace the logo and heading:
  ```tsx
  <Icon size="lg">
    <Logo />
  </Icon>
  <Heading>umami</Heading>
  ```
  with
  ```tsx
  <BrandLogo height={48} />
  ```
- Remove `Heading` and `Icon` from the `@umami/react-zen` import if nothing else uses them.

**`src/app/(main)/SideNav.tsx`**
- Import: replace `import { Logo } from '@/components/svg';` with `import { BrandLogo } from '@/components/common/BrandLogo';`
- Replace
  ```tsx
  <IconLabel icon={<Logo />}>
    <Text weight="bold">umami</Text>
  </IconLabel>
  ```
  with
  ```tsx
  <BrandLogo height={24} />
  ```
- Remove `Text` from the `@umami/react-zen` import if nothing else uses it.

**`src/app/(main)/MobileNav.tsx`**
- Same import swap as above.
- Replace
  ```tsx
  <IconLabel icon={<Logo />} style={{ width: 'auto' }}>
    <Text weight="bold">umami</Text>
  </IconLabel>
  ```
  with
  ```tsx
  <BrandLogo height={24} />
  ```
- Remove `Text` from the `@umami/react-zen` import if nothing else uses it.

If upstream has moved or renamed these components, search for the old logo instead: `grep -rn "<Logo" src/`.

## 2. Favicon

The icons in `public/` are generated from the elida.design favicon (a 32×32 PNG). An upstream update may overwrite them with the Umami icons. Restore them from this fork's history:
```bash
git checkout d6f11fe -- public/favicon.ico public/favicon-16x16.png public/favicon-32x32.png public/apple-touch-icon.png public/android-chrome-192x192.png public/android-chrome-512x512.png public/mstile-150x150.png
```

To regenerate them from a new source image (`favicon.png`), with Python and Pillow:
```python
from PIL import Image
src = Image.open('favicon.png').convert('RGBA')
sizes = {
    'favicon-16x16.png': 16, 'favicon-32x32.png': 32,
    'apple-touch-icon.png': 180, 'android-chrome-192x192.png': 192,
    'android-chrome-512x512.png': 512, 'mstile-150x150.png': 150,
}
for name, s in sizes.items():
    src.resize((s, s), Image.LANCZOS).save(f'public/{name}')
src.save('public/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
```

## 3. Primary color `#CF4737`

Primary buttons, links and selected states use the brand red instead of Umami's blue.

**`src/app/global.css`**, inside the `:root` block:
```css
--zen-primary: oklch(62.3% 0.214 259.815);
```
becomes
```css
--zen-primary: #cf4737;
```
`--zen-primary-fg` (the text on primary buttons) stays white.

Not changed on purpose: the chart colors in `src/lib/constants.ts` (`THEME_COLORS`, primary `#2680eb`), so charts still use Umami's blue.

## Settings outside the code

These live in Vercel, Spaceship and Webflow, so an upstream update does not touch them. Listed here for reference only.

- **Vercel project** `umami` in the "Elida projects" team, deploying from `master`.
  - Env vars: `DATABASE_URL` (from the Neon store `neon-red-paddle`), `APP_SECRET`.
  - Domains: `analytics.elida.io` (main) and `umami-ashy-ten-75.vercel.app`.
- **DNS (Spaceship)** for `analytics.elida.io`: a CNAME to Vercel, plus a `_vercel` TXT verification record.
- **Tracking snippets** on the Webflow sites point at `https://analytics.elida.io/script.js` (careers may still use the vercel.app URL, which works too).

## Checklist after an update

- [ ] Login page shows the Elida logo, not the Umami icon and "umami" text.
- [ ] Dashboard top left shows the Elida logo (check desktop and mobile widths).
- [ ] Browser tab shows the Elida favicon (hard refresh).
- [ ] Primary buttons (for example "Log in" and "Add website") are `#CF4737`.
- [ ] Vercel deploy succeeded and https://analytics.elida.io loads.
- [ ] Database migrations ran (the Vercel build log shows them). Your data and websites are still there.
