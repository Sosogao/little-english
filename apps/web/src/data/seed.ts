import type {
  Companion,
  Family,
  Learner,
  LearnerProfile,
  ThemeContent,
  ThemePlan,
} from '@/types/database';
import { loadJson, saveJson, storageKeys } from '@/services/storageService';

const createdAt = '2026-07-09T00:00:00.000Z';
const scheduledDate = '2026-07-09';

export const mockFamily: Family = {
  id: 'family_journey_home',
  name: 'Journey Family',
  createdAt,
  updatedAt: createdAt,
};

export const mockLearners: Learner[] = [
  {
    id: 'learner_xiaoqi',
    familyId: mockFamily.id,
    displayName: '小七',
    role: 'child',
    age: 9,
    avatarEmoji: '🌱',
    companionId: 'companion_momo',
    currentLevel: 'pre-a1',
    dailyGoalMinutes: 20,
    streakDays: 3,
    totalLearningDays: 8,
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: 'learner_xiaoliu',
    familyId: mockFamily.id,
    displayName: '小六',
    role: 'child',
    age: 6,
    avatarEmoji: '⭐',
    companionId: 'companion_bibi',
    currentLevel: 'pre-a1',
    dailyGoalMinutes: 15,
    streakDays: 2,
    totalLearningDays: 5,
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: 'learner_dad',
    familyId: mockFamily.id,
    displayName: '爸爸',
    role: 'adult',
    avatarEmoji: '🚲',
    companionId: 'companion_lumi',
    currentLevel: 'a1',
    dailyGoalMinutes: 25,
    streakDays: 1,
    totalLearningDays: 4,
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: 'learner_mom',
    familyId: mockFamily.id,
    displayName: '妈妈',
    role: 'adult',
    avatarEmoji: '🌸',
    companionId: 'companion_nana',
    currentLevel: 'a1',
    dailyGoalMinutes: 25,
    streakDays: 4,
    totalLearningDays: 10,
    createdAt,
    updatedAt: createdAt,
  },
];

export const mockCompanions: Companion[] = [
  {
    id: 'companion_momo',
    learnerId: 'learner_xiaoqi',
    name: 'Summer',
    avatarEmoji: '🐣',
    personality: 'warm',
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: 'companion_bibi',
    learnerId: 'learner_xiaoliu',
    name: 'Summer',
    avatarEmoji: '🦊',
    personality: 'playful',
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: 'companion_lumi',
    learnerId: 'learner_dad',
    name: 'Summer',
    avatarEmoji: '🧭',
    personality: 'patient',
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: 'companion_nana',
    learnerId: 'learner_mom',
    name: 'Summer',
    avatarEmoji: '🌼',
    personality: 'encouraging',
    createdAt,
    updatedAt: createdAt,
  },
];

export const mockProfiles: LearnerProfile[] = [
  {
    id: 'profile_xiaoqi',
    learnerId: 'learner_xiaoqi',
    learningGoal: 'Say simple animal words with confidence.',
    interests: ['animals', 'songs', 'drawing'],
    dislikes: ['long tests'],
    strengths: ['listening', 'copying sounds'],
    weakPoints: ['full sentences'],
    confidenceLevel: 58,
    listeningLevel: 52,
    speakingLevel: 38,
    readingLevel: 24,
    vocabularyLevel: 35,
    grammarLevel: 20,
    updatedAt: createdAt,
  },
  {
    id: 'profile_xiaoliu',
    learnerId: 'learner_xiaoliu',
    learningGoal: 'Enjoy short English greetings and farm words.',
    interests: ['games', 'colors', 'animals'],
    dislikes: ['repeating too many times'],
    strengths: ['memory', 'movement games'],
    weakPoints: ['pronunciation confidence'],
    confidenceLevel: 50,
    listeningLevel: 45,
    speakingLevel: 32,
    readingLevel: 18,
    vocabularyLevel: 30,
    grammarLevel: 16,
    updatedAt: createdAt,
  },
  {
    id: 'profile_dad',
    learnerId: 'learner_dad',
    learningGoal: 'Practice everyday family English.',
    interests: ['travel', 'family talk', 'work phrases'],
    dislikes: ['grammar drills'],
    strengths: ['reading', 'persistence'],
    weakPoints: ['speaking fluency'],
    confidenceLevel: 46,
    listeningLevel: 50,
    speakingLevel: 36,
    readingLevel: 60,
    vocabularyLevel: 48,
    grammarLevel: 42,
    updatedAt: createdAt,
  },
  {
    id: 'profile_mom',
    learnerId: 'learner_mom',
    learningGoal: 'Speak warm daily English with the children.',
    interests: ['stories', 'parent-child talk', 'songs'],
    dislikes: ['cold classroom style'],
    strengths: ['listening', 'daily practice'],
    weakPoints: ['sentence patterns'],
    confidenceLevel: 54,
    listeningLevel: 56,
    speakingLevel: 40,
    readingLevel: 52,
    vocabularyLevel: 45,
    grammarLevel: 38,
    updatedAt: createdAt,
  },
];

