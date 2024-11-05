const fs = require('fs');
const path = require('path');
const { app, ipcMain } = require('electron');
const PDFDocument = require('pdfkit');
// const puppeteer = require('puppeteer-core');
const puppeteer = require('puppeteer');

// ipcMain.handle('generate-pdf', async (event, invoiceData) => {
//   const doc = new PDFDocument({ margin: 50 });
//   const filePath = path.join(app.getPath('desktop'), '請求書.pdf');
  
//   const fontPath = path.join(__dirname, 'assets', 'fonts', 'NotoSansJP-VariableFont_wght.ttf');
//   doc.font(fontPath);

//   doc.pipe(fs.createWriteStream(filePath));

//   // タイトル
//   doc.fontSize(20).text('請求書', { align: 'center' });
//   doc.moveDown(1.5);

//   // 左側 請求先情報
//   doc.fontSize(12).text(`請求先`, { continued: true });
//   doc.fontSize(12).text(`株式会社A`, { align: 'left' });
//   doc.text(`〒100-0001`, { align: 'left' });
//   doc.text(`東京都千代田区千代田1-1 サンプルビル1F`, { align: 'left' });
//   doc.moveDown();

//   // 右側 請求書情報
//   doc.fontSize(12).text(`請求番号: ${invoiceData.invoiceNumber}`, { align: 'right' });
//   doc.text(`発行日: ${invoiceData.issueDate}`, { align: 'right' });
//   doc.text(`お支払期限: ${invoiceData.dueDate}`, { align: 'right' });
//   doc.moveDown(2);

//   // 納品先A セクション
//   doc.fontSize(14).text(`納品先A`, { underline: true });
//   doc.moveDown(1);

//   // テーブル ヘッダー
//   doc.fontSize(10);
//   const tableTop = doc.y;
//   const columnWidths = [80, 80, 100, 60, 80, 80, 60];
//   ["日付", "伝票番号", "商品名", "数量", "単価", "金額", "税率"].forEach((text, i) => {
//     doc.text(text, 50 + columnWidths.slice(0, i).reduce((acc, w) => acc + w, 0), tableTop, { width: columnWidths[i], align: 'center' });
//   });
//   doc.moveDown();

//   // 商品行データ
//   let currentY = doc.y;
//   invoiceData.itemsA.forEach((item) => {
//     [item.date, item.invoiceNumber, item.productName, item.quantity, `¥${item.unitPrice}`, `¥${item.amount}`, `${item.taxRate}%`].forEach((text, i) => {
//       doc.text(text, 50 + columnWidths.slice(0, i).reduce((acc, w) => acc + w, 0), currentY, { width: columnWidths[i], align: 'center' });
//     });
//     currentY += 20;
//   });

//   // 小計A
//   doc.moveTo(50, currentY + 10).lineTo(550, currentY + 10).stroke(); // 線を追加
//   doc.fontSize(12).text(`小計: ¥${invoiceData.subtotalA}`, 400, currentY + 20, { align: 'right' });
//   doc.moveDown(2);

//   // 納品先Bセクション
//   doc.fontSize(14).text(`納品先B`, { underline: true });
//   doc.moveDown(1);

//   // テーブル ヘッダー
// //   doc.fontSize(10);
//   currentY = doc.y;
//   ["日付", "伝票番号", "商品名", "数量", "単価", "金額", "税率"].forEach((text, i) => {
//     doc.text(text, 50 + columnWidths.slice(0, i).reduce((acc, w) => acc + w, 0), currentY, { width: columnWidths[i], align: 'center' });
//   });
//   doc.moveDown();

//   // 商品行データ for B
//   currentY = doc.y;
//   invoiceData.itemsB.forEach((item) => {
//     [item.date, item.invoiceNumber, item.productName, item.quantity, `¥${item.unitPrice}`, `¥${item.amount}`, `${item.taxRate}%`].forEach((text, i) => {
//       doc.text(text, 50 + columnWidths.slice(0, i).reduce((acc, w) => acc + w, 0), currentY, { width: columnWidths[i], align: 'center' });
//     });
//     currentY += 20;
//   });

//   // 小計B
//   doc.moveTo(50, currentY + 10).lineTo(550, currentY + 10).stroke(); // 線を追加
//   doc.fontSize(12).text(`小計: ¥${invoiceData.subtotalB}`, 400, currentY + 20, { align: 'right' });
//   doc.moveDown(2);

//   // 合計金額 (税金、税込合計)
//   doc.fontSize(12);
//   doc.text(`税抜合計: ¥${invoiceData.taxExcludedTotal}`, { align: 'right' });
//   doc.text(`消費税(8%): ¥${invoiceData.tax8}`, { align: 'right' });
//   doc.text(`消費税(10%): ¥${invoiceData.tax10}`, { align: 'right' });
//   doc.text(`税込合計: ¥${invoiceData.taxIncludedTotal}`, { align: 'right', bold: true });
  
//   doc.end();

//   return filePath;
// });

// ipcMain.handle('generate-pdf', async (event, htmlContent) => {
//     const browser = await puppeteer.launch({
//       executablePath: require('electron').app.getPath('exe'),
//       args: ['--no-sandbox', '--disable-setuid-sandbox'],
//     });
  
//     const page = await browser.newPage();
  
//     // 動的に渡されたHTMLを設定
//     await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
//     // PDFを生成し、指定したパスに保存
//     const pdfPath = path.join(__dirname, 'invoice.pdf');
//     await page.pdf({
//       path: pdfPath,
//       format: 'A4',
//       printBackground: true,
//     });
  
//     await browser.close();
//     return pdfPath;
//   });


  ipcMain.handle('generate-pdf', async (event, htmlContent) => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  
    const page = await browser.newPage();
  
    // 動的に渡されたHTMLを設定
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
    // PDFを生成し、指定したパスに保存
    const pdfPath = path.join(app.getPath('desktop'), '請求書.pdf');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
    });
  
    await browser.close();
    return pdfPath;
  });
