export function capitalize(input: string): string {
  return input.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase());
}
