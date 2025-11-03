// src/components/UserForm/utils.ts
// 入力フォームのスタイル

// 全角数字（０-９）を半角数字（0-9）に変換
export const toHalfWidthDigits = (s: string) =>
  s.replace(/[０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
