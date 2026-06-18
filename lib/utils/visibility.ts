export function visibilityLabel(value: 'private' | 'public') {
  return value === 'public' ? '访客可见' : '仅 WY 和 YYH 可见';
}

export function filterPublicItems<T extends { visibility: 'private' | 'public' }>(items: T[]) {
  return items.filter((item) => item.visibility === 'public');
}
