export function urlDataMasking(url: string) {
  const regex = /(\?|&)secret=[^&\s]+/g;
  const subst = '$1secret={secret}';
  return url.replace(regex, subst);
}
