# 環境設定
①ツールインストール
```
$ npm install
```

②electron立ち上げ
```
$ npm run electron
```

# デプロイメモ
・package.jsonの以下の項目を変更する
```
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject",
  "electron": "concurrently \"npm:start\" \"wait-on http://localhost:3000 && electron ./public\""
},
```
を下に変更
```
"scripts": {
    "start": "electron-forge start",
    "build": "react-scripts build",
    "package": "electron-forge package",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "electron": "concurrently \"npm:start\" \"wait-on http://localhost:3000 && electron ./public\"",
    "dist": "electron-builder",
    "postinstall": "electron-rebuild",
    "make": "electron-forge make",
    "publish": "electron-forge publish"
  },
```

・index.jsに以下のコードを追加
```
const {updateElectronApp} = require('update-electron-app');
updateElectronApp()
```

・その後、以下の手順でGithubにreleaseする
```
$ npm run build
$ npm run publish
```


