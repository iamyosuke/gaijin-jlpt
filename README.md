# 実装する必要のあるタスク

1. **フラッシュカードでのイメージ表示**
   - フラッシュカードに関連するイメージを表示できるようにする。

2. **有料サブスクライブ機能の追加**
   - Stripeを使用して有料サブスクリプション機能を実装する。

3. **ユーザーダッシュボードの作成**
   - ユーザーが連続学習記録、フラッシュカードの進捗、学習した単語数を確認できるダッシュボードを作成する。

4. **AIを使った単語のバッチ処理追加**
   - AIを活用して単語を自動的にバッチ処理で追加する機能を実装する。

5. **多国語対応**
   - アプリケーションを多国語対応にする。

6. **学習完了画面**
   - レベルの単語を学習し終えたら学習完了画面を作成する。

7. **復習機能**
   - 学習した単語を復習できる機能を実装する。

## その他の考慮すべき機能

- **ユーザーインターフェースの改善**
  - ユーザーエクスペリエンスを向上させるためのUI/UXの改善。

- **パフォーマンスの最適化**
  - アプリケーションのパフォーマンスを向上させるための最適化。

- **セキュリティの強化**
  - ユーザーデータの保護を強化するためのセキュリティ対策。

追加を検討できる画面
単語詳細画面（/words/:id）

レベル画面で学習中の単語をタップすると詳細情報を表示
例文、発音、メモ追加、カスタムタグなど
単語リスト画面（/words）

学習した単語を一覧で確認・検索できる
フィルター（未学習 / 復習が必要 / よく間違える単語 など）
復習モード画面（/review）

復習が必要な単語だけをまとめて学習できるモード
SRS（Spaced Repetition System）に基づいた単語の出題
ランキング・競争機能（/leaderboard）

他のユーザーと学習量やstreakを比較できる
友達と競える要素を追加（オプション）
プロフィール編集画面（/profile）

アイコン、名前、学習目標（1日◯単語など）の設定
通知設定（リマインダーなど）
設定画面（/settings）

テーマ（ダークモード）、言語（UIの言語）、通知、アカウント削除など
統計・分析画面（/stats）

日/週/月ごとの学習時間、覚えた単語数、間違えた回数などを可視化
「この単語をよく間違えています」などのフィードバック
オプションで考えられる機能
オフラインモード対応（電波がない場所でも学習可能）
音声認識機能（発音チェック）
カスタム単語帳作成（自分専用の単語リストを作れる）