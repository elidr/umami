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
