

export function urlFriendlyName(word: string) {
  if (!word) return word;
  word = word.replace(/[^a-z0-9]/gi, "-").toLowerCase();
  word.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  return word;
}
