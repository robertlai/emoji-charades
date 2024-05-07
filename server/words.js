const words = ["discord"];

export function getWord() {
  return words[Math.floor(Math.random() * words.length)];
}
