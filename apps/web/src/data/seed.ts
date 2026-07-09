import type {
  Companion,
  Family,
  Learner,
  LearnerProfile,
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
  word: string;
  meaningZh: string;
  difficulty?: 1 | 2 | 3 | 4 | 5;
};

type CurriculumDay = {
  dayIndex: number;
  theme: string;
  title: string;
  adventureTitle: string;
  placePhrase: string;
  keySentence: string;
  missionPrompt: string;
  vocabulary: CurriculumWord[];
};

const curriculumDays: CurriculumDay[] = [
  {
    dayIndex: 1,
    theme: 'Farm',
    title: 'At the Farm',
    adventureTitle: "Let's Visit the Farm",
    placePhrase: 'on the farm',
    keySentence: 'I see a cow.',
    missionPrompt: 'What animal do you like?',
    vocabulary: [
      { word: 'cow', meaningZh: '奶牛', difficulty: 1 },
      { word: 'horse', meaningZh: '马', difficulty: 2 },
      { word: 'duck', meaningZh: '鸭子', difficulty: 1 },
      { word: 'pig', meaningZh: '猪', difficulty: 1 },
    ],
  },
  {
    dayIndex: 2,
    theme: 'Zoo',
    title: 'At the Zoo',
    adventureTitle: "Let's Visit the Zoo",
    placePhrase: 'at the zoo',
    keySentence: 'I like the lion.',
    missionPrompt: 'What zoo animal do you like?',
    vocabulary: [
      { word: 'lion', meaningZh: '狮子', difficulty: 2 },
      { word: 'monkey', meaningZh: '猴子', difficulty: 2 },
      { word: 'elephant', meaningZh: '大象', difficulty: 2 },
      { word: 'panda', meaningZh: '熊猫', difficulty: 1 },
    ],
  },
  {
    dayIndex: 3,
    theme: 'Birthday Party',
    title: 'Birthday Party',
    adventureTitle: 'Plan a Birthday Party',
    placePhrase: 'at the party',
    keySentence: 'Happy birthday to you.',
    missionPrompt: 'Whose birthday is next?',
    vocabulary: [
      { word: 'cake', meaningZh: '蛋糕' },
      { word: 'candle', meaningZh: '蜡烛' },
      { word: 'gift', meaningZh: '礼物' },
      { word: 'party', meaningZh: '派对' },
    ],
  },
  {
    dayIndex: 4,
    theme: 'School',
    title: 'At School',
    adventureTitle: 'A Day at School',
    placePhrase: 'at school',
    keySentence: 'I have a book.',
    missionPrompt: 'What do you have in your bag?',
    vocabulary: [
      { word: 'book', meaningZh: '书' },
      { word: 'pencil', meaningZh: '铅笔' },
      { word: 'desk', meaningZh: '书桌' },
      { word: 'teacher', meaningZh: '老师' },
    ],
  },
  {
    dayIndex: 5,
    theme: 'Family',
    title: 'My Family',
    adventureTitle: 'Meet My Family',
    placePhrase: 'at home',
    keySentence: 'This is my family.',
    missionPrompt: 'Who is in our family?',
    vocabulary: [
      { word: 'mother', meaningZh: '妈妈' },
      { word: 'father', meaningZh: '爸爸' },
      { word: 'sister', meaningZh: '姐妹' },
      { word: 'brother', meaningZh: '兄弟' },
    ],
  },
  {
    dayIndex: 6,
    theme: 'Breakfast',
    title: 'Breakfast Time',
    adventureTitle: 'Make Breakfast',
    placePhrase: 'at breakfast',
    keySentence: 'I want some milk.',
    missionPrompt: 'What do you want for breakfast?',
    vocabulary: [
      { word: 'milk', meaningZh: '牛奶' },
      { word: 'bread', meaningZh: '面包' },
      { word: 'egg', meaningZh: '鸡蛋' },
      { word: 'banana', meaningZh: '香蕉' },
    ],
  },
  {
    dayIndex: 7,
    theme: 'Fruits',
    title: 'Fruit Stand',
    adventureTitle: 'Choose Fresh Fruit',
    placePhrase: 'at the fruit stand',
    keySentence: 'I like apples.',
    missionPrompt: 'What fruit do you like?',
    vocabulary: [
      { word: 'apple', meaningZh: '苹果' },
      { word: 'orange', meaningZh: '橙子' },
      { word: 'grape', meaningZh: '葡萄' },
      { word: 'pear', meaningZh: '梨' },
    ],
  },
  {
    dayIndex: 8,
    theme: 'Weather',
    title: 'Weather Watch',
    adventureTitle: 'Check the Weather',
    placePhrase: 'outside',
    keySentence: 'It is sunny today.',
    missionPrompt: 'How is the weather today?',
    vocabulary: [
      { word: 'sunny', meaningZh: '晴朗的' },
      { word: 'rainy', meaningZh: '下雨的' },
      { word: 'windy', meaningZh: '有风的' },
      { word: 'cloudy', meaningZh: '多云的' },
    ],
  },
  {
    dayIndex: 9,
    theme: 'Colors',
    title: 'Color Hunt',
    adventureTitle: 'Find Colors',
    placePhrase: 'in the room',
    keySentence: 'I see something red.',
    missionPrompt: 'What color can you see?',
    vocabulary: [
      { word: 'red', meaningZh: '红色' },
      { word: 'blue', meaningZh: '蓝色' },
      { word: 'green', meaningZh: '绿色' },
      { word: 'yellow', meaningZh: '黄色' },
    ],
  },
  {
    dayIndex: 10,
    theme: 'Numbers',
    title: 'Number Hunt',
    adventureTitle: 'Count Together',
    placePhrase: 'around us',
    keySentence: 'I can count to ten.',
    missionPrompt: 'How many toys can you count?',
    vocabulary: [
      { word: 'one', meaningZh: '一' },
      { word: 'two', meaningZh: '二' },
      { word: 'three', meaningZh: '三' },
      { word: 'ten', meaningZh: '十' },
    ],
  },
  {
    dayIndex: 11,
    theme: 'Clothes',
    title: 'Getting Dressed',
    adventureTitle: 'Pick Clothes',
    placePhrase: 'by the closet',
    keySentence: 'I wear a shirt.',
    missionPrompt: 'What are you wearing?',
    vocabulary: [
      { word: 'shirt', meaningZh: '衬衫' },
      { word: 'pants', meaningZh: '裤子' },
      { word: 'shoes', meaningZh: '鞋子' },
      { word: 'hat', meaningZh: '帽子' },
    ],
  },
  {
    dayIndex: 12,
    theme: 'Toys',
    title: 'Toy Box',
    adventureTitle: 'Open the Toy Box',
    placePhrase: 'near the toy box',
    keySentence: 'This is my ball.',
    missionPrompt: 'What toy do you like?',
    vocabulary: [
      { word: 'ball', meaningZh: '球' },
      { word: 'doll', meaningZh: '娃娃' },
      { word: 'car', meaningZh: '小汽车' },
      { word: 'block', meaningZh: '积木' },
    ],
  },
  {
    dayIndex: 13,
    theme: 'Sports',
    title: 'Sports Day',
    adventureTitle: 'Play a Sport',
    placePhrase: 'on the field',
    keySentence: 'I can run fast.',
    missionPrompt: 'What sport can you play?',
    vocabulary: [
      { word: 'run', meaningZh: '跑' },
      { word: 'jump', meaningZh: '跳' },
      { word: 'swim', meaningZh: '游泳' },
      { word: 'kick', meaningZh: '踢' },
    ],
  },
  {
    dayIndex: 14,
    theme: 'Park',
    title: 'At the Park',
    adventureTitle: 'Walk in the Park',
    placePhrase: 'at the park',
    keySentence: 'I play on the slide.',
    missionPrompt: 'What can you do at the park?',
    vocabulary: [
      { word: 'slide', meaningZh: '滑梯' },
      { word: 'swing', meaningZh: '秋千' },
      { word: 'tree', meaningZh: '树' },
      { word: 'bench', meaningZh: '长椅' },
    ],
  },
  {
    dayIndex: 15,
    theme: 'Beach',
    title: 'At the Beach',
    adventureTitle: 'Build a Sandcastle',
    placePhrase: 'at the beach',
    keySentence: 'I see the sea.',
    missionPrompt: 'What can you see at the beach?',
    vocabulary: [
      { word: 'sea', meaningZh: '海' },
      { word: 'sand', meaningZh: '沙子' },
      { word: 'shell', meaningZh: '贝壳' },
      { word: 'wave', meaningZh: '海浪' },
    ],
  },
  {
    dayIndex: 16,
    theme: 'Supermarket',
    title: 'At the Supermarket',
    adventureTitle: 'Shop for Food',
    placePhrase: 'at the supermarket',
    keySentence: 'I need some rice.',
    missionPrompt: 'What do we need to buy?',
    vocabulary: [
      { word: 'rice', meaningZh: '米饭' },
      { word: 'juice', meaningZh: '果汁' },
      { word: 'basket', meaningZh: '篮子' },
      { word: 'money', meaningZh: '钱' },
    ],
  },
  {
    dayIndex: 17,
    theme: 'Restaurant',
    title: 'At the Restaurant',
    adventureTitle: 'Order Lunch',
    placePhrase: 'at the restaurant',
    keySentence: 'I want noodles, please.',
    missionPrompt: 'What would you like to eat?',
    vocabulary: [
      { word: 'menu', meaningZh: '菜单' },
      { word: 'noodles', meaningZh: '面条' },
      { word: 'soup', meaningZh: '汤' },
      { word: 'water', meaningZh: '水' },
    ],
  },
  {
    dayIndex: 18,
    theme: 'Doctor',
    title: 'At the Doctor',
    adventureTitle: 'Visit the Doctor',
    placePhrase: 'at the clinic',
    keySentence: 'My head hurts.',
    missionPrompt: 'How do you feel today?',
    vocabulary: [
      { word: 'doctor', meaningZh: '医生' },
      { word: 'head', meaningZh: '头' },
      { word: 'hand', meaningZh: '手' },
      { word: 'tired', meaningZh: '累的' },
    ],
  },
  {
    dayIndex: 19,
    theme: 'Travel',
    title: 'Travel Day',
    adventureTitle: 'Pack a Bag',
    placePhrase: 'on a trip',
    keySentence: 'I pack my bag.',
    missionPrompt: 'What do you pack for a trip?',
    vocabulary: [
      { word: 'bag', meaningZh: '包' },
      { word: 'map', meaningZh: '地图' },
      { word: 'ticket', meaningZh: '票' },
      { word: 'camera', meaningZh: '相机' },
    ],
  },
  {
    dayIndex: 20,
    theme: 'Hotel',
    title: 'At the Hotel',
    adventureTitle: 'Find Our Room',
    placePhrase: 'at the hotel',
    keySentence: 'This is our room.',
    missionPrompt: 'What is in the room?',
    vocabulary: [
      { word: 'hotel', meaningZh: '酒店' },
      { word: 'room', meaningZh: '房间' },
      { word: 'key', meaningZh: '钥匙' },
      { word: 'bed', meaningZh: '床' },
    ],
  },
  {
    dayIndex: 21,
    theme: 'Airport',
    title: 'At the Airport',
    adventureTitle: 'Take a Plane',
    placePhrase: 'at the airport',
    keySentence: 'The plane is ready.',
    missionPrompt: 'Where do you want to go?',
    vocabulary: [
      { word: 'plane', meaningZh: '飞机' },
      { word: 'gate', meaningZh: '登机口' },
      { word: 'seat', meaningZh: '座位' },
      { word: 'passport', meaningZh: '护照' },
    ],
  },
  {
    dayIndex: 22,
    theme: 'Library',
    title: 'At the Library',
    adventureTitle: 'Choose a Book',
    placePhrase: 'at the library',
    keySentence: 'I read a story.',
    missionPrompt: 'What book do you like?',
    vocabulary: [
      { word: 'library', meaningZh: '图书馆' },
      { word: 'story', meaningZh: '故事' },
      { word: 'quiet', meaningZh: '安静的' },
      { word: 'page', meaningZh: '页' },
    ],
  },
  {
    dayIndex: 23,
    theme: 'Music',
    title: 'Music Time',
    adventureTitle: 'Play Music',
    placePhrase: 'in music class',
    keySentence: 'I can sing a song.',
    missionPrompt: 'What song can you sing?',
    vocabulary: [
      { word: 'song', meaningZh: '歌曲' },
      { word: 'drum', meaningZh: '鼓' },
      { word: 'piano', meaningZh: '钢琴' },
      { word: 'dance', meaningZh: '跳舞' },
    ],
  },
  {
    dayIndex: 24,
    theme: 'Animal Review',
    title: 'Animal Review',
    adventureTitle: 'Review Animal Friends',
    placePhrase: 'with animal cards',
    keySentence: 'My favorite animal is a panda.',
    missionPrompt: 'What is your favorite animal?',
    vocabulary: [
      { word: 'animal', meaningZh: '动物' },
      { word: 'favorite', meaningZh: '最喜欢的' },
      { word: 'small', meaningZh: '小的' },
      { word: 'big', meaningZh: '大的' },
    ],
  },
  {
    dayIndex: 25,
    theme: 'Seasons',
    title: 'Four Seasons',
    adventureTitle: 'Choose a Season',
    placePhrase: 'through the year',
    keySentence: 'I like spring.',
    missionPrompt: 'What season do you like?',
    vocabulary: [
      { word: 'spring', meaningZh: '春天' },
      { word: 'summer', meaningZh: '夏天' },
      { word: 'autumn', meaningZh: '秋天' },
      { word: 'winter', meaningZh: '冬天' },
    ],
  },
  {
    dayIndex: 26,
    theme: 'Festival',
    title: 'Festival Day',
    adventureTitle: 'Enjoy a Festival',
    placePhrase: 'at a festival',
    keySentence: 'We watch the lights.',
    missionPrompt: 'What do you do at a festival?',
    vocabulary: [
      { word: 'festival', meaningZh: '节日' },
      { word: 'light', meaningZh: '灯' },
      { word: 'family', meaningZh: '家人' },
      { word: 'happy', meaningZh: '开心的' },
    ],
  },
  {
    dayIndex: 27,
    theme: 'Space',
    title: 'Space Trip',
    adventureTitle: 'Fly to Space',
    placePhrase: 'in space',
    keySentence: 'I see the moon.',
    missionPrompt: 'What can you see in the sky?',
    vocabulary: [
      { word: 'moon', meaningZh: '月亮' },
      { word: 'star', meaningZh: '星星' },
      { word: 'rocket', meaningZh: '火箭' },
      { word: 'planet', meaningZh: '行星' },
    ],
  },
  {
    dayIndex: 28,
    theme: 'Museum',
    title: 'At the Museum',
    adventureTitle: 'Explore a Museum',
    placePhrase: 'at the museum',
    keySentence: 'I see an old vase.',
    missionPrompt: 'What can you see in a museum?',
    vocabulary: [
      { word: 'museum', meaningZh: '博物馆' },
      { word: 'picture', meaningZh: '图片' },
      { word: 'vase', meaningZh: '花瓶' },
      { word: 'old', meaningZh: '旧的' },
    ],
  },
  {
    dayIndex: 29,
    theme: 'Camping',
    title: 'Camping Night',
    adventureTitle: 'Go Camping',
    placePhrase: 'at the campsite',
    keySentence: 'We sleep in a tent.',
    missionPrompt: 'What do you need for camping?',
    vocabulary: [
      { word: 'tent', meaningZh: '帐篷' },
      { word: 'fire', meaningZh: '火' },
      { word: 'forest', meaningZh: '森林' },
      { word: 'night', meaningZh: '夜晚' },
    ],
  },
  {
    dayIndex: 30,
    theme: 'Adventure Review',
    title: 'Adventure Review',
    adventureTitle: 'Review the Journey',
    placePhrase: 'on our journey',
    keySentence: 'I can speak English every day.',
    missionPrompt: 'What English sentence can you say today?',
    vocabulary: [
      { word: 'adventure', meaningZh: '冒险' },
      { word: 'review', meaningZh: '复习' },
      { word: 'learn', meaningZh: '学习' },
      { word: 'brave', meaningZh: '勇敢的' },
    ],
  },
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
      warmup: [
        `Hello, ${day.theme}!`,
        `I am ${day.placePhrase}.`,
        `I am ready for Day ${day.dayIndex}.`,
      ],
      conversation: [
        {
          speaker: 'companion',
          text: `What do you see ${day.placePhrase}?`,
          chineseHint: '你看到了什么？',
        },
        {
          speaker: 'learner',
          text: `I see a ${firstWord.word}.`,
          chineseHint: `我看到了${firstWord.meaningZh}。`,
        },
        {
          speaker: 'companion',
          text: `Do you like the ${secondWord.word}?`,
          chineseHint: '你喜欢它吗？',
        },
        {
          speaker: 'learner',
          text: `Yes, I like the ${secondWord.word}.`,
          chineseHint: '是的，我喜欢它。',
        },
      ],
      usefulSentences: [
        day.keySentence,
        `I see a ${firstWord.word}.`,
        `The ${secondWord.word} is here.`,
        `Can I have the ${thirdWord.word}?`,
      ],
      vocabulary: day.vocabulary.map((item, index) => ({
        id: `vocab_${slugText(item.word)}_${day.dayIndex}_${learner.id}`,
        word: item.word,
        meaningZh: item.meaningZh,
        example: index === 0 ? day.keySentence : `I see a ${item.word}.`,
        difficulty: item.difficulty ?? 2,
      })),
      story: {
        title: `${day.theme} Story`,
        paragraphs: [
          `Mia goes ${day.placePhrase} with her family.`,
          `She sees a ${firstWord.word}, a ${secondWord.word}, and a ${thirdWord.word}.`,
          `She says, "${day.keySentence}"`,
        ],
        questions: [
          {
            id: `story_question_${titleSlug}_${learner.id}`,
            question: `What does Mia see ${day.placePhrase}?`,
            options: [
              `${day.theme} things`,
              'Only toys',
              `Only a ${fourthWord.word}`,
            ],
            answer: `${day.theme} things`,
          },
        ],
      },
      shadowing: [
        day.keySentence,
        `I see a ${firstWord.word}.`,
        `The ${secondWord.word} is here.`,
      ],
      mission: {
        id: `mission_${titleSlug}_${learner.id}`,
        instruction: `Ask someone at home: ${day.missionPrompt}`,
        exampleSentence: day.missionPrompt,
        status: 'pending',
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
      content: {
        warmup: plan.content?.warmup?.length
          ? plan.content.warmup
          : template.content.warmup,
        conversation: plan.content?.conversation?.length
          ? plan.content.conversation
          : template.content.conversation,
        usefulSentences: plan.content?.usefulSentences?.length
          ? plan.content.usefulSentences
          : template.content.usefulSentences,
        vocabulary: plan.content?.vocabulary?.length
          ? plan.content.vocabulary
          : template.content.vocabulary,
        story: plan.content?.story?.paragraphs?.length
          ? plan.content.story
          : template.content.story,
        shadowing: plan.content?.shadowing?.length
          ? plan.content.shadowing
          : template.content.shadowing,
        mission: plan.content?.mission ?? template.content.mission,
      },
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
