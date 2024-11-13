// const bcrypt = require('bcrypt');
// const { ipcMain } = require('electron');
// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('./db.sqlite');  // SQLiteのデータベースファイル
// const path = require('path');

// ipcMain.on('login-request', (event, admin) => {
//   const { user_name, password } = admin;

//   // ユーザー名でデータベースからユーザー情報を取得
//   db.get('SELECT * FROM users WHERE user_name = ?', [user_name], (err, row) => {
//     if (err) {
//       console.error('Database error:', err);
//       event.reply('login-response', { success: false, message: 'データベースエラーが発生しました' });
//       return;
//     }

//     if (!row) {
//       // ユーザー名が見つからなかった場合
//       event.reply('login-response', { success: false, message: 'ユーザー名またはパスワードが間違っています' });
//       return;
//     }

//     // 入力されたパスワードとデータベースのパスワードを直接比較
//     if (password === row.password) {
//       // パスワードが一致した場合
//       event.reply('login-response', { success: true });
//     } else {
//       // パスワードが一致しない場合
//       event.reply('login-response', { success: false, message: 'ユーザー名またはパスワードが間違っています' });
//     }
//   });
// });