type CurriculumWord = {
  emoji: string;
  word: string;
  meaningZh: string;
  difficulty?: 1 | 2 | 3 | 4 | 5;
};

type CurriculumDay = {
  dayIndex: number;
  kind: 'adventure' | 'review' | 'challenge' | 'graduation';
  theme: string;
  title: string;
  adventureTitle: string;
  placePhrase: string;
  keySentence: string;
  missionInstruction: string;
  missionSentence: string;
  vocabulary: CurriculumWord[];
};

const curriculumDays: CurriculumDay[] = [
  {
    dayIndex: 1,
    kind: 'adventure',
    theme: 'Farm',
    title: 'At the Farm',
    adventureTitle: "Let's Visit the Farm",
    placePhrase: 'on the farm',
    keySentence: 'I see a cow.',
    missionInstruction: 'Tell Gordon one farm animal you like.',
    missionSentence: 'I like cows.',
    vocabulary: [
      { emoji: '🐄', word: 'cow', meaningZh: '奶牛', difficulty: 1 },
      { emoji: '🐴', word: 'horse', meaningZh: '马', difficulty: 2 },
      { emoji: '🦆', word: 'duck', meaningZh: '鸭子', difficulty: 1 },
      { emoji: '🐷', word: 'pig', meaningZh: '猪', difficulty: 1 },
    ],
  },
  {
    dayIndex: 2,
    kind: 'adventure',
    theme: 'Zoo',
    title: 'At the Zoo',
    adventureTitle: "Let's Visit the Zoo",
    placePhrase: 'at the zoo',
    keySentence: 'I like the lion.',
    missionInstruction: 'Tell Vicky one zoo animal you like.',
    missionSentence: 'I like pandas.',
    vocabulary: [
      { emoji: '🦁', word: 'lion', meaningZh: '狮子', difficulty: 2 },
      { emoji: '🐒', word: 'monkey', meaningZh: '猴子', difficulty: 2 },
      { emoji: '🐘', word: 'elephant', meaningZh: '大象', difficulty: 2 },
      { emoji: '🐼', word: 'panda', meaningZh: '熊猫', difficulty: 1 },
    ],
  },
  {
    dayIndex: 3,
    kind: 'adventure',
    theme: 'Birthday Party',
    title: 'Birthday Party',
    adventureTitle: 'Plan a Birthday Party',
    placePhrase: 'at the party',
    keySentence: 'Happy birthday to you.',
    missionInstruction: 'Say a birthday sentence to someone at home.',
    missionSentence: 'Happy birthday to you.',
    vocabulary: [
      { emoji: '🎂', word: 'cake', meaningZh: '蛋糕' },
      { emoji: '🕯️', word: 'candle', meaningZh: '蜡烛' },
      { emoji: '🎁', word: 'gift', meaningZh: '礼物' },
      { emoji: '🎈', word: 'party', meaningZh: '派对' },
    ],
  },
  {
    dayIndex: 4,
    kind: 'adventure',
    theme: 'School',
    title: 'At School',
    adventureTitle: 'A Day at School',
    placePhrase: 'at school',
    keySentence: 'I have a book.',
    missionInstruction: 'Show one thing in your bag and say its English name.',
    missionSentence: 'I have a book.',
    vocabulary: [
      { emoji: '📘', word: 'book', meaningZh: '书' },
      { emoji: '✏️', word: 'pencil', meaningZh: '铅笔' },
      { emoji: '🪑', word: 'desk', meaningZh: '书桌' },
      { emoji: '👩‍🏫', word: 'teacher', meaningZh: '老师' },
    ],
  },
  {
    dayIndex: 5,
    kind: 'adventure',
    theme: 'Family',
    title: 'My Family',
    adventureTitle: 'Meet My Family',
    placePhrase: 'at home',
    keySentence: 'This is my family.',
    missionInstruction: 'Point to a family photo and say one family sentence.',
    missionSentence: 'This is my family.',
    vocabulary: [
      { emoji: '👩', word: 'mother', meaningZh: '妈妈' },
      { emoji: '👨', word: 'father', meaningZh: '爸爸' },
      { emoji: '👧', word: 'sister', meaningZh: '姐妹' },
      { emoji: '👦', word: 'brother', meaningZh: '兄弟' },
    ],
  },
  {
    dayIndex: 6,
    kind: 'review',
    theme: 'Week 1 Review',
    title: 'Review Adventure',
    adventureTitle: 'Water Week 1 Memories',
    placePhrase: 'in Summer’s review garden',
    keySentence: 'I remember my words.',
    missionInstruction: 'Tell Gordon two words from Farm or Zoo.',
    missionSentence: 'I remember cow and panda.',
    vocabulary: [
      { emoji: '🐄', word: 'cow', meaningZh: '奶牛' },
      { emoji: '🐼', word: 'panda', meaningZh: '熊猫' },
      { emoji: '📘', word: 'book', meaningZh: '书' },
      { emoji: '👨', word: 'father', meaningZh: '爸爸' },
    ],
  },
  {
    dayIndex: 7,
    kind: 'challenge',
    theme: 'Week 1 Challenge',
    title: 'Adventure Challenge',
    adventureTitle: 'Explorer Challenge 1',
    placePhrase: 'at Summer’s challenge gate',
    keySentence: 'I can try the challenge.',
    missionInstruction: 'Say one brave English sentence to Vicky.',
    missionSentence: 'I can try.',
    vocabulary: [
      { emoji: '⭐', word: 'try', meaningZh: '尝试' },
      { emoji: '🗣️', word: 'speak', meaningZh: '说' },
      { emoji: '👂', word: 'listen', meaningZh: '听' },
      { emoji: '🌟', word: 'brave', meaningZh: '勇敢的' },
    ],
  },
  {
    dayIndex: 8,
    kind: 'adventure',
    theme: 'Breakfast',
    title: 'Breakfast Time',
    adventureTitle: 'Make Breakfast',
    placePhrase: 'at breakfast',
    keySentence: 'I want some milk.',
    missionInstruction: 'At breakfast, tell someone what you want.',
    missionSentence: 'I want some milk.',
    vocabulary: [
      { emoji: '🥛', word: 'milk', meaningZh: '牛奶' },
      { emoji: '🍞', word: 'bread', meaningZh: '面包' },
      { emoji: '🥚', word: 'egg', meaningZh: '鸡蛋' },
      { emoji: '🍌', word: 'banana', meaningZh: '香蕉' },
    ],
  },
  {
    dayIndex: 9,
    kind: 'adventure',
    theme: 'Fruits',
    title: 'Fruit Stand',
    adventureTitle: 'Choose Fresh Fruit',
    placePhrase: 'at the fruit stand',
    keySentence: 'I like apples.',
    missionInstruction: 'Tell Gordon one fruit you like.',
    missionSentence: 'I like apples.',
    vocabulary: [
      { emoji: '🍎', word: 'apple', meaningZh: '苹果' },
      { emoji: '🍊', word: 'orange', meaningZh: '橙子' },
      { emoji: '🍇', word: 'grape', meaningZh: '葡萄' },
      { emoji: '🍐', word: 'pear', meaningZh: '梨' },
    ],
  },
  {
    dayIndex: 10,
    kind: 'adventure',
    theme: 'Weather',
    title: 'Weather Watch',
    adventureTitle: 'Check the Weather',
    placePhrase: 'outside',
    keySentence: 'It is sunny today.',
    missionInstruction: 'Look outside and tell Vicky the weather.',
    missionSentence: 'It is sunny today.',
    vocabulary: [
      { emoji: '☀️', word: 'sunny', meaningZh: '晴朗的' },
      { emoji: '🌧️', word: 'rainy', meaningZh: '下雨的' },
      { emoji: '💨', word: 'windy', meaningZh: '有风的' },
      { emoji: '☁️', word: 'cloudy', meaningZh: '多云的' },
    ],
  },
  {
    dayIndex: 11,
    kind: 'adventure',
    theme: 'Colors',
    title: 'Color Hunt',
    adventureTitle: 'Find Colors',
    placePhrase: 'in the room',
    keySentence: 'I see something red.',
    missionInstruction: 'Count five blue things in your room.',
    missionSentence: 'I see five blue things.',
    vocabulary: [
      { emoji: '🔴', word: 'red', meaningZh: '红色' },
      { emoji: '🔵', word: 'blue', meaningZh: '蓝色' },
      { emoji: '🟢', word: 'green', meaningZh: '绿色' },
      { emoji: '🟡', word: 'yellow', meaningZh: '黄色' },
    ],
  },
  {
    dayIndex: 12,
    kind: 'adventure',
    theme: 'Numbers',
    title: 'Number Hunt',
    adventureTitle: 'Count Together',
    placePhrase: 'around us',
    keySentence: 'I can count to ten.',
    missionInstruction: 'Count ten small things with someone at home.',
    missionSentence: 'I can count to ten.',
    vocabulary: [
      { emoji: '1️⃣', word: 'one', meaningZh: '一' },
      { emoji: '2️⃣', word: 'two', meaningZh: '二' },
      { emoji: '3️⃣', word: 'three', meaningZh: '三' },
      { emoji: '🔟', word: 'ten', meaningZh: '十' },
    ],
  },
  {
    dayIndex: 13,
    kind: 'review',
    theme: 'Week 2 Review',
    title: 'Review Adventure',
    adventureTitle: 'Water Week 2 Memories',
    placePhrase: 'beside Summer’s fruit basket',
    keySentence: 'I remember food and colors.',
    missionInstruction: 'Say one food word and one color word at home.',
    missionSentence: 'I like apples and blue.',
    vocabulary: [
      { emoji: '🍎', word: 'apple', meaningZh: '苹果' },
      { emoji: '🥛', word: 'milk', meaningZh: '牛奶' },
      { emoji: '🔵', word: 'blue', meaningZh: '蓝色' },
      { emoji: '☀️', word: 'sunny', meaningZh: '晴朗的' },
    ],
  },
  {
    dayIndex: 14,
    kind: 'challenge',
    theme: 'Week 2 Challenge',
    title: 'Adventure Challenge',
    adventureTitle: 'Explorer Challenge 2',
    placePhrase: 'at Summer’s star path',
    keySentence: 'I can answer in English.',
    missionInstruction: 'Ask Vicky one English question from this week.',
    missionSentence: 'What fruit do you like?',
    vocabulary: [
      { emoji: '❓', word: 'question', meaningZh: '问题' },
      { emoji: '✅', word: 'answer', meaningZh: '回答' },
      { emoji: '⭐', word: 'star', meaningZh: '星星' },
      { emoji: '🧠', word: 'remember', meaningZh: '记得' },
    ],
  },
  {
    dayIndex: 15,
    kind: 'adventure',
    theme: 'Park',
    title: 'At the Park',
    adventureTitle: 'Walk in the Park',
    placePhrase: 'at the park',
    keySentence: 'I play on the slide.',
    missionInstruction: 'Tell someone one thing you can do at a park.',
    missionSentence: 'I play on the slide.',
    vocabulary: [
      { emoji: '🛝', word: 'slide', meaningZh: '滑梯' },
      { emoji: '🌳', word: 'tree', meaningZh: '树' },
      { emoji: '🪁', word: 'kite', meaningZh: '风筝' },
      { emoji: '🚶', word: 'walk', meaningZh: '走路' },
    ],
  },
  {
    dayIndex: 16,
    kind: 'adventure',
    theme: 'Beach',
    title: 'At the Beach',
    adventureTitle: 'Build a Sandcastle',
    placePhrase: 'at the beach',
    keySentence: 'I see the sea.',
    missionInstruction: 'Draw a beach and say one beach sentence.',
    missionSentence: 'I see the sea.',
    vocabulary: [
      { emoji: '🌊', word: 'sea', meaningZh: '海' },
      { emoji: '🏖️', word: 'sand', meaningZh: '沙子' },
      { emoji: '🐚', word: 'shell', meaningZh: '贝壳' },
      { emoji: '☀️', word: 'sun', meaningZh: '太阳' },
    ],
  },
  {
    dayIndex: 17,
    kind: 'adventure',
    theme: 'Supermarket',
    title: 'At the Supermarket',
    adventureTitle: 'Shop for Food',
    placePhrase: 'at the supermarket',
    keySentence: 'I need some rice.',
    missionInstruction: 'Help name one thing on the shopping list.',
    missionSentence: 'I need some rice.',
    vocabulary: [
      { emoji: '🍚', word: 'rice', meaningZh: '米饭' },
      { emoji: '🧃', word: 'juice', meaningZh: '果汁' },
      { emoji: '🧺', word: 'basket', meaningZh: '篮子' },
      { emoji: '💰', word: 'money', meaningZh: '钱' },
    ],
  },
  {
    dayIndex: 18,
    kind: 'adventure',
    theme: 'Restaurant',
    title: 'At the Restaurant',
    adventureTitle: 'Order Lunch',
    placePhrase: 'at the restaurant',
    keySentence: 'I want noodles, please.',
    missionInstruction: 'At dinner, politely ask for one food.',
    missionSentence: 'I want noodles, please.',
    vocabulary: [
      { emoji: '📋', word: 'menu', meaningZh: '菜单' },
      { emoji: '🍜', word: 'noodles', meaningZh: '面条' },
      { emoji: '🥣', word: 'soup', meaningZh: '汤' },
      { emoji: '💧', word: 'water', meaningZh: '水' },
    ],
  },
  {
    dayIndex: 19,
    kind: 'adventure',
    theme: 'Doctor',
    title: 'At the Doctor',
    adventureTitle: 'Visit the Doctor',
    placePhrase: 'at the clinic',
    keySentence: 'My head hurts.',
    missionInstruction: 'Tell someone how you feel today.',
    missionSentence: 'I feel good today.',
    vocabulary: [
      { emoji: '🧑‍⚕️', word: 'doctor', meaningZh: '医生' },
      { emoji: '🙂', word: 'feel', meaningZh: '感觉' },
      { emoji: '🤕', word: 'head', meaningZh: '头' },
      { emoji: '😴', word: 'tired', meaningZh: '累的' },
    ],
  },
  {
    dayIndex: 20,
    kind: 'review',
    theme: 'Week 3 Review',
    title: 'Review Adventure',
    adventureTitle: 'Water Week 3 Memories',
    placePhrase: 'on Summer’s review trail',
    keySentence: 'I remember places.',
    missionInstruction: 'Say one place and one food sentence at home.',
    missionSentence: 'I want noodles at the restaurant.',
    vocabulary: [
      { emoji: '🛝', word: 'park', meaningZh: '公园' },
      { emoji: '🌊', word: 'beach', meaningZh: '海滩' },
      { emoji: '🍜', word: 'noodles', meaningZh: '面条' },
      { emoji: '🧑‍⚕️', word: 'doctor', meaningZh: '医生' },
    ],
  },
  {
    dayIndex: 21,
    kind: 'challenge',
    theme: 'Week 3 Challenge',
    title: 'Adventure Challenge',
    adventureTitle: 'Explorer Challenge 3',
    placePhrase: 'at Summer’s explorer bridge',
    keySentence: 'I can use English outside.',
    missionInstruction: 'Use one English sentence during a family errand.',
    missionSentence: 'I can use English outside.',
    vocabulary: [
      { emoji: '🧭', word: 'explorer', meaningZh: '探险者' },
      { emoji: '🌉', word: 'bridge', meaningZh: '桥' },
      { emoji: '🗣️', word: 'use', meaningZh: '使用' },
      { emoji: '🏠', word: 'outside', meaningZh: '外面' },
    ],
  },
  {
    dayIndex: 22,
    kind: 'adventure',
    theme: 'Airport',
    title: 'At the Airport',
    adventureTitle: 'Take a Plane',
    placePhrase: 'at the airport',
    keySentence: 'The plane is ready.',
    missionInstruction: 'Tell someone where you want to go.',
    missionSentence: 'I want to go to the airport.',
    vocabulary: [
      { emoji: '✈️', word: 'plane', meaningZh: '飞机' },
      { emoji: '🚪', word: 'gate', meaningZh: '登机口' },
      { emoji: '💺', word: 'seat', meaningZh: '座位' },
      { emoji: '🧳', word: 'bag', meaningZh: '包' },
    ],
  },
  {
    dayIndex: 23,
    kind: 'adventure',
    theme: 'Hotel',
    title: 'At the Hotel',
    adventureTitle: 'Find Our Room',
    placePhrase: 'at the hotel',
    keySentence: 'This is our room.',
    missionInstruction: 'Point to one thing in your room and name it.',
    missionSentence: 'This is our room.',
    vocabulary: [
      { emoji: '🏨', word: 'hotel', meaningZh: '酒店' },
      { emoji: '🚪', word: 'room', meaningZh: '房间' },
      { emoji: '🔑', word: 'key', meaningZh: '钥匙' },
      { emoji: '🛏️', word: 'bed', meaningZh: '床' },
    ],
  },
  {
    dayIndex: 24,
    kind: 'adventure',
    theme: 'Museum',
    title: 'At the Museum',
    adventureTitle: 'Explore a Museum',
    placePhrase: 'at the museum',
    keySentence: 'I see an old vase.',
    missionInstruction: 'Look at a picture and say what you see.',
    missionSentence: 'I see a picture.',
    vocabulary: [
      { emoji: '🏛️', word: 'museum', meaningZh: '博物馆' },
      { emoji: '🖼️', word: 'picture', meaningZh: '图片' },
      { emoji: '🏺', word: 'vase', meaningZh: '花瓶' },
      { emoji: '🕰️', word: 'old', meaningZh: '旧的' },
    ],
  },
  {
    dayIndex: 25,
    kind: 'adventure',
    theme: 'Camping',
    title: 'Camping Night',
    adventureTitle: 'Go Camping',
    placePhrase: 'at the campsite',
    keySentence: 'We sleep in a tent.',
    missionInstruction: 'Tell Gordon one thing you need for camping.',
    missionSentence: 'We need a tent.',
    vocabulary: [
      { emoji: '⛺', word: 'tent', meaningZh: '帐篷' },
      { emoji: '🔥', word: 'fire', meaningZh: '火' },
      { emoji: '🌲', word: 'forest', meaningZh: '森林' },
      { emoji: '🌙', word: 'night', meaningZh: '夜晚' },
    ],
  },
  {
    dayIndex: 26,
    kind: 'adventure',
    theme: 'Space',
    title: 'Space Trip',
    adventureTitle: 'Fly to Space',
    placePhrase: 'in space',
    keySentence: 'I see the moon.',
    missionInstruction: 'Look at the sky and say one space word.',
    missionSentence: 'I see the moon.',
    vocabulary: [
      { emoji: '🌙', word: 'moon', meaningZh: '月亮' },
      { emoji: '⭐', word: 'star', meaningZh: '星星' },
      { emoji: '🚀', word: 'rocket', meaningZh: '火箭' },
      { emoji: '🪐', word: 'planet', meaningZh: '行星' },
    ],
  },
  {
    dayIndex: 27,
    kind: 'adventure',
    theme: 'Music',
    title: 'Music Time',
    adventureTitle: 'Play Music',
    placePhrase: 'in music class',
    keySentence: 'I can sing a song.',
    missionInstruction: 'Sing one line or tap a rhythm and say it in English.',
    missionSentence: 'I can sing a song.',
    vocabulary: [
      { emoji: '🎵', word: 'song', meaningZh: '歌曲' },
      { emoji: '🥁', word: 'drum', meaningZh: '鼓' },
      { emoji: '🎹', word: 'piano', meaningZh: '钢琴' },
      { emoji: '💃', word: 'dance', meaningZh: '跳舞' },
    ],
  },
  {
    dayIndex: 28,
    kind: 'review',
    theme: 'Full Review',
    title: 'Full Review Adventure',
    adventureTitle: 'Water the Whole Journey',
    placePhrase: 'in Summer’s big memory garden',
    keySentence: 'I remember my journey.',
    missionInstruction: 'Choose three favorite words from the journey and say them.',
    missionSentence: 'I remember my journey.',
    vocabulary: [
      { emoji: '🌱', word: 'journey', meaningZh: '旅程' },
      { emoji: '🧠', word: 'remember', meaningZh: '记得' },
      { emoji: '🌸', word: 'grow', meaningZh: '成长' },
      { emoji: '⭐', word: 'favorite', meaningZh: '最喜欢的' },
    ],
  },
  {
    dayIndex: 29,
    kind: 'challenge',
    theme: 'Final Challenge',
    title: 'Final Challenge',
    adventureTitle: 'Final Explorer Challenge',
    placePhrase: 'at Summer’s final gate',
    keySentence: 'I can finish the journey.',
    missionInstruction: 'Tell Vicky one English sentence you can say now.',
    missionSentence: 'I can finish the journey.',
    vocabulary: [
      { emoji: '🏁', word: 'finish', meaningZh: '完成' },
      { emoji: '🧭', word: 'challenge', meaningZh: '挑战' },
      { emoji: '🌟', word: 'brave', meaningZh: '勇敢的' },
      { emoji: '🎉', word: 'proud', meaningZh: '自豪的' },
    ],
  },
  {
    dayIndex: 30,
    kind: 'graduation',
    theme: 'Graduation Day',
    title: 'Graduation Day',
    adventureTitle: 'Celebrate with Summer',
    placePhrase: 'at Summer’s celebration tree',
    keySentence: 'I can speak English every day.',
    missionInstruction: 'Tell your family one sentence from the 30-day journey.',
    missionSentence: 'I can speak English every day.',
    vocabulary: [
      { emoji: '🎓', word: 'graduate', meaningZh: '毕业' },
      { emoji: '🌞', word: 'Summer', meaningZh: '夏天' },
      { emoji: '🗣️', word: 'speak', meaningZh: '说' },
      { emoji: '🎉', word: 'celebrate', meaningZh: '庆祝' },
    ],
  },
];

