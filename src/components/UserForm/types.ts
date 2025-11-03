// src/components/UserForm/types.ts
// 入力フォームのスタイル

// フォームの入力値を保持する型
export type FormState = {
  lastName: string;       // 姓
  firstName: string;      // 名
  lastNameKana: string;   // 姓（カタカナ）
  firstNameKana: string;  // 名（カタカナ）
  gender: "" | "male" | "female" | "other"; // 性別
  age: string;            // 年齢（数値だが文字列で保持）
};

// フォームのバリデーションエラーを保持する型
export type FormErrors = {
  lastName?: string;
  firstName?: string;
  lastNameKana?: string;
  firstNameKana?: string;
  age?: string;
};
