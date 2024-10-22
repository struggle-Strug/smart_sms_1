const { app, ipcMain } = require('electron');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const PDFDocument = require('pdfkit');

// CSVエクスポートの処理
ipcMain.on('export-to-csv', (event, dataForSet) => {
    try {
        const { header, data, fileName } = dataForSet;

        // ヘッダーとデータを結合
        const csvData = [header, ...data];

        // CSV形式に変換
        const parser = new Parser({ header: false }); // ヘッダーはすでに含まれているのでfalse
        const csv = parser.parse(csvData);

        const filePath = path.join(app.getPath('desktop'), fileName + '.csv');
        fs.writeFileSync(filePath, csv);

        event.reply('export-success', 'デスクトップフォルダにCSVをダウンロードしました。');
    } catch (error) {
        console.error('Failed to export to CSV:', error);
        event.reply('export-failure', 'Failed to export to CSV');
    }
});

// Excelエクスポートの処理
ipcMain.on('export-to-excel', (event, dataForSet) => {
    try {
        const { header, data, fileName } = dataForSet;

        // ヘッダーとデータを一緒にワークシートに追加する
        const worksheetData = [header, ...data]; // ヘッダーを追加
        const worksheet = xlsx.utils.aoa_to_sheet(worksheetData); // 配列データをシートに変換
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // ファイルの保存
        const filePath = path.join(app.getPath('desktop'), `${fileName}.xlsx`);
        xlsx.writeFile(workbook, filePath);

        // 成功のレスポンスを返す
        event.reply('export-success', 'デスクトップフォルダにEXCELをダウンロードしました。');
    } catch (error) {
        console.error('Failed to export to Excel:', error);
        event.reply('export-failure', 'Failed to export to Excel');
    }
}
)

ipcMain.on('export-to-pdf', (event, dataForSet) => {
    try {
        const { header, data, fileName } = dataForSet;

        // PDFドキュメントを作成
        const doc = new PDFDocument();
        const filePath = path.join(app.getPath('desktop'), `${fileName}.pdf`);

        // フォントファイルのパスを指定（日本語フォントを使用）
        const fontPath = path.join(__dirname, 'assets', 'fonts', 'NotoSansJP-VariableFont_wght.ttf');
        doc.font(fontPath);

        // PDFファイルの書き込みストリームを作成
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // タイトル
        doc.fontSize(16).text('支払明細表', { align: 'center' });
        doc.moveDown(1);

        // テーブルのヘッダー
        const tableTop = 100;
        const cellHeight = 30;

        let columnWidths = [];
        for (let i = 0; i < header.length; i++) {
            columnWidths.push(60)
        }

        // ヘッダーの描画
        drawRow(doc, tableTop, header, columnWidths);
        drawLine(doc, tableTop + cellHeight);

        // データの描画
        let position = tableTop + cellHeight;
        data.forEach((row) => {
            drawRow(doc, position, row, columnWidths);
            position += cellHeight;
            drawLine(doc, position);
        });

        // PDFを閉じる
        doc.end();

        // ファイル保存完了時にイベントを返す
        writeStream.on('finish', () => {
            event.reply('export-success', 'デスクトップフォルダにPDFをダウンロードしました。');
        });
    } catch (error) {
        console.error('Failed to export to PDF:', error);
        event.reply('export-failure', 'Failed to export to PDF');
    }
});

// テーブルの行を描画
function drawRow(doc, y, row, columnWidths) {
    let x = 50; // テーブルの左端の位置
    row.forEach((text, i) => {
        doc.fontSize(10).text(text, x + 5, y + 5, { width: columnWidths[i], align: 'left' });
        x += columnWidths[i];
    });
}

// 横線を描画
function drawLine(doc, y) {
    doc.moveTo(50, y).lineTo(50 + 900, y).stroke();
}