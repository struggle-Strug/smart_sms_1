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

      const doc = new PDFDocument({
          margins: {
              top: 50,
              bottom: 50,
              left: 50,
              right: 50,
          },
      });
      const filePath = path.join(app.getPath('desktop'), `${fileName}.pdf`);

      const fontPath = path.join(__dirname, 'assets', 'fonts', 'NotoSansJP-VariableFont_wght.ttf');
      doc.font(fontPath);

      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      const pageWidth = doc.page.width - doc.options.margins.left - doc.options.margins.right;
      const tableTop = 100;
      const cellHeight = 20;

      const columnWidths = header.map(() => pageWidth / header.length);

      // タイトル
      doc.fontSize(16).text('支払明細表', { align: 'center' });
      doc.moveDown(1);

      // ヘッダー描画
      drawRow(doc, tableTop, header, columnWidths);
      drawLine(doc, tableTop + cellHeight);

      // データ描画
      let position = tableTop + cellHeight;
      data.forEach((row) => {
          if (position + cellHeight > doc.page.height - doc.options.margins.bottom) {
              doc.addPage(); // 改ページ
              position = tableTop;
              drawRow(doc, position, header, columnWidths); // ヘッダーを再描画
              drawLine(doc, position + cellHeight);
              position += cellHeight;
          }
          drawRow(doc, position, row, columnWidths);
          position += cellHeight;
          drawLine(doc, position);
      });

      doc.end();

      writeStream.on('finish', () => {
          event.reply('export-success', 'デスクトップフォルダにPDFをダウンロードしました。');
      });
  } catch (error) {
      console.error('Failed to export to PDF:', error);
      event.reply('export-failure', 'Failed to export to PDF');
  }
});

function drawRow(doc, y, row, columnWidths) {
  let x = doc.options.margins.left; // 左の余白から開始
  row.forEach((text, i) => {
      doc.fontSize(8).text(String(text), x + 5, y + 5, {
          width: columnWidths[i] - 10, // 列幅に収める
          align: 'left',
          lineBreak: false, // 改行を無効化
          ellipsis: true,   // 切り捨てる場合に省略記号を付ける
      });
      x += columnWidths[i];
  });
}

function drawLine(doc, y) {
  const startX = doc.options.margins.left;
  const endX = doc.page.width - doc.options.margins.right;
  doc.moveTo(startX, y).lineTo(endX, y).stroke();
}
