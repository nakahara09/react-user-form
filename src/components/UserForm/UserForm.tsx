// src/components/UserForm/UserForm.tsx
// 入力フォーム本体

import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import "./UserForm.css";
import type { FormState, FormErrors } from "./types";
import { toHalfWidthDigits } from "./utils";
import { isJpName, isKana, isDigits } from "./validators";

// --------------------------------------------------
// ユーザー情報入力フォーム
// - 名前（漢字/ひらがな/カタカナ）
// - フリガナ（カタカナ）
// - 性別（ラジオボタン）
// - 年齢（半角数字のみ）
// 入力チェックとエラーメッセージ表示を実装
// --------------------------------------------------
export default function UserForm() {
  // 入力フォームの状態
  const [form, setForm] = useState<FormState>({
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
    gender: "",
    age: ""
  });

  // バリデーションエラーの状態（各フィールドごとに保持）
  const [errors, setErrors] = useState<FormErrors>({});

  // --------------------------------------------
  // 入力値変更時の処理
  // - フィールドごとにバリデーションを実行
  // - エラー時は errors にメッセージをセット
  // --------------------------------------------
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    // number input の場合、空文字を許容
    // → 将来 number 型のフィールドを増やした場合も安全
    if (type === "number" && value === "") {
      setForm((s) => ({ ...s, [name]: "" }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      return;
    }

    // 姓・名：記号・数字NG（日本語の氏名を想定）
    if (name === "lastName" || name === "firstName") {
      if (value !== "" && !isJpName(value)) {
        setErrors((prev) => ({ ...prev, [name]: "記号・数字は使用できません" }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }

    // カナ：全角カタカナ以外NG
    if (name === "lastNameKana" || name === "firstNameKana") {
      if (value !== "" && !isKana(value)) {
        setErrors((prev) => ({ ...prev, [name]: "カタカナで入力してください" }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }

    // 年齢：全角数字を半角に変換 → 半角数字以外はエラー
    if (name === "age") {
      const half = toHalfWidthDigits(value);
      if (half !== "" && !isDigits(half)) {
        setErrors((prev) => ({ ...prev, age: "半角数字以外は使用できません" }));
      } else {
        setErrors((prev) => ({ ...prev, age: undefined }));
      }
      setForm((s) => ({ ...s, age: half }));
      return; // 年齢はここで終了（他の処理に流れない）
    }

    // その他の入力（そのまま反映）
    setForm((s) => ({ ...s, [name]: value }));
  };

  // --------------------------------------------
  // フォーム送信時
  // - 全フィールドが入力済みかつエラーなしなら完了
  // --------------------------------------------
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    // エラーの有無
    const hasErrors =
      !!errors.lastName ||
      !!errors.firstName ||
      !!errors.lastNameKana ||
      !!errors.firstNameKana ||
      !!errors.age;

    // 必須項目がすべて入力済みかどうか
    const allFilled =
      form.lastName &&
      form.firstName &&
      form.lastNameKana &&
      form.firstNameKana &&
      form.gender &&
      form.age;

    // バリデーションを通過したら完了
    if (!hasErrors && allFilled) {
      window.alert("complete");
    }
  };

  // --------------------------------------------
  // ボタン活性条件
  // - 必須項目が未入力、またはエラーがある場合は無効化
  // --------------------------------------------
  const hasErrors =
    !!errors.lastName ||
    !!errors.firstName ||
    !!errors.lastNameKana ||
    !!errors.firstNameKana ||
    !!errors.age;

  const allFilled =
    form.lastName &&
    form.firstName &&
    form.lastNameKana &&
    form.firstNameKana &&
    form.gender &&
    form.age;

  const isNextDisabled = !allFilled || hasErrors;

  // --------------------------------------------
  // JSX: 入力フォームのUI
  // - 名前、カナ、性別、年齢を入力
  // - エラーメッセージはリアルタイム表示
  // - アクセシビリティ対応（aria-invalid / aria-describedby）
  // --------------------------------------------
  return (
    <div className="form-page">
      <div className="form-page__center">
        <div className="form">
          <h1 className="form__title">あなたの情報を入力してください</h1>

          <form className="form__content" onSubmit={onSubmit} noValidate>
            {/* ------------------ 名前入力 ------------------ */}
            <section className="form__section">
              <div className="form__section-title">名前</div>

              {/* 姓 */}
              <div className="form__field">
                <label className="form__label" htmlFor="lastName">
                  姓 <span className="form__required">必須</span>
                </label>
                <input
                  id="lastName"
                  className={`form__input ${errors.lastName ? "form__input--error" : ""}`}
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={onChange}
                  autoComplete="family-name"
                  required
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? "lastName-error" : undefined}
                />
                {errors.lastName && (
                  <p id="lastName-error" className="form__error" aria-live="polite">
                    {errors.lastName}
                  </p>
                )}
              </div>

              {/* 名 */}
              <div className="form__field">
                <label className="form__label" htmlFor="firstName">
                  名 <span className="form__required">必須</span>
                </label>
                <input
                  id="firstName"
                  className={`form__input ${errors.firstName ? "form__input--error" : ""}`}
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={onChange}
                  autoComplete="given-name"
                  required
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                />
                {errors.firstName && (
                  <p id="firstName-error" className="form__error" aria-live="polite">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* 姓（カタカナ） */}
              <div className="form__field">
                <label className="form__label" htmlFor="lastNameKana">
                  氏（カタカナ） <span className="form__required">必須</span>
                </label>
                <input
                  id="lastNameKana"
                  className={`form__input ${errors.lastNameKana ? "form__input--error" : ""}`}
                  type="text"
                  name="lastNameKana"
                  value={form.lastNameKana}
                  onChange={onChange}
                  required
                  aria-invalid={!!errors.lastNameKana}
                  aria-describedby={errors.lastNameKana ? "lastNameKana-error" : undefined}
                />
                {errors.lastNameKana && (
                  <p id="lastNameKana-error" className="form__error" aria-live="polite">
                    {errors.lastNameKana}
                  </p>
                )}
              </div>

              {/* 名（カタカナ） */}
              <div className="form__field">
                <label className="form__label" htmlFor="firstNameKana">
                  名（カタカナ） <span className="form__required">必須</span>
                </label>
                <input
                  id="firstNameKana"
                  className={`form__input ${errors.firstNameKana ? "form__input--error" : ""}`}
                  type="text"
                  name="firstNameKana"
                  value={form.firstNameKana}
                  onChange={onChange}
                  required
                  aria-invalid={!!errors.firstNameKana}
                  aria-describedby={errors.firstNameKana ? "firstNameKana-error" : undefined}
                />
                {errors.firstNameKana && (
                  <p id="firstNameKana-error" className="form__error" aria-live="polite">
                    {errors.firstNameKana}
                  </p>
                )}
              </div>
            </section>

            {/* ------------------ 年齢・性別入力 ------------------ */}
            <section className="form__section">
              <div className="form__section-title">年齢・性別</div>

              {/* 性別ラジオボタン */}
              <div className="form__field">
                <span className="form__label">
                  性別 <span className="form__required">必須</span>
                </span>

                <label className="form__radio">
                  <input
                    className="form__radio-input"
                    type="radio"
                    name="gender"
                    value="male"
                    checked={form.gender === "male"}
                    onChange={onChange}
                  />
                  <span className="form__radio-text">男性</span>
                </label>

                <label className="form__radio">
                  <input
                    className="form__radio-input"
                    type="radio"
                    name="gender"
                    value="female"
                    checked={form.gender === "female"}
                    onChange={onChange}
                  />
                  <span className="form__radio-text">女性</span>
                </label>

                <label className="form__radio">
                  <input
                    className="form__radio-input"
                    type="radio"
                    name="gender"
                    value="other"
                    checked={form.gender === "other"}
                    onChange={onChange}
                  />
                  <span className="form__radio-text">無回答・その他</span>
                </label>
              </div>

              {/* 年齢 */}
              <div className="form__field">
                <label className="form__label" htmlFor="age">
                  年齢 <span className="form__required">必須</span>
                </label>
                <input
                  id="age"
                  className={`form__input form__input--age ${errors.age ? "form__input--error" : ""}`}
                  type="text"
                  name="age"
                  value={form.age}
                  onChange={onChange}
                  inputMode="numeric"
                  required
                  aria-invalid={!!errors.age}
                  aria-describedby={errors.age ? "age-error" : undefined}
                />
                {errors.age && (
                  <p id="age-error" className="form__error" aria-live="polite">
                    {errors.age}
                  </p>
                )}
              </div>
            </section>

            {/* ------------------ ボタン ------------------ */}
            <div className="form__actions">
              <button
                type="submit"
                className={`form__button form__button--next${isNextDisabled ? " form__button--disabled" : ""}`}
                disabled={isNextDisabled}
              >
                次へ
              </button>
              <button type="button" className="form__button form__button--back">
                戻る
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
