export type Lesson = {
  id: string;
  emoji: string;
  title: string;
  meta: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  words: string[];
};

export const LESSONS: Lesson[] = [
  {
    id: "home-row",
    emoji: "🌱",
    title: "Home Row Basics",
    meta: "Beginner · 4 min",
    difficulty: "beginner",
    words: [
      "asdf","jkl","asdf","jkl","dad","sad","lad","fad","jak","ask","lass","fall",
      "salad","dadas","kalds","jaffa","saddle","flask","slash","ajars","flask","daks",
      "asks","alfalfa","skald","jasks","alas","fads","jadas","skass",
    ],
  },
  {
    id: "vowels",
    emoji: "🌲",
    title: "Forest of Vowels",
    meta: "Beginner · 6 min",
    difficulty: "beginner",
    words: [
      "moss","leaf","tree","wind","oak","fern","bird","stone","river","bloom",
      "quiet","light","green","gentle","earth","root","branch","seed","moon","sun",
      "petal","grove","willow","ivy","mist","glow","brook","trail","field","sky",
    ],
  },
  {
    id: "punctuation",
    emoji: "☕",
    title: "Café Punctuation",
    meta: "Intermediate · 8 min",
    difficulty: "intermediate",
    words: [
      "hello,","world!","it's","don't","can't","won't","they're","you're","i'll","we've",
      "coffee.","tea?","sugar;","cream:","menu.","order!","please?","thanks!","yes,","no.",
      "rain,","quiet.","cozy!","sip;","warm,","soft.","glow!","calm?","still,","bright.",
    ],
  },
  {
    id: "symbols",
    emoji: "🏰",
    title: "Castle of Symbols",
    meta: "Advanced · 12 min",
    difficulty: "advanced",
    words: [
      "@user","#tag","$100","%off","&co","*star","(begin)","[note]","{set}","<tag>",
      "key=val","a+b","x-y","p/q","2*3","n!=0","x==y","a|b","c&d","r^2",
      "/path","~home","`code`","\"quote\"","'word'","\\esc","->","<-","=>","::",
    ],
  },
  {
    id: "numbers",
    emoji: "🔢",
    title: "Number Drill",
    meta: "Intermediate · 5 min",
    difficulty: "intermediate",
    words: [
      "123","456","789","101","202","303","404","505","606","707",
      "1024","2048","3141","1618","2718","9999","1234","5678","8675309","42",
      "11","22","33","44","55","66","77","88","99","00",
    ],
  },
  {
    id: "common-words",
    emoji: "📚",
    title: "Common Words",
    meta: "Beginner · 6 min",
    difficulty: "beginner",
    words: [
      "the","of","and","to","in","a","is","that","it","for",
      "was","with","as","be","on","not","this","by","at","have",
      "from","or","one","had","but","what","all","were","when","we",
    ],
  },
];
