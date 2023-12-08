const MEMBER_NAMES = [
  "user1",
  "user2",
  "user3",
]

// slack ID はセンシティブな情報なので扱いに注意
// Google Apps Script のスクリプト プロパティに登録した上で呼び出すのがおすすめ
// const MEMBER_IDS = [
//   PropertiesService.getScriptProperties().getProperty("slackId_user1"),
// ]

function debugPost(){
  // app_mension のレスポンスダミー
  // https://api.slack.com/events/app_mention
  const params = {
    event: {
      type: "app_mension",
      ts: "",
      channel: "xxx",
    }
  }

  main(params)
}

// webhook の post リクエストに対する処理
// doPost は予約された名前
// ここでは bot に対するメンションを検知している
// see: https://api.slack.com/events/app_mention
function doPost(e) {
  const params = JSON.parse(e.postData.getDataAsString());

  // slack の URL 検証時はコメントアウトする
  main(params)

  // slack webhook にはこの形式で返す必要がある
  // see: https://api.slack.com/events/url_verification
  return ContentService.createTextOutput(params.challenge);
}

function main(params) {
  // ここでバリデーションをしてもいいが、slack app 側で doPost のリクエストを飛ばしてくるアクションは定義されている
  // なので意図しないアクションは飛んでこないはず
  // see: https://api.slack.com/apps/A0530ES1SDV/event-subscriptions?#:~:text=Subscribe%20to%20bot%20events
  console.log({ params })

  // メンションからチャンネル名を特定する
  const channelName = getChannelNameFromId(params.event.channel)

  // スプレッドシートのチャンネル名シートからメンバーリストを取得する
  const members = getMembersFromSheet(channelName)

  if (members.length < 1) {
    postErrorNotice2slack(
      params.event.channel,
      params.event.ts
    )
    return
  }

  // アサインを決める & リプライテキストの作成
  // slack ユーザーにメンションを飛ばす or テキストを出力するだけ
  const assignee = assign(members)
  const replyText = makeReplyText(assignee)

  // ハードコーディングしたメンバーリストからアサインを決める
  // スプシ作るのが面倒な方はこちら
  // const assignee = assign(MEMBER_NAMES)
  // const replyText = makeReplyText(assignee)

  // slack ID を使う場合
  // const assignee = assign(MEMBER_IDS)
  // const replyText = makeReplyText(assignee, true)

  console.log({ assignee, replyText })

  post2slack(
    params.event.channel,
    params.event.ts,
    replyText
  )
}