export const summerGreetingMessages = [
  'Hi! I missed you. Ready for today’s adventure?',
  'Welcome back, explorer. Let’s listen first.',
  'I saved a warm adventure for you today.',
  'Come in. Today’s English path is ready.',
  'Hello! Let’s find one brave sentence together.',
  'I’m happy you came back. Shall we begin?',
  'Today we listen, speak, and grow a little.',
  'Your adventure map is waiting.',
  'Let’s open today’s English door.',
  'I brought a gentle challenge for you.',
  'Take a deep breath. I’ll guide you.',
  'Good to see you. Let’s say English together.',
  'Today’s words are ready to meet you.',
  'I have a story and a mission for you.',
  'Let’s make English part of today.',
  'Your Memory Garden is growing.',
  'Step by step, we’ll finish this adventure.',
  'I’m here. You can try slowly.',
  'Let’s make one sentence feel easy.',
  'Ready to explore with me?',
];

export const summerCelebrationMessages = [
  'You finished today’s adventure. I’m proud of you.',
  'You listened carefully and spoke bravely.',
  'Another adventure is growing in your memory.',
  'You used real English today.',
  'Great work. Your English garden is brighter.',
  'You stayed with the adventure until the end.',
  'I heard brave English from you today.',
  'One more day, one more step forward.',
  'You made today’s words your friends.',
  'Your story voice is getting stronger.',
  'You completed the mission path.',
  'That was a warm English adventure.',
  'You tried, repeated, and grew.',
  'I’m saving this adventure in our journey.',
  'Your explorer heart did well today.',
  'Today’s sentence can go home with you.',
  'You turned practice into a real adventure.',
  'I’m glad we learned together today.',
  'Your Memory Garden has new seeds.',
  'Come back soon for the next adventure.',
];

