<template>
  <div>
    <HeroCarousel />
    <MediaSlider title="今日趋势" :mediaList="results" />
  </div>
</template>

<script setup lang="ts">
import HeroCarousel from '@/views/dailyRecommendation/heroCarousel.vue'
import MediaSlider from '@/components/MediaSlider.vue'

const results = ref([
  {
    adult: false,
    backdrop_path: 'https://image.tmdb.org/t/p/original/kqHypb4MdEBUFiphf49bK99T4cn.jpg',
    genre_ids: [878, 53],
    id: 755898,
    original_language: 'en',
    original_title: 'War of the Worlds',
    overview:
      '威尔·拉德福德是国土安全部的顶级网络安全分析师，他通过大规模监控项目追踪国家安全的潜在威胁。直到有一天，一个不明实体的攻击让他开始怀疑政府是否对他……以及世界其他地方隐瞒了什么。',
    popularity: 1554.6094,
    poster_path: 'https://image.tmdb.org/t/p/original/yvirUYrva23IudARHn3mMGVxWqM.jpg',
    release_date: '2025-07-29',
    title: '世界大战',
    video: false,
    vote_average: 4.167,
    vote_count: 297
  },
  {
    adult: false,
    backdrop_path: 'https://image.tmdb.org/t/p/original/zNriRTr0kWwyaXPzdg1EIxf0BWk.jpg',
    genre_ids: [878, 12, 28],
    id: 1234821,
    original_language: 'en',
    original_title: 'Jurassic World Rebirth',
    overview:
      '地球生态已被证明广泛不适合恐龙生存，危在旦夕的恐龙族群生存于孤岛之上，但是它们中却隐藏着能够带来人类医药奇迹的关键基因，为获取神秘基因，一支精英小队潜入恐龙禁地，然而等待他们的却是无法预知的危机和惊天阴谋……',
    popularity: 939.9753,
    poster_path: 'https://image.tmdb.org/t/p/original/1TamJnLwes02dJTTvIwJcQRtRuQ.jpg',
    release_date: '2025-07-01',
    title: '侏罗纪世界：重生',
    video: false,
    vote_average: 6.39,
    vote_count: 1483
  },
  {
    adult: false,
    backdrop_path: 'https://image.tmdb.org/t/p/original/bP6BqIljp4a3BqhxN7YPckcpKI.jpg',
    genre_ids: [28, 18, 36],
    id: 1195631,
    original_language: 'en',
    original_title: 'William Tell',
    overview:
      '威廉·退尔与他的中东妻子苏娜以及他们的儿子沃尔特生活在1307年的瑞士。奥地利人继续压迫瑞士人民，并肆意掠夺他们所占领的土地，满足其邪恶的欲望。当奥地利人袭击附近的一个村庄时，州长沃尔夫肖特强暴并杀害了农夫鲍姆加滕的妻子。作为报复，鲍姆加滕杀死了州长，但被迫逃亡。威廉·退尔出于善良的本性，帮助他逃脱，并将他带到自己的老朋友斯陶夫哈赫那里。斯陶夫哈赫是一位曾经的十字军战士，泰尔曾与他一同在耶路撒冷作战，他的妻子是格特鲁德。尽管威廉·退尔曾发誓不再诉诸暴力，但他和他的朋友们一致认为，必须阻止奥地利人的暴行。',
    popularity: 490.2596,
    poster_path: 'https://image.tmdb.org/t/p/original/8SdaetXSTPyQVDb5pTEPRLBSx15.jpg',
    release_date: '2025-01-17',
    title: '威廉·退尔',
    video: false,
    vote_average: 6.28,
    vote_count: 91
  },
  {
    adult: false,
    backdrop_path: 'https://image.tmdb.org/t/p/original/y7tjLYcq2ZGy2DNG0ODhGX9Tm60.jpg',
    genre_ids: [28, 35, 80],
    id: 1106289,
    original_language: 'en',
    original_title: 'The Pickup',
    overview:
      '一次例行的现金押运任务突然变得危机四伏，各方面都迥异的装甲卡车司机罗塞尔 和特拉维斯 被冷酷无情的罪犯伏击，这些罪犯由精明的幕后主使佐伊 领导。随着混乱局面的爆发，这对本不合拍的搭档必须在危险和性格冲突中周旋应对，度过这状况不断失控的糟糕的一天。',
    popularity: 400.0018,
    poster_path: 'https://image.tmdb.org/t/p/original/wz43lNee1VWcaP3GA6bCTzzoFzp.jpg',
    release_date: '2025-07-27',
    title: '致命劫持',
    video: false,
    vote_average: 6.544,
    vote_count: 215
  },
  {
    adult: false,
    backdrop_path: 'https://image.tmdb.org/t/p/original/7A3ru3bxmWtyF0ep0CJcLLzWT35.jpg',
    genre_ids: [28, 18, 36],
    id: 1185528,
    original_language: 'zh',
    original_title: '射雕英雄传：侠之大者',
    overview:
      '恩怨情仇的江湖，权势角力的战乱时代，郭靖（肖战 饰）童年离别家乡，逐渐炼就可改变局面和命运的庞大力量。虽受高人赏识和器重，得传天下绝世武功“九阴真经”和“降龙十八掌”，却惹来各方嫉忌，成为众矢之的。  　　郭靖，不亢不卑，怀赤子之心，与黄蓉（庄达菲 饰）在铁骑箭雨和硝烟旌旗中，力挽狂澜，保护南宋边关。  　　雕海苍穹，勇者无惧，侠之大者，力拔山河，成就武林传说。  　　本片主要改编自金庸同名原著第34至40章。',
    popularity: 391.1223,
    poster_path: 'https://image.tmdb.org/t/p/original/xZmUHiZlzuU3FuD9EE5wdZpNc95.jpg',
    release_date: '2025-01-29',
    title: '射雕英雄传：侠之大者',
    video: false,
    vote_average: 6.176,
    vote_count: 34
  },
  {
    adult: false,
    backdrop_path: 'https://image.tmdb.org/t/p/original/1RgPyOhN4DRs225BGTlHJqCudII.jpg',
    genre_ids: [16, 28, 14, 53],
    id: 1311031,
    original_language: 'ja',
    original_title: '劇場版「鬼滅の刃」無限城編 第一章 猗窩座再来',
    overview:
      '当鬼杀队的成员和柱之人在为即将到来的与鬼的战斗做准备，完成共同的体能训练——柱之训练时，须佐能乎吉在宇治屋山庄出现。由于鬼杀队的主公处于危险之中，炭治郎和柱急忙赶往总部，但却被须佐能乎吉推入一个神秘的房间。炭治郎和鬼杀队的目标是鬼的堡垒——无限城。因此，鬼杀队和鬼之间的最终战斗的战场已经准备就绪。',
    popularity: 303.7848,
    poster_path: 'https://image.tmdb.org/t/p/original/ozfiVnEZUSGWhEl5VtdLdIe1nbt.jpg',
    release_date: '2025-07-18',
    title: '鬼灭之刃剧场版：无限城篇Part.1',
    video: false,
    vote_average: 7.065,
    vote_count: 69
  },
  {
    adult: false,
    backdrop_path: 'https://image.tmdb.org/t/p/original/iZztGzckOMByRRQgsFh2yk3udkU.jpg',
    genre_ids: [28, 27, 10749],
    id: 986206,
    original_language: 'en',
    original_title: 'Night Carnage',
    overview: '一个狼人博主遇到了一个迷人的花花公子，他隐藏着自己的神秘秘密。',
    popularity: 258.5043,
    poster_path: 'https://image.tmdb.org/t/p/original/w0wjPQKhlqisSbylf1sWZiNyc2h.jpg',
    release_date: '2025-07-29',
    title: '夜间屠杀',
    video: false,
    vote_average: 5.816,
    vote_count: 38
  },
  {
    adult: false,
    backdrop_path: 'https://image.tmdb.org/t/p/original/Q2OajDi2kcO6yErb1IAyVDTKMs.jpg',
    genre_ids: [27, 9648],
    id: 1078605,
    original_language: 'en',
    original_title: 'Weapons',
    overview:
      '　　同一个班上除了一名孩子外，其余所有孩子在同一天晚上的同一时间神秘失踪，这让整个社区开始怀疑究竟是谁或什么导致了他们的失踪。',
    popularity: 256.0851,
    poster_path: 'https://image.tmdb.org/t/p/original/6gPW0QD0JncCqVJLLKJn3s8cDNC.jpg',
    release_date: '2025-08-04',
    title: '武器',
    video: false,
    vote_average: 7.7,
    vote_count: 285
  },
  {
    adult: false,
    backdrop_path: 'https://image.tmdb.org/t/p/original/nZsKWhwhUL3Eg88SkIaJjuIZzpN.jpg',
    genre_ids: [28, 35, 53],
    id: 1319895,
    original_language: 'en',
    original_title: 'Hostile Takeover',
    overview: '',
    popularity: 277.0976,
    poster_path: 'https://image.tmdb.org/t/p/original/vntwlS3CAKfoLTs90GaoK6lymBC.jpg',
    release_date: '2025-08-08',
    title: '暴力接管',
    video: false,
    vote_average: 8.2,
    vote_count: 5
  },
  {
    adult: false,
    backdrop_path: 'https://image.tmdb.org/t/p/original/ySHUoK4utUOiSfCinw81H1TsV0E.jpg',
    genre_ids: [878, 28, 27],
    id: 1241470,
    original_language: 'en',
    original_title: 'Osiris',
    overview:
      '在这部电影中，一队特种部队突击队员在执行任务的过程中被一艘神秘的宇宙飞船绑架。当他们在飞船上醒来时，很快发现自己正在被一个无情的外星种族追捕。',
    popularity: 367.4563,
    poster_path: 'https://image.tmdb.org/t/p/original/9xqWda3KWuGWxNyoqlOlEzEzPmd.jpg',
    release_date: '2025-07-25',
    title: '太空杀路',
    video: false,
    vote_average: 6.411,
    vote_count: 45
  },
  {
    adult: false,
    backdrop_path: 'https://image.tmdb.org/t/p/original/cEQMqB3ahd4mfeUN6VGC0ouVnZZ.jpg',
    genre_ids: [28, 878, 53],
    id: 1071585,
    original_language: 'en',
    original_title: 'M3GAN 2.0',
    overview:
      '　　第二部仍以女孩凯蒂和她的姨妈珍玛为主线，她们遭到了下一代机器人“艾米莉亚”的疯狂攻击，而本已沦为智能语音助手的梅根，似乎是帮助她们对抗艾米莉亚的绝佳选择。',
    popularity: 201.9448,
    poster_path: 'https://image.tmdb.org/t/p/original/lQXDRQUxfkoABXh03eadAr1C8H7.jpg',
    release_date: '2025-06-25',
    title: '梅根2.0',
    video: false,
    vote_average: 7.595,
    vote_count: 678
  },
  {
    adult: false,
    backdrop_path: 'https://image.tmdb.org/t/p/original/A466i5iATrpbVjX30clP1Zyfp31.jpg',
    genre_ids: [10749, 35, 18],
    id: 1307078,
    original_language: 'en',
    original_title: 'My Oxford Year',
    overview:
      '当罗德奖学金的橄榄枝将Ella Durran送往牛津，她以为自己终将置身于羊皮纸与烛光构筑的学术圣殿。然而，一场政治新星的总统竞选邀约，将这位理想主义者的罗德之梦撕裂成两种轨迹——一边是牛津图书馆里闪耀的哲学星光，一边是政治办公室里燃烧的野心火焰。当她与本地青年Jamie Davenport的激情从牛津的初雪蔓延至泰晤士河畔的暮色时，一场更致命的诱惑悄然浮现：他袖口藏着的，是足以颠覆她人生选择的秘密。在毕业钟声回荡的石板路上，Ella必须抉择——是让政治的权杖刺穿爱情的玫瑰，还是任由牛津的月光将未竟的理想刻入永恒。',
    popularity: 189.9382,
    poster_path: 'https://image.tmdb.org/t/p/original/gzvmYHGD7Rn6IhyY6w89k9MF0bT.jpg',
    release_date: '2025-07-31',
    title: '爱在牛津的一年',
    video: false,
    vote_average: 7.188,
    vote_count: 245
  },
  {
    adult: false,
    backdrop_path: 'https://image.tmdb.org/t/p/original/eU7IfdWq8KQy0oNd4kKXS0QUR08.jpg',
    genre_ids: [878, 12, 28],
    id: 1061474,
    original_language: 'en',
    original_title: 'Superman',
    overview: '他是真理、正义、美国方式的代表，在这个把善良当做老派的世界，他是善良的化身。',
    popularity: 172.7213,
    poster_path: 'https://image.tmdb.org/t/p/original/ln6itpK8OifoGV0IAFDtD7NmPSs.jpg',
    release_date: '2025-07-09',
    title: '超人',
    video: false,
    vote_average: 7.7,
    vote_count: 1674
  },
  {
    adult: false,
    backdrop_path: 'https://image.tmdb.org/t/p/original/r2u7GCYhxtpZbprKJIgdAkGQow3.jpg',
    genre_ids: [27, 35],
    id: 1225572,
    original_language: 'en',
    original_title: 'Screamboat',
    overview:
      '在纽约的午夜，一艘游船因为一只老鼠外形的杀手降临而变成了一个可怕的地狱，游船上的人能否在这个可怕的杀手面前幸存下来呢？',
    popularity: 174.0057,
    poster_path: 'https://image.tmdb.org/t/p/original/78xGAhQaKpgq9TI08XK40Ua2bGx.jpg',
    release_date: '2025-03-20',
    title: '泣船威利',
    video: false,
    vote_average: 5.447,
    vote_count: 57
  },
  {
    adult: false,
    backdrop_path: 'https://image.tmdb.org/t/p/original/s94NjfKkcSczZ1FembwmQZwsuwY.jpg',
    genre_ids: [878, 12],
    id: 617126,
    original_language: 'en',
    original_title: 'The Fantastic 4: First Steps',
    overview:
      '　　故事设定在以1960年代为灵感的复古未来世界，“漫威第一家庭”惊奇先生（佩德罗·帕斯卡 Pedro Pascal 饰）、隐形女（凡妮莎·柯比 Vanessa Kirby 饰）、霹雳火（约瑟夫·奎恩 Joseph Quinn 饰）和石头人（艾邦·摩斯-巴克拉赫 Ebon Moss-Bachrach 饰）面临迄今为止最艰巨的挑战。他们必须在英雄角色和家庭关系之间取得平衡，同时保卫地球，抵御名为行星吞噬者（拉尔夫·伊内森 Ralph Ineson 饰）的贪婪宇宙神及其神秘的使者银影侠（朱莉娅·加纳 Julia Garner 饰）。而当行星吞噬者计划吞噬整个星球及所有人，没有人可以置身事外。',
    popularity: 176.122,
    poster_path: 'https://image.tmdb.org/t/p/original/t9mlOaf4ismhvKVMSXNJBTL3Wvh.jpg',
    release_date: '2025-07-23',
    title: '神奇四侠：初露锋芒',
    video: false,
    vote_average: 7.268,
    vote_count: 964
  },
  {
    adult: false,
    backdrop_path: 'https://image.tmdb.org/t/p/original/7Q2CmqIVJuDAESPPp76rWIiA0AD.jpg',
    genre_ids: [28, 12, 18],
    id: 1011477,
    original_language: 'en',
    original_title: 'Karate Kid: Legends',
    overview:
      '　　功夫少年李峰（王班 饰）初入纽约，因帮朋友解围反遭当地空手道冠军“美式霸凌”，便决心参加空手道大赛赢回尊重。昔日恩师韩师傅（成龙 饰）远渡重洋携空手道大师丹尼尔（拉尔夫·马基奥 饰）出手相助，将纽约化成训练场对李峰开启宗师特训。在师傅们的教导下，李峰能否将两个武术流派融会贯通，用胜利赢得尊重并开辟属于自己的武学之道？',
    popularity: 169.2135,
    poster_path: 'https://image.tmdb.org/t/p/original/vLSMpla6S8pMtgOU201tya6tDtH.jpg',
    release_date: '2025-05-08',
    title: '功夫梦：融合之道',
    video: false,
    vote_average: 7.151,
    vote_count: 654
  },
  {
    adult: false,
    backdrop_path: 'https://image.tmdb.org/t/p/original/oPgXVSdGR9dGwbmvIToOCMmsdc2.jpg',
    genre_ids: [28, 53, 80],
    id: 541671,
    original_language: 'en',
    original_title: 'Ballerina',
    overview:
      '父亲惨遭杀害，少女伊芙（安娜·德·阿玛斯 饰）被迫加入杀手组织，在这里她被培养成为一名芭蕾舞者，同时接受了长达12年的魔鬼训练成为了顶级杀手，开启了血刃仇人的杀戮之旅。她不仅要独自一人完成组织下达的死亡任务，还要暗中搜集杀父仇家的信息。随时丧命的极端危险、各方势力的联合围剿，让伊芙的复仇之路艰难无比。同时，她又被传说中的杀手约翰·威克（基努·里维斯 饰）锁定，新老杀神狭路相逢，伊芙必须在被约翰追到之前杀出血路完成复仇。危险的倒计时开始，一场致命厮杀即将拉开血色序幕……',
    popularity: 134.4356,
    poster_path: 'https://image.tmdb.org/t/p/original/zDlUIGVsRtDQKyIAPNIXZhpobnP.jpg',
    release_date: '2025-06-04',
    title: '疾速追杀：芭蕾杀姬',
    video: false,
    vote_average: 7.435,
    vote_count: 1316
  },
  {
    adult: false,
    backdrop_path: 'https://image.tmdb.org/t/p/original/x5dVPttNDZaVRTvbk7pYrtGZoZN.jpg',
    genre_ids: [35, 18],
    id: 1263256,
    original_language: 'en',
    original_title: 'Happy Gilmore 2',
    overview: '　　续集将讲述他从一名弃将变成高尔夫球手的故事，他参加了一场高级高尔夫巡回赛。',
    popularity: 120.3965,
    poster_path: 'https://image.tmdb.org/t/p/original/6dYAxnwRQNdXILx621xdX61fJJB.jpg',
    release_date: '2025-07-25',
    title: '高尔夫球也疯狂2',
    video: false,
    vote_average: 6.743,
    vote_count: 551
  },
  {
    adult: false,
    backdrop_path: 'https://image.tmdb.org/t/p/original/kWm4HxanOhRWfW9PzigkUXulwdG.jpg',
    genre_ids: [27],
    id: 1339166,
    original_language: 'es',
    original_title: 'Shaman',
    overview:
      '一名传教士在偏远的厄瓜多尔火山地区皈依了一个土著部落，当她的儿子被黑暗势力附身时，她必须接受自己的信仰。',
    popularity: 131.7801,
    poster_path: 'https://image.tmdb.org/t/p/original/ltLqm9f9Ma3iCFmfXNHenzPEqda.jpg',
    release_date: '2025-07-16',
    title: '萨满',
    video: false,
    vote_average: 5.464,
    vote_count: 14
  },
  {
    adult: false,
    backdrop_path: 'https://image.tmdb.org/t/p/original/b0yK9BHyTNHGS6fBFLXBFtLC9AW.jpg',
    genre_ids: [27],
    id: 1452176,
    original_language: 'en',
    original_title: "Abraham's Boys: A Dracula Story",
    overview:
      '剧情讲述了两个在过度保护的父亲亚伯拉罕的统治下挣扎的男孩马克思和鲁迪。在他们深入研究了亚伯拉罕与德古拉的历史后，马克斯和鲁迪的世界揭开了面纱，因为他们发现了他们在不知不觉中继承的历史和遗产。',
    popularity: 98.6802,
    poster_path: '/e10AbPwcJk5b7ja3MQUVr5wHEeq.jpg',
    release_date: '2025-07-11',
    title: '血肉至亲',
    video: false,
    vote_average: 5.2,
    vote_count: 9
  }
])
</script>

<style></style>
