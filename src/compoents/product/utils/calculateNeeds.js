export const calculateNeeds = (householdData) => {
  const baseUrl = 'https://search.rakuten.co.jp/search/mall/';

  // 各商品の必要量を初期化
  const initialQuantities = {
    waterQuantity: 0,
    riceQuantity: 0,
    retortFoodQuantity: 0,
    cannedFoodQuantity: 0,
    supplementQuantity: 0,
    vegetableJuiceQuantity: 0,
    cheeseProteinBarQuantity: 0,
    healthDrinkPowderQuantity: 0,
    seasoningSetQuantity: 0,
    dryNoodlesQuantity: 0,
    polishedRiceQuantity: 0,
    drinkQuantity: 0,
    snackQuantity: 0,
    cannedFruitQuantity: 0,
    driedFoodQuantity: 0,
    freezeDriedFoodQuantity: 0,
    wetWipesQuantity: 0,
    masksQuantity: 0,
    mouthwashQuantity: 0,
    contactLensQuantity: 0,
    portableToiletQuantity: 0,
    toothbrushWipesQuantity: 0,
    bodyTowelQuantity: 0,
  };

  // 各年齢グループの倍率
  const ageMultipliers = {
    Infant: 0.5,
    Child: 0.7,
    Teen: 1,
    Adult: 2,
    Senior: 1.5,
  };

  // 性別による倍率
  const genderMultipliers = {
    male: 1.5,
    female: 1.0,
  };

  // 各人に対して補正を掛ける
  householdData.forEach(member => {
    const ageMultiplier = ageMultipliers[member.ageCategory];
    const genderMultiplier = genderMultipliers[member.gender];

    for (let key in initialQuantities) {
      switch (key) {
        case 'waterQuantity':
        case 'riceQuantity':
        case 'retortFoodQuantity':
        case 'supplementQuantity':
        case 'vegetableJuiceQuantity':
        case 'dryNoodlesQuantity':
        case 'drinkQuantity':
        case 'snackQuantity':
          initialQuantities[key] += 2 * ageMultiplier * genderMultiplier;
          break;
        case 'cannedFoodQuantity':
          initialQuantities[key] += 1.5 * ageMultiplier * genderMultiplier;
          break;
        case 'cheeseProteinBarQuantity':
        case 'cannedFruitQuantity':
          initialQuantities[key] += 1 * ageMultiplier * genderMultiplier;
          break;
        case 'healthDrinkPowderQuantity':
        case 'toothbrushWipesQuantity':
        case 'bodyTowelQuantity':
        case 'masksQuantity':
        case 'contactLensQuantity':
          initialQuantities[key] += 1 * ageMultiplier * genderMultiplier;
          break;
        case 'seasoningSetQuantity':
        case 'driedFoodQuantity':
        case 'freezeDriedFoodQuantity':
          initialQuantities[key] += 0.2 * ageMultiplier * genderMultiplier;
          break;
        case 'polishedRiceQuantity':
          initialQuantities[key] += 0.3 * ageMultiplier * genderMultiplier;
          break;
        case 'wetWipesQuantity':
          initialQuantities[key] += 10 * ageMultiplier * genderMultiplier;
          break;
        case 'mouthwashQuantity':
          initialQuantities[key] += 630 * ageMultiplier * genderMultiplier;
          break;
        case 'portableToiletQuantity':
          initialQuantities[key] += 35 * ageMultiplier * genderMultiplier;
          break;
      }
    }
  });

  // 各商品の必要量をベースURLと共に設定
  const products = {
    food: [
      { id: 1, name: '水', quantity: `${Math.round(initialQuantities.waterQuantity)}L`, url: `${baseUrl}水`, purchased: false },
      { id: 2, name: 'レトルトご飯', quantity: `${Math.round(initialQuantities.riceQuantity)}食`, url: `${baseUrl}レトルトご飯`, purchased: false },
      { id: 3, name: 'レトルト食品', quantity: `${Math.round(initialQuantities.retortFoodQuantity)}個`, url: `${baseUrl}レトルト食品`, purchased: false },
      { id: 4, name: '缶詰(さばの味噌煮、野菜など)', quantity: `${Math.round(initialQuantities.cannedFoodQuantity)}缶`, url: `${baseUrl}缶詰(さばの味噌煮、野菜など)`, purchased: false },
      { id: 5, name: '栄養補助食品', quantity: `${Math.round(initialQuantities.supplementQuantity)}箱`, url: `${baseUrl}栄養補助食品`, purchased: false },
      { id: 6, name: '野菜ジュース', quantity: `${Math.round(initialQuantities.vegetableJuiceQuantity)}本`, url: `${baseUrl}野菜ジュース`, purchased: false },
      { id: 7, name: 'チーズ・プロテインバー等', quantity: `${Math.round(initialQuantities.cheeseProteinBarQuantity)}パック`, url: `${baseUrl}チーズ・プロテインバー等`, purchased: false },
      { id: 8, name: '健康飲料粉末', quantity: `${Math.round(initialQuantities.healthDrinkPowderQuantity)}袋`, url: `${baseUrl}健康飲料粉末`, purchased: false },
      { id: 9, name: '調味料セット', quantity: `${Math.round(initialQuantities.seasoningSetQuantity)}セット`, url: `${baseUrl}調味料セット`, purchased: false },
      { id: 10, name: '乾麺 即席麺', quantity: `${Math.round(initialQuantities.dryNoodlesQuantity)}パック`, url: `${baseUrl}乾麺 即席麺`, purchased: false },
      { id: 11, name: '無洗米', quantity: `${Math.round(initialQuantities.polishedRiceQuantity)}kg`, url: `${baseUrl}無洗米`, purchased: false },
      { id: 12, name: '飲み物', quantity: `${Math.round(initialQuantities.drinkQuantity)}本`, url: `${baseUrl}飲み物`, purchased: false },
      { id: 13, name: 'お菓子', quantity: `${Math.round(initialQuantities.snackQuantity)}パック`, url: `${baseUrl}お菓子`, purchased: false },
      { id: 14, name: '果物の缶詰', quantity: `${Math.round(initialQuantities.cannedFruitQuantity)}缶`, url: `${baseUrl}果物の缶詰`, purchased: false },
      { id: 15, name: '乾物', quantity: `${Math.round(initialQuantities.driedFoodQuantity)}kg`, url: `${baseUrl}乾物`, purchased: false },
      { id: 16, name: 'フリーズドライ食品', quantity: `${Math.round(initialQuantities.freezeDriedFoodQuantity)}kg`, url: `${baseUrl}フリーズドライ食品`, purchased: false },
    ],
    hygiene: [
      { id: 17, name: '除菌ウェットティッシュ', quantity: `${Math.round(initialQuantities.wetWipesQuantity)}枚`, url: `${baseUrl}除菌ウェットティッシュ`, purchased: false },
      { id: 18, name: 'アルコールスプレー', quantity: '1本', url: `${baseUrl}アルコールスプレー`, purchased: false },
      { id: 19, name: 'マスク', quantity: `${Math.round(initialQuantities.masksQuantity)}枚`, url: `${baseUrl}マスク`, purchased: false },
      { id: 20, name: '口内洗浄液', quantity: `${Math.round(initialQuantities.mouthwashQuantity)}ml`, url: `${baseUrl}口内洗浄液`, purchased: false },
      { id: 21, name: '救急箱', quantity: '1箱', url: `${baseUrl}救急箱`, purchased: false },
      { id: 22, name: '常備薬', quantity: '1箱', url: `${baseUrl}常備薬`, purchased: false },
      { id: 23, name: '使い捨てコンタクトレンズ', quantity: `${Math.round(initialQuantities.contactLensQuantity)}人1か月分`, url: `${baseUrl}使い捨てコンタクトレンズ`, purchased: false },
      { id: 24, name: '携帯トイレ・簡易トイレ', quantity: `${Math.round(initialQuantities.portableToiletQuantity)}回分`, url: `${baseUrl}携帯トイレ・簡易トイレ`, purchased: false },
      { id: 25, name: '歯みがき用ウェットティッシュ', quantity: `${Math.round(initialQuantities.toothbrushWipesQuantity)}枚`, url: `${baseUrl}歯みがき用ウェットティッシュ`, purchased: false },
      { id: 26, name: 'ウェットボディタオル', quantity: `${Math.round(initialQuantities.bodyTowelQuantity)}枚`, url: `${baseUrl}ウェットボディタオル`, purchased: false },
    ],
    daily: [
      { id: 27, name: 'カセットコンロ', quantity: '1台', url: `${baseUrl}カセットコンロ`, purchased: false },
      { id: 28, name: 'カセットボンベ', quantity: '1セット', url: `${baseUrl}カセットボンベ`, purchased: false },
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

