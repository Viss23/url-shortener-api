function randomString(length: number, chars: string): string {
  let result = '';
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export function generateShort() {
  return randomString(
    6,
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  );
}
