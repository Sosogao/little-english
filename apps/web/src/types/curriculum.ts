export type CurriculumVoiceCue = {
  text: string;
};

export type CurriculumDialogueTurn = {
  speaker: 'companion' | 'learner';
  text: string;
  chineseHint?: string;
};

export type CurriculumWelcome = {
  message: string;
  messages: string[];
  voice: CurriculumVoiceCue;
};

export type CurriculumListening = {
  dialogue: CurriculumDialogueTurn[];
  voice: CurriculumVoiceCue;
  question: string;
  choices: string[];
  answer: string;
};

export type CurriculumSpeaking = {
  repeatWords: string[];
  repeatSentences: string[];
};

export type CurriculumStory = {
  title: string;
  sentences: string[];
};

export type CurriculumMission = {
  instruction: string;
  exampleSentence: string;
  familyConnection: string;
};

export type CurriculumCelebration = {
  message: string;
  messages: string[];
};

export type CurriculumV2Content = {
  theme: string;
  summerWelcome: CurriculumWelcome;
  listening: CurriculumListening;
  speaking: CurriculumSpeaking;
  storyV2: CurriculumStory;
  missionV2: CurriculumMission;
  celebration: CurriculumCelebration;
};
