export const createId = (prefix = 'blk') => {
  if (crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID().replaceAll('-', '').slice(0, 16)}`
  }

  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 10)}`
}
