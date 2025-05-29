function createForm() {

  // プログラム1 スプレッドシートとシートオブジェクトを取得
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('フォーム作成');

  // シートを更新
  SpreadsheetApp.flush();

  // プログラム2 フォームを作成し、シートオブジェクトの名前を付与
  const formTitle = sheet.getRange('B2').getDisplayValue();
  const newForm = FormApp.create(formTitle);

  // プログラム3 フォームを25-リーダーMtg議事録＞席配置・出席簿＞全体Mtg出席簿に移動、回答用URLを取得
  const folderId = "***REMOVED***"
  let folder = DriveApp.getFolderById(folderId);
  let file = DriveApp.getFileById(newForm.getId())
  file.moveTo(folder);
  var tmp = newForm.getPublishedUrl();

  // プログラム4 説明文を付加し、シートオブジェクトを付与
  const formDescription = sheet.getRange('B3').getDisplayValue();
  newForm.setDescription(formDescription);

  // プログラム5 氏名回答欄を付加し、シートオブジェクトを付与  
  const formQ1 = sheet.getRange('A4').getDisplayValue();
  const formQ1help = sheet.getRange('B4').getDisplayValue();
  newForm.addTextItem().setRequired(true).
    setTitle(formQ1).
    setHelpText(formQ1help);

  // プログラム6 感想回答欄を付加し、シートオブジェクトを付与  
  const formQ2 = sheet.getRange('A5').getDisplayValue();
  const formQ2help = sheet.getRange('B5').getDisplayValue();
  newForm.addParagraphTextItem().setRequired(true).
    setTitle(formQ2).
    setHelpText(formQ2help);


  // プログラム10(2022/7/17追加)　次回の出席方法を問うプルダウンを追加し、シートオブジェクトを付与(後付けで雑だからいずれ直したいね) 
  const formQ3 = sheet.getRange('A10').getDisplayValue();
  const choose1 = sheet.getRange('E10').getDisplayValue();
  const choose2 = sheet.getRange('E11').getDisplayValue();
  const choose3 = sheet.getRange('E12').getDisplayValue();
  // const choose4 = sheet.getRange('E13').getDisplayValue(); //春研修期間のみ
  newForm.addMultipleChoiceItem().setRequired(true).
    setTitle(formQ3).
    setChoiceValues([choose1, choose2, choose3])

  /*
    // プログラム11(2023/03/24追加)　次回の出席方法に備考がある場合に記入する短文回答を追加し、シートオブジェクトを付与
    const formQ3 = sheet.getRange('A6').getDisplayValue();
    const formQ3help = sheet.getRange('B6').getDisplayValue();
    newForm.addTextItem().
      setTitle(formQ3).
      setHelpText(formQ3help); 
  */

  // プログラム1031(2024/10/30追加) ハロウィン用の質問
  newForm.addMultipleChoiceItem()
    .setTitle('トリック オア トリート')
    .setChoiceValues(['トリック', 'トリート'])
    .showOtherOption(true);

  // プログラム7 回答後コメントを付加し、シートオブジェクトを付与 
  const formlastmessage = sheet.getRange('B7').getDisplayValue();
  newForm.setConfirmationMessage(formlastmessage);

  // プログラム8 作成完了メッセージをポップアップ
  var htmlOutput = HtmlService
    .createHtmlOutput(tmp)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setWidth(450)
    .setHeight(200);
  SpreadsheetApp.getUi().showModelessDialog(htmlOutput, '出来たリンクをSlackに送信したよ');

  //プログラム9｜出力した議事録をkoala君がSlackで共有　(共通)
  var message = formTitle + "\n ※全員回答です" + "\n" + tmp;
  var jsonData =
  {
    "username": "全体Mtg出席確認Bot",
    "icon_emoji": ":koala:",
    "text": message
  };
  var payload = JSON.stringify(jsonData);
  var options =
  {
    "method": "post",
    "contentType": "application/json",
    "payload": payload
  };

  UrlFetchApp.fetch("***REMOVED***", options);
  //  色々いじってたら動かなくなったのでweb hookのurlを再生成しました(2024/10/30)
  //Copyright © 2022 Koki Nagao. All Rights Reserved.
}