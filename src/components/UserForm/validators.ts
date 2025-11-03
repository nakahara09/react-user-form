// src/components/UserForm/validators.ts
// 入力値のバリデーション関数群

// 姓名用：数字・記号を禁止
export const isJpName = (v: string) =>
  /^[^\d!-/:-@[-`{-~]+$/.test(v);

// カタカナ用：全角カタカナ・長音・中黒・全角スペースのみ許可
export const isKana = (v: string) =>
  /^[ァ-ヴー\u3000･・]+$/.test(v);

// 年齢用：半角数字のみ許可
export const isDigits = (v: string) =>
  /^[0-9]+$/.test(v);
