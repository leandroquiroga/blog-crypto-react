const DEFAULT_NEWS_IMAGE_PATTERN = /images\.cryptocompare\.com\/news\/default\//i;

/**
 * CryptoCompare devuelve el logo de la fuente como imagen por defecto.
 * La UI prefiere no mostrar esas imagenes genericas.
 */
export function isDefaultNewsImage(url: string | null | undefined): boolean {
  if (!url) return true;

  return DEFAULT_NEWS_IMAGE_PATTERN.test(url);
}
