const SLACK_TOKEN   = PropertiesService.getScriptProperties().getProperty("slackToken")

function assign(members) {
  // ( 0 以上 1 未満の小数 ) * 配列の数 を 切り捨ての整数化
  // これによってランダムな配列 index を得る
  const randomIndex = Math.floor(Math.random() * members.length);
  return members[randomIndex]
}

function post2slack(channelId, threadTimestamps, assigneeId){
    const res = UrlFetchApp.fetch(
      'https://slack.com/api/chat.postMessage',
      {
        'method': 'POST',
        'payload': {
          token: SLACK_TOKEN,
          channel: channelId,
          thread_ts: threadTimestamps,
          text: `<@${assigneeId}> お前に任せた`,
        }
      }
    )

    console.log(res.getContentText())
}