// 世帯人数から必要な商品を計算する関数
export const calculateNeeds = (householdData) => {
  // 年代別の人数を計算するためのオブジェクト
  const ageGroups = {
    Infant: 0,
    Child: 0,
    Teen: 0,
    Adult: 0,
    Senior: 0,
  };
  // 性別別の人数を計算するためのオブジェクト
  const genderGroups = {
    male: 0,
    female: 0,
  };
  // 世帯人数の年代別、性別別の人数を計算
  householdData.forEach(member => {
    ageGroups[member.ageCategory]++;
    genderGroups[member.gender]++;
  });

  // ベースURL
  const baseUrl = 'https://search.rakuten.co.jp/search/mall/';

  // 各商品の必要量を計算
  const products = {
    food: [
      { id: 1, name: '水', quantity: `${ageGroups.Adult * 2 + genderGroups.male * 1.5}L`, url: `${baseUrl}水`, purchased: false, expirationDate: '2025-01-01' },
      { id: 2, name: 'レトルトご飯', quantity: `${ageGroups.Adult * 3 + genderGroups.female * 2}食`, url: `${baseUrl}レトルトご飯`, purchased: false, expirationDate: '2024-12-01' },
      { id: 3, name: 'レトルト食品', quantity: '6個', url: `${baseUrl}レトルト食品`, purchased: false, expirationDate: '2025-03-01' },
      { id: 4, name: '缶詰(さばの味噌煮、野菜など)', quantity: '6缶', url: `${baseUrl}缶詰(さばの味噌煮、野菜など)`, purchased: false, expirationDate: '2026-01-01' },
      { id: 5, name: '栄養補助食品', quantity: '6箱', url: `${baseUrl}栄養補助食品`, purchased: false, expirationDate: '2024-11-01' },
      { id: 6, name: '野菜ジュース', quantity: '6本', url: `${baseUrl}野菜ジュース`, purchased: false, expirationDate: '2025-05-01' },
      { id: 7, name: 'チーズ・プロテインバー等', quantity: '2パック', url: `${baseUrl}チーズ・プロテインバー等`, purchased: false, expirationDate: '2024-10-01' },
      { id: 8, name: '健康飲料粉末', quantity: '6袋', url: `${baseUrl}健康飲料粉末`, purchased: false, expirationDate: '2025-02-01' },
      { id: 9, name: '調味料セット', quantity: '適宜', url: `${baseUrl}調味料セット`, purchased: false, expirationDate: '2026-01-01' },
      { id: 10, name: '乾麺 即席麺', quantity: '7パック', url: `${baseUrl}乾麺 即席麺`, purchased: false, expirationDate: '2025-06-01' },
      { id: 11, name: '無洗米', quantity: '3kg', url: `${baseUrl}無洗米`, purchased: false, expirationDate: '2024-09-01' },
      { id: 12, name: '飲み物', quantity: '6本', url: `${baseUrl}飲み物`, purchased: false, expirationDate: '2025-04-01' },
      { id: 13, name: 'お菓子', quantity: '7パック', url: `${baseUrl}お菓子`, purchased: false, expirationDate: '2024-08-01' },
      { id: 14, name: '果物の缶詰', quantity: '7缶', url: `${baseUrl}果物の缶詰`, purchased: false, expirationDate: '2026-01-01' },
      { id: 15, name: '乾物', quantity: '適量', url: `${baseUrl}乾物`, purchased: false, expirationDate: '2025-12-01' },
      { id: 16, name: 'フリーズドライ食品', quantity: '適量', url: `${baseUrl}フリーズドライ食品`, purchased: false, expirationDate: '2025-11-01' },
    ],
    hygiene: [
      { id: 17, name: '除菌ウェットティッシュ', quantity: `${ageGroups.Adult * 10 + genderGroups.female * 5}枚`, url: `${baseUrl}除菌ウェットティッシュ`, purchased: false },
      { id: 18, name: 'アルコールスプレー', quantity: '1本', url: `${baseUrl}アルコールスプレー`, purchased: false },
      { id: 19, name: 'マスク', quantity: '7枚', url: `${baseUrl}マスク`, purchased: false },
      { id: 20, name: '口内洗浄液', quantity: '630ml', url: `${baseUrl}口内洗浄液`, purchased: false },
      { id: 21, name: '救急箱', quantity: '1箱', url: `${baseUrl}救急箱`, purchased: false },
      { id: 22, name: '常備薬', quantity: '1箱', url: `${baseUrl}常備薬`, purchased: false },
      { id: 23, name: '使い捨てコンタクトレンズ', quantity: '1人1か月分', url: `${baseUrl}使い捨てコンタクトレンズ`, purchased: false },
      { id: 24, name: '携帯トイレ・簡易トイレ', quantity: '35回分', url: `${baseUrl}携帯トイレ・簡易トイレ`, purchased: false },
      { id: 25, name: '歯みがき用ウェットティッシュ', quantity: '70枚程度', url: `${baseUrl}歯みがき用ウェットティッシュ`, purchased: false },
      { id: 26, name: 'ウェットボディタオル', quantity: '7枚', url: `${baseUrl}ウェットボディタオル`, purchased: false },
    ],
    daily: [
      { id: 27, name: 'カセットコンロ', quantity: '1台', url: `${baseUrl}カセットコンロ`, purchased: false },
      { id: 28, name: 'カセットボンベ', quantity: `${Math.ceil(ageGroups.Adult * 1.5 + genderGroups.male * 0.5)}本`, url: `${baseUrl}カセットボンベ`, purchased: false },
      { id: 29, name: 'ラップ', quantity: '1本', url: `${baseUrl}ラップ`, purchased: false },
      { id: 30, name: 'ポリ袋', quantity: '1箱', url: `${baseUrl}ポリ袋`, purchased: false },
      { id: 31, name: 'ビニール手袋', quantity: '1箱', url: `${baseUrl}ビニール手袋`, purchased: false },
      { id: 32, name: 'アルミホイル', quantity: '1本', url: `${baseUrl}アルミホイル`, purchased: false },
      { id: 33, name: 'トイレットペーパー', quantity: '3ロール', url: `${baseUrl}トイレットペーパー`, purchased: false },
      { id: 34, name: 'ティッシュペーパー', quantity: '3箱', url: `${baseUrl}ティッシュペーパー`, purchased: false },
      { id: 35, name: '懐中電灯', quantity: '1灯', url: `${baseUrl}懐中電灯`, purchased: false },
      { id: 36, name: '乾電池', quantity: '単1～単4までのセット', url: `${baseUrl}乾電池`, purchased: false },
      { id: 37, name: '点火棒', quantity: '1本', url: `${baseUrl}点火棒`, purchased: false },
      { id: 38, name: '使い捨てカイロ', quantity: '14個', url: `${baseUrl}使い捨てカイロ`, purchased: false },
      { id: 39, name: '携帯電話 充電器', quantity: '携帯台数に合わせて用意', url: `${baseUrl}携帯電話 充電器`, purchased: false },
      { id: 40, name: '布製ガムテープ', quantity: '2巻', url: `${baseUrl}布製ガムテープ`, purchased: false },
      { id: 41, name: '軍手', quantity: '7組', url: `${baseUrl}軍手`, purchased: false },
      { id: 42, name: '新聞紙', quantity: '適宜', url: `${baseUrl}新聞紙`, purchased: false },
      { id: 43, name: '手回し充電式などのラジオ', quantity: '1台', url: `${baseUrl}手回し充電式などのラジオ`, purchased: false },
      { id: 44, name: 'マルチツール', quantity: '1個', url: `${baseUrl}マルチツール`, purchased: false },
      { id: 45, name: '給水袋', quantity: '1袋', url: `${baseUrl}給水袋`, purchased: false },
      { id: 46, name: 'ポータブルストーブ', quantity: '1台', url: `${baseUrl}ポータブルストーブ`, purchased: false },
      { id: 47, name: 'LEDランタン', quantity: '最低3台', url: `${baseUrl}LEDランタン`, purchased: false },
      { id: 48, name: 'ヘッドライト', quantity: '1個', url: `${baseUrl}ヘッドライト`, purchased: false },
      { id: 49, name: 'クーラーボックス', quantity: '1個', url: `${baseUrl}クーラーボックス`, purchased: false },
      { id: 50, name: 'リュックサック', quantity: '1個', url: `${baseUrl}リュックサック`, purchased: false },
    ],
  };

  return products;
};
