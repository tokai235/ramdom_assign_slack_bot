const SLACK_TOKEN   = PropertiesService.getScriptProperties().getProperty("slackToken")
const SPREADSHEET_ID  = "xxx"

function getChannelNameFromId(channelId) {
  let res = UrlFetchApp.fetch(
    'https://slack.com/api/conversations.info',
    {
      'method': 'POST',
      'payload': {
        token: SLACK_TOKEN,
        channel: channelId,
      }
    }
  )

  res = JSON.parse(res.getContentText())
  console.log({res})

  // slack チャンネルの一般的な表記である #channel の形で返す
  return `#${res.channel.name}`
}

function getMembersFromSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
  const sheet = spreadsheet.getSheetByName(sheetName)

 // チャンネル名でシートが見つからなかったら、 [] を返す
  if (sheet == null) return []

  // getRange は (行、列、行数、列数)
  // A列にメンバーのリストがある前提
  // A1 はヘッダー前提なので飛ばす
  const rows = sheet
    .getRange(2, 1, sheet.getMaxRows(), 1)
    .getValues()

  // 1次元配列にして空文字を排除
  const members = rows
    .flat()
    .filter(Boolean)

  console.log(members)

  return members
}

function assign(members) {
  // ( 0 以上 1 未満の小数 ) * 配列の数 を 切り捨ての整数化
  // これによってランダムな配列 index を得る
  const randomIndex = Math.floor(Math.random() * members.length);
  return members[randomIndex]
}

function makeReplyText(assignee, isId = false) {
  return !!isId
    ? `<@${assignee}> お前に任せた`
    : `${assignee} お前に任せた`
}

function post2slack(channelId, threadTimestamps, text){
    const res = UrlFetchApp.fetch(
      'https://slack.com/api/chat.postMessage',
      {
        'method': 'POST',
        'payload': {
          token: SLACK_TOKEN,
          channel: channelId,
          thread_ts: threadTimestamps,
          text: text,
        }
      }
    )

    console.log(res.getContentText())
}

function postErrorNotice2slack(channelId, threadTimestamps){
    const res = UrlFetchApp.fetch(
      'https://slack.com/api/chat.postMessage',
      {
        'method': 'POST',
        'payload': {
          token: SLACK_TOKEN,
          channel: channelId,
          thread_ts: threadTimestamps,
          text: `アサインするメンバーが見つからないぞ。スプレッドシートにチャンネル名とメンバーを追加しろ`,
        }
      }
    )

    console.log(res.getContentText())
}