const MEMBER_SLACK_IDS = [
  "user1",
  "user2",
  "user3",
]

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
  console.log(params)

  // アサインを決める
  const assigneeId = assign(MEMBER_SLACK_IDS)
  console.log({ assigneeId })

  post2slack(
    params.event.channel,
    params.event.ts,
    assigneeId
  )
}
