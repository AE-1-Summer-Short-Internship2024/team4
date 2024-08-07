各ファイルの役割
RenderProductList.js→備蓄リストを表示、更新するためのコンポーネント
DisplayHouseholdData.js→ユーザの家族の情報をDBから取得、calculateNeeds.jsで計算した結果をRenderProductList.jsに渡す
calculateNeeds→ユーザの家族の情報を使って、備蓄に必要な量・物を計算する。
流れ
ユーザの家族の情報を受け取る。(DisplayHouseholdData.js)
受け取ったユーザの家族の情報（性別、年齢）などから、必要な備蓄量を計算する（calcucalteNeeds.js)
計算した備蓄量をexportして、ProductList.jsで表示する。(DisplayHouseholdData.jsが渡す)