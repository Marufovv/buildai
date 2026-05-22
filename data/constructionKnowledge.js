export const constructionKnowledge = {
  sourceFolder: "/Users/good/Downloads/buildai_premium_orange_white/public",
  documents: [
    {
      id: "shnk-1-03-02-04",
      code: "SHNK 1.03.02-04",
      title: "Shaharsozlik hujjatlarini ishlab chiqish, kelishish va tasdiqlash tartibi",
      type: "gradostroitelnyye_normy",
      localFile: "ШНК 1.03.02-04 И≠бваг™ж®п Ѓ бЃбв†Ґ•, ѓЃап§™• а†Іа†°Ѓв™®, бЃ£Ђ†бЃҐ†≠®п ® гвҐ•а¶§•≠®п £а†§ЃбваЃ®в•Ђм≠Ѓ© §Ѓ™гђ•≠в†ж®® Ѓ ѓЂ†≠®аЃҐ†≠®® а†ІҐ®в®п ® І†бваЃ©™® в•аа®вЃа®®.doc",
      extracted: true,
      usefulFor: ["project_documents", "approval_flow", "urban_planning", "technical_economic_indicators"],
      notes: [
        "Buyurtmachi boshlang‘ich ma’lumotlarning ishonchliligi uchun javobgar.",
        "Loyiha tashkiloti tegishli litsenziyaga ega bo‘lishi kerak.",
        "Bosh rejalar, batafsil rejalashtirish, qurilish loyihasi va texnik-iqtisodiy ko‘rsatkichlar tarkibi bor."
      ]
    },
    {
      id: "shnk-2-03-05-13",
      code: "SHNK 2.03.05-13",
      title: "Po‘lat konstruksiyalar bo‘yicha konstruktiv normativ",
      type: "kmk_shnk",
      localFile: "ШНК 2.03.05-13_агб_ѓ•з†вм 2014.doc",
      extracted: true,
      usefulFor: ["structural_design", "metal_structures", "load_calculation"],
      notes: [
        "Katta hajmli konstruktiv hisoblar uchun ishlatiladi.",
        "AI yakuniy konstruktiv loyiha bermaydi; konstruktor hisob-kitobi shart."
      ]
    },
    {
      id: "shnk-2-07-01-23",
      code: "SHNK 2.07.01-23 / 2.07.01-03 amendments",
      title: "Aholi punktlari hududlarini rivojlantirish va qurishni shaharsozlik jihatidan rejalashtirish",
      type: "gradostroitelnyye_normy",
      localFile: "01_2-20-сон 20.05.2024. ШНҚ 2.07.01-23 «Аҳоли пунктларининг ҳудудларини ривожлантириш ва қуришни шаҳарсозлик жиҳатидан режалаштириш» шаҳарсозлик н.pdf",
      extracted: "partial",
      lexUrl: "https://lex.uz/pdffile/7050611",
      usefulFor: ["site_planning", "building_distance", "parking_norms", "urban_limits"],
      notes: [
        "Ko‘p qavatli turar joy binolari orasidagi masofa bino balandligi va fasad turiga qarab hisoblanadi.",
        "Avtoturargoh normalari obyekt turi va hududga qarab ajratiladi.",
        "Toshkent shahri va Toshkent viloyatidagi ko‘p qavatli uylar uchun avtoturargoh normasi alohida ko‘rsatilgan."
      ]
    },
    {
      id: "shnk-2-03-10-24",
      code: "SHNK 2.03.10-24",
      title: "Tomlar va tomqoplamalari",
      type: "kmk_shnk",
      localFile: "01_2-2-сон 10.01.2025. ШНҚ 2.03.10-24 «Томлар ва томқопламалари» шаҳарсозликнормалари ва қоидаларини тасдиқлаш тўғрисида.pdf",
      extracted: true,
      usefulFor: ["roofing", "roof_materials", "waterproofing"],
      notes: [
        "Tom loyihasida iqlim, yuklama, yong‘in xavfsizligi, issiqlik texnikasi va suv chiqarish talablari alohida tekshiriladi.",
        "Tom qoplamalarida suv qabul qiluvchi voronka, tashqi suv oqizish, parapet, xavfsizlik ilgaklari va ekspluatatsiya elementlari hisobga olinadi.",
        "Ushbu hujjat SHNK 2.01.01-22, 2.01.02-04, 2.01.04-18, 2.01.07-21, 2.03.01-24, 2.03.05-23, 2.04.01-22 va 2.08.01-24 kabi hujjatlarga bog‘lanadi."
      ]
    },
    {
      id: "shnk-2-01-02-04",
      code: "SHNK 2.01.02-04",
      title: "Binolar va inshootlarning yong‘in xavfsizligi",
      type: "fire_norms",
      localFile: "shnk_2010204_pozharnaia_bezopasnost_zdanii_i_sooruzhenii.pdf",
      extracted: "text_mojibake_needs_encoding_cleanup",
      usefulFor: ["fire_safety", "evacuation", "building_categories"],
      notes: [
        "PDF matn qatlami bor, lekin encoding buzilgan; toza data uchun LEX yoki OCR/encoding cleanup kerak.",
        "Yong‘in xavfsizligi AI uchun alohida tekshiruv blokiga ajratiladi: evakuatsiya, konstruksiya yong‘inga chidamliligi, muhandislik tizimlari va xavf kategoriyalari."
      ]
    },
    {
      id: "shnk-2-01-19-09",
      code: "SHNK 2.01.19-09",
      title: "Xonalar, binolar va tashqi qurilmalar kategoriyalarini aniqlash",
      type: "fire_norms",
      localFile: "shnk_2011909_opredelenie_kategorii_pomeshchenii_zdanii_i_nar.pdf",
      extracted: "needs_pdf_text_extractor",
      usefulFor: ["fire_explosion_categories", "industrial_projects"]
    },
    {
      id: "shhk-1-03-01-09",
      code: "SHHK 1.03.01-09",
      title: "Qurilishdagi geodezik ishlar",
      type: "geodesy",
      localFile: "shhk_bir3010309_geodezicheskie_raboty_v_stroitelstve_svod_pravi.pdf",
      extracted: "needs_pdf_text_extractor",
      usefulFor: ["toposurvey", "geodesy", "site_preparation"],
      notes: [
        "Skan PDF ko‘rinishida; OCR kerak.",
        "Topos’yomka va qurilish maydonini tayyorlash bo‘yicha data shu hujjatdan olinadi."
      ]
    },
    {
      id: "shnk-1-03-06-09",
      code: "SHNK 1.03.06-09",
      title: "Davlat ekspertizasini o‘tkazish qoidalari",
      type: "expertise",
      localFile: "shnk_besh1030609_pravila_provedeniia_gosudarstvennoi_ekspertizy.pdf",
      extracted: "needs_pdf_text_extractor",
      usefulFor: ["state_expertise", "approval_flow"]
    },
    {
      id: "shnk-1-03-06-13",
      code: "SHNK 1.03.06-13",
      title: "Davlat ekspertizasini o‘tkazish qoidalari",
      type: "expertise",
      localFile: "shnk_olti1030613_pravila_provedeniia_gosudarstvennoi_ekspertizy.pdf",
      extracted: true,
      usefulFor: ["state_expertise", "approval_flow"],
      notes: [
        "Ekspertizada hujjatlar komplektligi, normativlarga moslik, ekologiya, yong‘in xavfsizligi, mehnat xavfsizligi, sanitariya va favqulodda vaziyatlar bo‘yicha muhandislik-texnik chora-tadbirlar ko‘riladi.",
        "Qurilish joyi tanlanishi shaharsozlik, muhandislik-geologik, ekologik va boshqa omillar bilan asoslanadi."
      ]
    },
    {
      id: "buildai-standards-collection",
      code: "Local collection",
      title: "Qurilish standartlari jamlanmasi",
      type: "mixed",
      localFile: "qurulishstandartlari.pdf",
      extracted: true,
      usefulFor: ["kmk", "shnk", "concrete_reinforced_concrete", "hydraulic_structures"],
      notes: [
        "KMK 2.06.06-98 beton va temirbeton to‘g‘onlar bo‘yicha ikki tilli matn qatlami bor.",
        "Xususiy uy AI hisobida bevosita material normasi sifatida ishlatilmaydi, lekin beton/temirbeton hujjatlar indeksini boyitadi."
      ]
    }
  ],
  standardsIndex: [
    { code: "SHNK 2.01.01-22", title: "Loyihalash uchun iqlimiy va fizikaviy-geologik ma’lumotlar", domain: "climate_geology", status: "referenced_for_collection" },
    { code: "SHNK 2.01.02-04", title: "Bino va inshootlarning yong‘in xavfsizligi", domain: "fire_safety", status: "local_pdf_encoding_cleanup_needed" },
    { code: "SHNK 2.01.04-18", title: "Qurilish issiqlik texnikasi", domain: "thermal_protection", status: "referenced_for_collection" },
    { code: "SHNK 2.01.07-21", title: "Yuklamalar va ta’sirlar", domain: "loads", status: "referenced_for_collection" },
    { code: "SHNK 2.03.01-24", title: "Beton va temir-beton konstruksiyalar", domain: "reinforced_concrete", status: "referenced_for_collection" },
    { code: "SHNK 2.03.05-23", title: "Po‘lat konstruksiyalar. Loyihalash talablari", domain: "steel_structures", status: "referenced_for_collection" },
    { code: "SHNK 2.03.08-22", title: "Yog‘och konstruksiyalar", domain: "wood_structures", status: "referenced_for_collection" },
    { code: "SHNK 2.03.10-24", title: "Tomlar va tomqoplamalari", domain: "roofing", status: "local_text_extracted" },
    { code: "SHNK 2.03.11-24", title: "Bino va inshootlarning qurilish konstruksiyalarini korroziyadan himoyalash", domain: "corrosion_protection", status: "referenced_for_collection" },
    { code: "SHNK 2.04.01-22", title: "Binolarning ichki suv ta’minoti va kanalizatsiyasi", domain: "water_sewer_inside", status: "referenced_for_collection" },
    { code: "SHNK 2.04.03-24", title: "Oqova suvlarni chiqarib yuborish. Tashqi tarmoqlar va inshootlar", domain: "sewer_external", status: "referenced_for_collection" },
    { code: "SHNK 2.04.05-22", title: "Isitish, ventilyatsiya va konditsiyalash", domain: "hvac", status: "referenced_for_collection" },
    { code: "SHNK 2.04.07-22", title: "Issiqlik tarmoqlari", domain: "heat_networks", status: "referenced_for_collection" },
    { code: "KMK 2.04.07-99", title: "Issiqlik tarmoqlari", domain: "heat_networks", status: "lex_found", lexUrl: "https://lex.uz/ru/files/4442536.pdf" },
    { code: "SHNK 2.04.08-22", title: "Gaz ta’minoti. Loyihalash talablari", domain: "gas_supply", status: "referenced_for_collection" },
    { code: "SHNK 2.04.13-24", title: "Qozonxonalar", domain: "boiler_rooms", status: "referenced_for_collection" },
    { code: "SHNK 2.04.17-24", title: "Turarjoy va jamoat binolarining elektr jihozlari", domain: "electrical", status: "referenced_for_collection" },
    { code: "SHNK 2.05.07-24", title: "Avtoturargohlar", domain: "parking", status: "referenced_for_collection" },
    { code: "SHNK 2.07.01-23", title: "Aholi punktlari hududlarini rivojlantirish va qurishni rejalashtirish", domain: "urban_planning", status: "local_text_extracted", lexUrl: "https://lex.uz/pdffile/7050611" },
    { code: "SHNK 2.08.01-24", title: "Turar joy obyektlarini loyihalash", domain: "residential_design", status: "referenced_for_collection" },
    { code: "SHNK 2.08.02-23", title: "Jamoat binolari va inshootlari", domain: "public_buildings", status: "referenced_for_collection" },
    { code: "SHNK 2.09.21-2013", title: "Yong‘in o‘chirish depolari", domain: "fire_facilities", status: "lex_found", lexUrl: "https://lex.uz/files/4443258.pdf" }
  ],
  knowledgeRules: [
    {
      id: "private-house-docs-minimum",
      domain: "approval_flow",
      appliesTo: ["private_house_1f", "private_house_2f", "cottage", "townhouse"],
      rule: "Xususiy uy uchun kadastr, mulk huquqi yoki ijara huquqi, topos’yomka, geologiya, arxitektura ruxsati, loyiha va texnik shartlar bazaviy paket sifatida so‘raladi.",
      severity: "required"
    },
    {
      id: "foundation-geology-required",
      domain: "foundation",
      appliesTo: ["private_house_1f", "private_house_2f", "cottage", "townhouse", "multi_family", "industrial"],
      rule: "Poydevor turi geologiya xulosasi, grunt xususiyati, yer osti suvlari va seysmik hududga qarab tanlanadi.",
      severity: "required"
    },
    {
      id: "structural-engineer-required",
      domain: "structural_design",
      appliesTo: ["private_house_2f", "multi_family", "small_commercial", "industrial"],
      rule: "Ikki qavat va undan yuqori, katta oraliq, og‘ir tom yoki nostandart konstruksiyada konstruktor hisob-kitobi shart.",
      severity: "required"
    },
    {
      id: "roof-safety-and-drainage",
      domain: "roofing",
      appliesTo: ["private_house_1f", "private_house_2f", "cottage", "small_commercial"],
      rule: "Tomda suv chiqarish, voronka/truba, parapet masofalari, xavfsizlik ilgaklari, qor-yomg‘ir yuklamasi va yong‘in xavfsizligi tekshiriladi.",
      severity: "recommended",
      sourceCode: "SHNK 2.03.10-24"
    },
    {
      id: "engineering-networks-distance",
      domain: "urban_planning",
      appliesTo: ["private_house_1f", "private_house_2f", "small_commercial", "multi_family"],
      rule: "Muhandislik tarmoqlari orasidagi va tarmoqlardan bino poydevorigacha masofalar kamera, quduq, ta’mirlash va montaj sharoitlaridan kelib chiqib belgilanadi.",
      severity: "required",
      sourceCode: "SHNK 2.07.01-23"
    },
    {
      id: "fire-safety-not-final-by-ai",
      domain: "fire_safety",
      appliesTo: ["private_house_1f", "private_house_2f", "small_commercial", "multi_family", "industrial"],
      rule: "AI yong‘in xavfsizligi bo‘yicha faqat dastlabki checklist beradi; yakuniy yechim amaldagi SHNK va vakolatli mutaxassis bilan tekshiriladi.",
      severity: "required"
    },
    {
      id: "expertise-for-complex-projects",
      domain: "state_expertise",
      appliesTo: ["small_commercial", "multi_family", "industrial"],
      rule: "Murakkab obyektlarda hujjatlar komplektligi, normativlarga moslik, ekologiya, yong‘in, sanitariya, mehnat xavfsizligi va FV chora-tadbirlari ekspertizada ko‘riladi.",
      severity: "required",
      sourceCode: "SHNK 1.03.06-13"
    }
  ],
  parkingNorms: [
    { objectType: "multi_family_tashkent", label: "Toshkent shahri va Toshkent viloyatidagi ko‘p qavatli turar joy", basis: "1 ta xona", minCarPlaces: 1, sourceCode: "SHNK 2.07.01-03 amendments" },
    { objectType: "multi_family_regions", label: "Boshqa viloyatlardagi ko‘p qavatli turar joy", basis: "2 ta xona", minCarPlaces: 1, sourceCode: "SHNK 2.07.01-03 amendments" },
    { objectType: "school", label: "Maktab", basis: "25 ta bola", minCarPlaces: 1, sourceCode: "SHNK 2.07.01-03 amendments" },
    { objectType: "kindergarten", label: "Maktabgacha ta’lim tashkiloti", basis: "25 ta o‘quvchi", minCarPlaces: 1, sourceCode: "SHNK 2.07.01-03 amendments" },
    { objectType: "administrative", label: "Ma’muriy bino", basis: "10 m2", minCarPlaces: 1, sourceCode: "SHNK 2.07.01-03 amendments" },
    { objectType: "industrial", label: "Sanoat va ishlab chiqarish korxonasi", basis: "20 ta xodim", minCarPlaces: 2, sourceCode: "SHNK 2.07.01-03 amendments" }
  ],
  engineeringSystems: [
    { id: "gas", name: "Gaz ta’minoti", standardCode: "SHNK 2.04.08-22", requiredInputs: ["texnik shart", "kirish nuqtasi", "bosim turi", "xavfsizlik masofalari", "ventilyatsiya"], priceSource: "provider_listings" },
    { id: "electric", name: "Elektr ta’minoti", standardCode: "SHNK 2.04.17-24", requiredInputs: ["texnik shart", "kW quvvat", "kirish nuqtasi", "VRY/taqsimlash qurilmasi", "yerga ulash"], priceSource: "provider_listings" },
    { id: "water", name: "Ichki suv ta’minoti", standardCode: "SHNK 2.04.01-22", requiredInputs: ["texnik shart", "suv kirish nuqtasi", "sarf", "quvur materiali", "sanuzel soni"], priceSource: "provider_listings" },
    { id: "sewer", name: "Kanalizatsiya va oqova suv", standardCode: "SHNK 2.04.03-24", requiredInputs: ["texnik shart", "chiqish nuqtasi", "quvur diametri", "septik yoki markaziy tarmoq"], priceSource: "provider_listings" },
    { id: "hvac", name: "Isitish, ventilyatsiya va konditsiyalash", standardCode: "SHNK 2.04.05-22", requiredInputs: ["xona maydoni", "issiqlik yo‘qotish", "qozon turi", "ventkanal", "iqlim hududi"], priceSource: "provider_listings" }
  ],
  requiredDocuments: [
    { id: "kadastr", name: "Kadastr hujjati", requiredFor: ["private_house", "commercial_building"], reason: "Yer uchastkasi va obyekt huquqiy chegaralarini tasdiqlash." },
    { id: "ownership", name: "Mulk huquqi / ijara huquqi", requiredFor: ["private_house", "commercial_building"], reason: "Buyurtmachining qurilish qilish huquqini tekshirish." },
    { id: "toposurvey", name: "Topos’yomka", requiredFor: ["private_house", "commercial_building"], reason: "Yer relyefi, kommunikatsiyalar va joylashuvni loyihaga kiritish." },
    { id: "geology", name: "Geologiya xulosasi", requiredFor: ["private_house", "commercial_building"], reason: "Poydevor turi, grunt va yer osti suvlari bo‘yicha qaror qabul qilish." },
    { id: "project", name: "Arxitektura va konstruktiv loyiha", requiredFor: ["private_house", "commercial_building"], reason: "Materiallar, konstruksiya, muhandislik tizimlari va smeta uchun asos." },
    { id: "architecture_permission", name: "Arxitekturaviy rejalashtirish ruxsati", requiredFor: ["private_house", "commercial_building"], reason: "Hududiy shaharsozlik talablariga muvofiqlikni tekshirish." },
    { id: "technical_conditions", name: "Texnik shartlar", requiredFor: ["private_house", "commercial_building"], reason: "Elektr, gaz, suv, kanalizatsiya va yo‘l ulanishlarini rejalashtirish." },
    { id: "expertise", name: "Davlat yoki vakolatli ekspertiza xulosasi", requiredFor: ["commercial_building", "multi_family"], reason: "Murakkab va yirik obyektlarda loyiha xavfsizligini tasdiqlash." }
  ],
  projectTypes: [
    { id: "private_house_1f", name: "1 qavatli hovli uy", complexity: "low", aiSupportedNow: true },
    { id: "private_house_2f", name: "2 qavatli xususiy uy", complexity: "medium", aiSupportedNow: true },
    { id: "cottage", name: "Kottej / dala hovli", complexity: "medium", aiSupportedNow: true },
    { id: "townhouse", name: "1-2 qavatli bloklangan uy", complexity: "medium", aiSupportedNow: true },
    { id: "small_commercial", name: "Kichik tijorat binosi", complexity: "medium", aiSupportedNow: false },
    { id: "multi_family", name: "Ko‘p qavatli turar joy", complexity: "high", aiSupportedNow: false },
    { id: "industrial", name: "Korxona / ishlab chiqarish binosi", complexity: "high", aiSupportedNow: false }
  ],
  materialNorms: [
    { key: "cement", name: "Sement", unit: "qop", basePerSqm: 0.55, scope: "demo_private_house", source: "BuildAI starter formula, to be calibrated by standards and real projects" },
    { key: "brick", name: "G‘isht / gazoblok", unit: "dona", basePerSqm: 145, scope: "demo_private_house", source: "BuildAI starter formula, wall type needed for accuracy" },
    { key: "rebar", name: "Armatura", unit: "tonna", basePerSqm: 0.018, scope: "demo_private_house", source: "BuildAI starter formula, structural calculation required" },
    { key: "concrete", name: "Beton", unit: "m3", basePerSqm: 0.34, scope: "demo_private_house", source: "BuildAI starter formula, foundation type needed for accuracy" },
    { key: "sand", name: "Qum", unit: "m3", basePerSqm: 0.28, scope: "demo_private_house", source: "BuildAI starter formula" },
    { key: "gravel", name: "Shag‘al", unit: "m3", basePerSqm: 0.22, scope: "demo_private_house", source: "BuildAI starter formula" },
    { key: "roof", name: "Tom materiali", unit: "m2", basePerGroundSqm: 1.25, scope: "demo_private_house", source: "SHNK 2.03.10-24 should calibrate this" },
    { key: "windows", name: "Deraza va eshik", unit: "ta", rule: "max(8, rooms + floors * 3)", scope: "demo_private_house", source: "BuildAI starter formula" }
  ],
  serviceCategories: [
    "arxitektor", "konstruktor", "smetachi", "geodezist", "geolog", "betonchi", "g‘isht teruvchi", "gazoblok ustasi",
    "armaturachi", "qolipchi", "tom yopuvchi", "elektrik", "santexnik", "gaz montaj ustasi", "suvoqchi",
    "gipsokarton ustasi", "plitkachi", "bo‘yoqchi", "pol ustasi", "eshik-deraza montaj ustasi", "fasad ustasi",
    "izolyatsiya ustasi", "payvandchi", "kranchi operator", "texnika operatori", "brigadir", "texnik nazoratchi"
  ],
  equipmentCategories: [
    "ekskavator", "buldozer", "avtokran", "manipulyator", "beton mixer", "beton nasos", "yuk mashina", "samosval",
    "mini pogruzchik", "kompressor", "vibrator", "qolip/scaffolding", "lazer nivelir", "generator", "perforator",
    "bolgarka", "payvandlash apparati", "beton kesuvchi", "suv nasosi", "xavfsizlik to‘siqlari"
  ],
  aiPolicy: {
    priceSource: "Provider e’lonlari va tasdiqlangan narx bazasi",
    safetyRule: "AI faqat dastlabki smeta va maslahat beradi; konstruktiv, yong‘in, sanitariya va ruxsat masalalarida mutaxassis xulosasi kerak.",
    nextStep: "PDF matn extractor yoki OCR qo‘shib, har bir normativdan band-band knowledge base yaratish."
  }
};
