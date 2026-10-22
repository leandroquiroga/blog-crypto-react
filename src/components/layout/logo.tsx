import { Link } from 'react-router';
import { paths } from '@/router/paths';

export function Logo() {
  return (
    <Link
      to={paths.home}
      className="flex items-center gap-2 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      aria-label="Blog Crypto, ir al inicio"
    >
      <img src="/assets/svg/icon-title.svg" alt="" width={32} height={32} className="size-8" />
      <span className="text-brand-gradient font-display text-lg font-semibold">Blog Crypto</span>
    </Link>
  );
}
