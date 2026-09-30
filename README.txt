カニギター Three.js 3D Viewer
============================

この版には、FBX本体と Albedo テクスチャを同梱済みです。
FBX内部には制作時PCの絶対パスが残っていますが、Three.js側で
KA23_KanisanBurst_Albedo.png をローカルPNGへ自動的に差し替えるようにしています。

■ 起動方法
index.html を直接ダブルクリックするのではなく、ローカルWebサーバー経由で開いてください。

Pythonが入っている場合：
  1. このフォルダでターミナルを開く
  2. python -m http.server 8000
  3. ブラウザで http://localhost:8000 を開く

VS Codeを使う場合：
  Live Server拡張でもOKです。

■ 操作
左ドラッグ : 回転
ホイール   : ズーム
右ドラッグ : 平行移動

■ ファイル
models/CrabGuitarKA23_High.fbx
textures/KA23_KanisanBurst_Albedo.png

■ 補足
次の段階では、FBXをGLBへ変換するとWeb公開用としてさらに扱いやすくなります。
GLBならモデル・マテリアル・テクスチャを1ファイルにまとめやすく、読み込みもシンプルになります。
