export function createSlugFromText(text: string, addRandomByte = true): string {
  const slugText = text
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s_-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/_+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

  if (!addRandomByte) {
    return slugText;
  }

  const randomByDate = new Date().getTime().toString(36);
  return `${slugText}-${randomByDate}`;
}

export function createSlugFromEmail(email: string): string {
  const username = email.split('@')[0];
  return createSlugFromText(username);
}