function slugText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function scheduledDateForDay(dayIndex: number) {
  const date = new Date(`${scheduledDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + dayIndex - 1);
  return date.toISOString().slice(0, 10);
}

function createThemePlan(learner: Learner, day: CurriculumDay): ThemePlan {
  const firstWord = day.vocabulary[0];
  const secondWord = day.vocabulary[1];
  const thirdWord = day.vocabulary[2];
  const fourthWord = day.vocabulary[3];
  const titleSlug = slugText(day.title);
  const welcomeMessage =
    summerGreetingMessages[(day.dayIndex - 1) % summerGreetingMessages.length];
  const celebrationMessage =
    summerCelebrationMessages[
      (day.dayIndex - 1) % summerCelebrationMessages.length
    ];
  const listeningDialogue = [
    {
      speaker: 'companion' as const,
      text: `Today we are ${day.placePhrase}. Listen for the word ${firstWord.word}.`,
      chineseHint: `听一听 ${firstWord.meaningZh} 这个词。`,
    },
    {
      speaker: 'learner' as const,
      text: `I hear ${firstWord.word}.`,
      chineseHint: `我听到了 ${firstWord.meaningZh}。`,
    },
  ];
  const storySentences = [
    `Mia goes ${day.placePhrase} with Summer.`,
    `Summer shows Mia the ${firstWord.word} and the ${secondWord.word}.`,
    `Mia says, "${day.keySentence}"`,
    `At home, Mia says, "${day.missionSentence}"`,
  ];
  const conversationQuestion =
    day.kind === 'challenge'
      ? 'What English sentence can you say bravely today?'
      : day.kind === 'review'
        ? 'Which word do you remember best today?'
        : `What do you see ${day.placePhrase}?`;

  return {
    id: `theme_${titleSlug}_day_${day.dayIndex}_${learner.id}`,
    learnerId: learner.id,
    dayIndex: day.dayIndex,
    title: day.title,
    adventureTitle: day.adventureTitle,
    theme: day.theme,
    status: day.dayIndex === 1 ? 'active' : 'planned',
    targetLevel: learner.currentLevel,
    estimatedMinutes: learner.dailyGoalMinutes,
    generatedBy: 'template',
    content: {
      theme: day.theme,
      summerWelcome: {
        message: welcomeMessage,
        messages: summerGreetingMessages,
        voice: {
          text: `${welcomeMessage} Today we are ${day.placePhrase}.`,
        },
      },
      listening: {
        dialogue: listeningDialogue,
        voice: {
          text: listeningDialogue.map((turn) => turn.text).join(' '),
        },
        question: `What word does Summer ask you to listen for?`,
        choices: [
          firstWord.word,
          thirdWord.word,
          day.kind === 'challenge' ? 'test' : fourthWord.word,
        ],
        answer: firstWord.word,
      },
      speaking: {
        repeatWords: day.vocabulary.map((word) => word.word),
        repeatSentences: [
          day.keySentence,
          day.missionSentence,
          `I can say ${firstWord.word}.`,
        ],
      },
      warmup: [
        welcomeMessage,
        `Today we are ${day.placePhrase}.`,
        `I am ready for Day ${day.dayIndex}.`,
      ],
      conversation: [
        {
          speaker: 'companion',
          text: conversationQuestion,
          chineseHint: '请大声回答 Summer 的问题。',
        },
        {
          speaker: 'learner',
          text: day.missionSentence,
          chineseHint: '手动完成回答即可。',
        },
      ],
      usefulSentences: [
        day.keySentence,
        `I see a ${firstWord.word}.`,
        `The ${secondWord.word} is here.`,
        day.missionSentence,
      ],
      vocabulary: day.vocabulary.map((item, index) => ({
        id: `vocab_${slugText(item.word)}_${day.dayIndex}_${learner.id}`,
        emoji: item.emoji,
        word: item.word,
        meaning: item.meaningZh,
        meaningZh: item.meaningZh,
        voice: item.word,
        example: index === 0 ? day.keySentence : `I see a ${item.word}.`,
        difficulty: item.difficulty ?? 2,
      })),
      story: {
        title: `${day.theme} Story`,
        sentences: storySentences,
        paragraphs: storySentences,
        questions: [
          {
            id: `story_question_${titleSlug}_${learner.id}`,
            question: `What does Mia hear ${day.placePhrase}?`,
            options: [
              firstWord.word,
              thirdWord.word,
              fourthWord.word,
            ],
            answer: firstWord.word,
          },
        ],
      },
      storyV2: {
        title: `${day.theme} Story`,
        sentences: storySentences,
      },
      shadowing: [
        day.keySentence,
        day.missionSentence,
        `I can say ${firstWord.word}.`,
      ],
      mission: {
        id: `mission_${titleSlug}_${learner.id}`,
        instruction: day.missionInstruction,
        exampleSentence: day.missionSentence,
        status: 'pending',
      },
      missionV2: {
        instruction: day.missionInstruction,
        exampleSentence: day.missionSentence,
        familyConnection: 'Use this sentence with someone at home today.',
      },
      celebration: {
        message: celebrationMessage,
        messages: summerCelebrationMessages,
      },
    },
    createdAt,
    scheduledDate: scheduledDateForDay(day.dayIndex),
  };
}

export const mockThemePlans: ThemePlan[] = mockLearners.flatMap((learner) =>
  curriculumDays.map((day) => createThemePlan(learner, day)),
);
export const mockThemePlan = mockThemePlans[0];

function reconcileMockLearners(existingLearners: Learner[]) {
  const learnerById = new Map(mockLearners.map((learner) => [learner.id, learner]));

  return existingLearners.map((learner) => {
    const mockLearner = learnerById.get(learner.id);

    if (!mockLearner) {
      return learner;
    }

    return {
      ...learner,
      age: mockLearner.age,
      updatedAt: mockLearner.updatedAt,
    };
  });
}

function mergeVocabularyItems(
  existingVocabulary: ThemeContent['vocabulary'] | undefined,
  templateVocabulary: ThemeContent['vocabulary'],
) {
  if (!existingVocabulary?.length) {
    return templateVocabulary;
  }

  return existingVocabulary.map((item, index) => {
    const templateItem = templateVocabulary[index];

    return {
      ...templateItem,
      ...item,
      emoji: item.emoji ?? templateItem?.emoji,
      meaning: item.meaning ?? item.meaningZh ?? templateItem?.meaning,
      meaningZh: item.meaningZh ?? item.meaning ?? templateItem?.meaningZh,
      voice: item.voice ?? item.word,
    };
  });
}

function mergeStoryContent(
  existingStory: ThemeContent['story'] | undefined,
  templateStory: ThemeContent['story'],
) {
  if (!existingStory) {
    return templateStory;
  }

  const sentences = existingStory.sentences?.length
    ? existingStory.sentences
    : existingStory.paragraphs?.length
      ? existingStory.paragraphs
      : templateStory.sentences;
  const paragraphs = existingStory.paragraphs?.length
    ? existingStory.paragraphs
    : sentences;

  return {
    ...templateStory,
    ...existingStory,
    sentences,
    paragraphs,
    questions: existingStory.questions?.length
      ? existingStory.questions
      : templateStory.questions,
  };
}

function mergeThemeContent(
  existingContent: Partial<ThemeContent> | undefined,
  templateContent: ThemeContent,
): ThemeContent {
  return {
    ...templateContent,
    ...existingContent,
    theme: existingContent?.theme ?? templateContent.theme,
    summerWelcome:
      existingContent?.summerWelcome ?? templateContent.summerWelcome,
    listening: existingContent?.listening ?? templateContent.listening,
    speaking: existingContent?.speaking ?? templateContent.speaking,
    warmup: existingContent?.warmup?.length
      ? existingContent.warmup
      : templateContent.warmup,
    conversation: existingContent?.conversation?.length
      ? existingContent.conversation
      : templateContent.conversation,
    usefulSentences: existingContent?.usefulSentences?.length
      ? existingContent.usefulSentences
      : templateContent.usefulSentences,
    vocabulary: mergeVocabularyItems(
      existingContent?.vocabulary,
      templateContent.vocabulary,
    ),
    story: mergeStoryContent(existingContent?.story, templateContent.story),
    storyV2: existingContent?.storyV2 ?? templateContent.storyV2,
    shadowing: existingContent?.shadowing?.length
      ? existingContent.shadowing
      : templateContent.shadowing,
    mission: existingContent?.mission ?? templateContent.mission,
    missionV2: existingContent?.missionV2 ?? templateContent.missionV2,
    celebration: existingContent?.celebration ?? templateContent.celebration,
  };
}

function reconcileThemePlans(existingThemePlans: ThemePlan[]) {
  const validPlans = existingThemePlans.filter((plan) => plan.learnerId);
  const templateById = new Map(mockThemePlans.map((plan) => [plan.id, plan]));
  const mergedPlans = validPlans.map((plan) => {
    const template = templateById.get(plan.id);

    if (!template) {
      return plan;
    }

    return {
      ...template,
      ...plan,
      content: mergeThemeContent(plan.content, template.content),
    };
  });
  const existingPlanIds = new Set(mergedPlans.map((plan) => plan.id));
  const missingMockPlans = mockThemePlans.filter(
    (plan) => !existingPlanIds.has(plan.id),
  );

  return [...mergedPlans, ...missingMockPlans];
}

export function seedAppData() {
  if (typeof window === 'undefined') {
    return;
  }

  if (!window.localStorage.getItem(storageKeys.family)) {
    saveJson(storageKeys.family, mockFamily);
  }

  const existingLearners = loadJson<Learner[]>(storageKeys.learners, []);
  if (existingLearners.length === 0) {
    saveJson(storageKeys.learners, mockLearners);
  } else {
    saveJson(storageKeys.learners, reconcileMockLearners(existingLearners));
  }

  if (loadJson<Companion[]>(storageKeys.companions, []).length === 0) {
    saveJson(storageKeys.companions, mockCompanions);
  }

  if (loadJson<LearnerProfile[]>(storageKeys.learnerProfiles, []).length === 0) {
    saveJson(storageKeys.learnerProfiles, mockProfiles);
  }

  const existingThemePlans = loadJson<ThemePlan[]>(storageKeys.themePlans, []);
  if (existingThemePlans.length === 0) {
    saveJson(storageKeys.themePlans, mockThemePlans);
  } else {
    saveJson(storageKeys.themePlans, reconcileThemePlans(existingThemePlans));
  }
}
