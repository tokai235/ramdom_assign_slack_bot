# ランダムアサイン slack bot
## インストール
1. `main.gs` と `utils.gs` を1つの Google Apps Script として登録
1. アサインしたいメンバーの情報を入力 (後述)
1. Google Apps Script をウェブアプリとしてデプロイ
    - このときに発行される Webhook URL は後で使用する
1. slack app を作成して bot token (`slackToken`) を取得
    - see: https://qiita.com/hiren/items/c8ffa3f9de58b80ba5da
    - この時必要な Bot Token Scopes は以下
        - `app_mentions:read` (メンションの取得)
        - `channels:read` (メンションを返すチャンネルの取得)
        - `chat:write` (bot として post する)
1. Google Apps Script のスクリプト プロパティに `slackToken` を登録
1. Event Subscriptions で Enable Events を ON に切り替え
    - see: https://qiita.com/hiren/items/ccc8f5b37bb3187b9d86
1. Request URL に Google Apps Script の Webhook URL を指定する
    - この時検証で Google Apps Script の Webhook URL にリクエストが飛んでくるので、このときだけは `doPost` 内をコメントアウトして通す
    - 一度検証が通ったら URL が変わらない限りはコメントインして OK
    - URL を変えずにデプロイするには「新しいデプロイ」ではなく「デプロイの管理 / 編集」からデプロイする
1. Subscribe to bot events に `app_mension` を追加する
1. 使いたいチャンネルに アプリを追加する

## メンバーの指定方法
### 1. MEMBER_NAMES にハードコーディングする
- 一番楽
- メンバー変更のたびにデプロイが必要
- チャンネルごとにアサインメンバーを変える、みたいなのはできない

### 2. スプレッドシートを作成する
- メンバー変更してもデプロイ不要
- チャンネルごとにアサインメンバーを変えられる
- スプレッドシートのフォーマットは以下
  - シート名は bot にメンションする slack チャンネル (`#channel` の形で書く)
  - A1 にヘッダー、A2 以降下にリストアップ

| member_name |
| -- |
| A |
| B |

### 3. slack ID を指定する
- メンションの形でリプライできる
- slack ID はセンシティブな情報なので、ID を Google Apps Script のスクリプト プロパティに登録した上で呼び出すのがおすすめ
- `makeReplyText` の第2引数を `true` にすればリプライの形になる

## 使い方
- bot にリプライを飛ばす
- とメンバーリストの中からランダムでアサインしてリプライしてくれる

## デバッグ
- slack からのテストだとGoogle Apps Script でログが見れずツライ
- なので `debugPost` で slack の `app_mension` レスポンスをスタブしている
- これを使えば slack API からリクエストを受け取った後のテストができる