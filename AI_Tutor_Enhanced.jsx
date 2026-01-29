import React, { useState, useRef, useEffect } from 'react';
import { Brain, BookOpen, MessageCircle, Sparkles, Target, Trophy, Zap, ChevronRight, ArrowLeft, Calendar, Award, TrendingUp, Send, CheckCircle, XCircle, Star, Lock, Unlock, Gift, User, GraduationCap, Rocket } from 'lucide-react';

const CompleteAITutorSystem = () => {
  // Global view state
  const [currentView, setCurrentView] = useState('onboarding'); 
  // Views: onboarding, landing, hub, chat, studybuddy, assignments, promptlab, weeks15, weeks610, glossary, achievements

  // ==========================================
  // USER PROFILE & GAMIFICATION STATE
  // ==========================================
  const [userProfile, setUserProfile] = useState({
    name: '',
    experienceLevel: '',
    learningStyle: '',
    primaryGoal: '',
    onboardingComplete: false
  });

  const [onboardingStep, setOnboardingStep] = useState(1);

  // Progress & Achievements
  const [completedModules, setCompletedModules] = useState({
    studybuddy: { attention: false, rag: false, mag7: false, tot: false, bias: false, agents: false, business: false },
    assignments: { assignment1: false, assignment2: false, assignment3: false, assignment4: false, assignment5: false, assignment6: false },
    weeks: { week1: false, week2: false, week3: false, week4: false, week5: false, week6: false, week7: false, week8: false, week9: false, week10: false },
    promptlab: false,
    glossary: false,
    chat: false
  });

  // Unlock codes system
  const [unlockedCodes, setUnlockedCodes] = useState([]);
  const [redeemedCodes, setRedeemedCodes] = useState([]);
  const [codeInput, setCodeInput] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeMessage, setCodeMessage] = useState('');
  const [showUnlockCelebration, setShowUnlockCelebration] = useState(false);
  const [celebrationCode, setCelebrationCode] = useState(null);

  // Secret unlock codes and their rewards
  const unlockCodes = {
    'ATTENTION': { name: 'Focus Master', reward: 'Dark Mode Pro Theme', icon: '🎯', module: 'attention', feature: 'darkMode' },
    'VECTOR42': { name: 'RAG Champion', reward: 'Flashcard Timer Mode', icon: '🔮', module: 'rag', feature: 'timerMode' },
    'MAG7HERO': { name: 'Prompt Wizard', reward: 'AI Detailed Responses', icon: '⚡', module: 'mag7', feature: 'detailedResponses' },
    'TREEOFAI': { name: 'Decision Master', reward: 'Expert Tips Panel', icon: '🌳', module: 'tot', feature: 'expertTips' },
    'ETHICAL1': { name: 'Ethics Guardian', reward: 'Bias Checker Tool', icon: '⚖️', module: 'bias', feature: 'biasChecker' },
    'AGENT007': { name: 'Agent Handler', reward: 'Agent Simulator', icon: '🤖', module: 'agents', feature: 'agentSim' },
    'BIZWIZ25': { name: 'Business Brain', reward: 'Case Study Library', icon: '💼', module: 'business', feature: 'caseStudies' },
    '1.618': { name: 'Golden Scholar', reward: 'Professor Mode + Golden Theme', icon: '✨', module: 'special', feature: 'professorMode' },
    'PROMPTPRO': { name: 'Lab Legend', reward: 'Prompt Templates Library', icon: '🧪', module: 'promptlab', feature: 'promptTemplates' },
    'ALLSTAR': { name: 'Course Champion', reward: 'Certificate Generator', icon: '🏆', module: 'complete', feature: 'certificate' }
  };

  // Unlocked features state
  const [unlockedFeatures, setUnlockedFeatures] = useState({
    darkMode: false,
    timerMode: false,
    detailedResponses: false,
    expertTips: false,
    biasChecker: false,
    agentSim: false,
    caseStudies: false,
    professorMode: false,
    promptTemplates: false,
    certificate: false
  });

  // Prompt templates (unlocked with PROMPTPRO)
  const promptTemplates = [
    {
      name: 'Marketing Campaign',
      prompt: `You are a senior marketing strategist with 15 years of experience in digital marketing and brand development.

Before creating the campaign, ask me 3 clarifying questions about:
1. My target audience
2. My budget constraints  
3. My key differentiators

Here are examples of successful campaigns I admire:
- Example 1: Nike's "Just Do It" - emotional connection
- Example 2: Apple's product launches - simplicity and exclusivity

Think through this step-by-step:
1. First, analyze the market opportunity
2. Then, identify the target segments
3. Finally, recommend specific tactics

Let's make this interactive - after each section, pause and ask if I want to go deeper or move on.

Format your response as:
| Phase | Action | Timeline | Expected Outcome |`
    },
    {
      name: 'Business Analysis',
      prompt: `You are a McKinsey-trained business consultant with expertise in strategic analysis and organizational transformation.

Before diving in, interview me with 5 questions to understand:
- The business challenge
- Current resources and constraints
- Stakeholder dynamics
- Timeline pressures
- Success metrics

Let's approach this like a case study game: Present me with 3 strategic options, I'll choose one, then you'll reveal the implications and next decision point.

Think through each recommendation step-by-step, showing your reasoning process.

Example format I've found helpful:
Problem: [X] → Root Cause: [Y] → Solution: [Z] → Impact: [$$$]

Structure your final deliverable as:
## Executive Summary
## Situation Analysis  
## Strategic Options
## Recommended Path Forward
## Implementation Roadmap`
    },
    {
      name: 'Learning New Skill',
      prompt: `You are an expert educator and learning coach who specializes in accelerated learning techniques and personalized instruction.

First, assess my current knowledge by asking me 3 diagnostic questions about the topic.

Based on my answers, create a customized learning path. Think through the optimal sequence step-by-step.

Make this engaging - let's gamify it:
- Each concept I master = 1 point
- Quiz me periodically
- Celebrate milestones with fun facts

Examples of good explanations:
- Use analogies I can relate to
- Start simple, add complexity gradually
- Connect new concepts to things I already know

Format each lesson as:
📚 Concept: [Name]
🎯 Learning Goal: [What I'll understand]
💡 Explanation: [Core content]
🔗 Real-world Application: [How it's used]
✅ Quick Check: [1-2 questions to test understanding]`
    },
    {
      name: 'Problem Solving',
      prompt: `You are a systems thinking expert and problem-solving facilitator with experience in design thinking and root cause analysis.

Before proposing solutions, help me properly define the problem by asking:
1. What's the observable symptom?
2. Who is affected and how?
3. What have I already tried?
4. What constraints exist?

Let's use the "5 Whys" technique together - I'll answer each why, and you dig deeper.

Think through this systematically:
Step 1: Define the problem clearly
Step 2: Identify root causes (not just symptoms)
Step 3: Generate multiple solution paths
Step 4: Evaluate trade-offs
Step 5: Recommend action plan

Example of good problem framing:
"The issue isn't [surface problem], it's actually [root cause] which manifests as [symptoms]"

Present your analysis as:
🔍 Problem Statement: 
🌳 Root Cause Tree:
💡 Solution Options (3):
⚖️ Trade-off Analysis:
✅ Recommended Action:`
    }
  ];

  // Case studies (unlocked with BIZWIZ25)
  const caseStudies = [
    {
      title: 'Netflix: AI-Powered Recommendations',
      industry: 'Entertainment',
      challenge: 'How to keep 200M+ subscribers engaged with personalized content',
      aiSolution: 'Machine learning recommendation engine analyzing viewing patterns, time of day, device, and even thumbnail preferences',
      results: '80% of watched content comes from recommendations, saving $1B+ annually in customer retention',
      lesson: 'AI can create hyper-personalization at scale that humans never could'
    },
    {
      title: 'JPMorgan: Contract Intelligence (COiN)',
      industry: 'Finance',
      challenge: 'Lawyers spending 360,000 hours annually reviewing loan agreements',
      aiSolution: 'NLP system that reads and extracts key data points from 12,000 commercial credit agreements',
      results: 'Reduced review time from 360,000 hours to seconds, with higher accuracy than human reviewers',
      lesson: 'AI excels at high-volume, pattern-based tasks that drain human resources'
    },
    {
      title: 'Starbucks: Deep Brew',
      industry: 'Retail/Food Service',
      challenge: 'Optimizing store operations, inventory, and personalized marketing across 30,000+ locations',
      aiSolution: 'AI platform handling inventory management, labor allocation, and personalized offers through the app',
      results: '400% increase in marketing offer redemption, optimized staffing saves millions annually',
      lesson: 'AI can coordinate complex operations across massive scale while personalizing individual experiences'
    },
    {
      title: 'Duolingo: AI Tutoring',
      industry: 'Education',
      challenge: 'Making language learning effective without human tutors',
      aiSolution: 'GPT-4 powered features: Explain My Answer, Roleplay scenarios, and adaptive difficulty',
      results: 'Premium subscriber growth accelerated, lesson completion rates improved significantly',
      lesson: 'AI can provide personalized tutoring experiences previously only available through expensive human instruction'
    }
  ];

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Study Buddy state
  const [studyView, setStudyView] = useState('dashboard');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [simpleExplanation, setSimpleExplanation] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [isShuffled, setIsShuffled] = useState(false);

  // Assignment state
  const [selectedAssignment, setSelectedAssignment] = useState('assignment2');

  // Prompt Lab state
  const [userPrompt, setUserPrompt] = useState('');

  // Week content state
  const [selectedWeek, setSelectedWeek] = useState('week1');

  // Glossary state
  const [glossarySearch, setGlossarySearch] = useState('');

  // Initialize chat with personalized greeting
  useEffect(() => {
    if (userProfile.onboardingComplete && chatMessages.length === 0) {
      const greeting = userProfile.name 
        ? `Hey ${userProfile.name}! 👋`
        : "Hey! 👋";
      
      const experienceText = userProfile.experienceLevel === 'beginner' 
        ? "I'll make sure to explain things clearly without too much jargon."
        : userProfile.experienceLevel === 'intermediate'
        ? "Since you have some AI experience, we can dive a bit deeper into concepts."
        : "Great that you have advanced experience - feel free to ask about complex topics!";

      setChatMessages([{
        role: 'assistant',
        content: `${greeting}\n\nI'm Max, your AI tutor for COLL.121. ${experienceText}\n\n**I can help with:**\n• The Magnificent Seven prompting strategies\n• RAG and retrieval concepts\n• Assignment breakdowns and tips\n• Anything from Prof. Akmal's lectures\n\nWhat would you like to work on?`
      }]);
    }
  }, [userProfile.onboardingComplete]);

  // Flashcard data
  const flashcards = {
    'attention': [
      { q: 'What is the attention mechanism?', a: 'A technique that lets AI focus on the most relevant parts of input - like how you tune into your name in a noisy room.' },
      { q: 'Why did attention revolutionize AI?', a: 'It lets models process entire sequences at once instead of word-by-word, making them much faster and better at understanding context.' },
      { q: 'What does "Attention is All You Need" refer to?', a: 'The famous 2017 paper that introduced transformers - proving attention alone (without older techniques) could power incredible AI.' },
      { q: 'How does attention help with long documents?', a: 'It creates connections between all words simultaneously, so the AI remembers the beginning when reading the end.' },
      { q: 'What are attention weights?', a: 'Numbers that show how much focus the AI puts on each word when processing another word - like a relevance score.' }
    ],
    'rag': [
      { q: 'What does RAG stand for?', a: 'Retrieval Augmented Generation - giving AI access to external knowledge before it answers.' },
      { q: 'Why is RAG better than just using ChatGPT?', a: 'RAG lets AI use YOUR specific documents and data, not just its training - so answers are accurate and up-to-date.' },
      { q: 'What is a vector database?', a: 'A special database that stores information as numbers (vectors) so AI can search by meaning, not just keywords.' },
      { q: 'What is an embedding?', a: 'Converting text into numbers that capture its meaning - similar ideas get similar numbers.' },
      { q: 'What is semantic search?', a: 'Finding information by meaning rather than exact words. "How do I return items?" finds "refund policy" even without matching words.' },
      { q: 'What are the 3 steps of RAG?', a: '1) Retrieve relevant docs from database, 2) Augment the prompt with that info, 3) Generate answer using the context.' }
    ],
    'mag7': [
      { q: 'What are the Magnificent Seven?', a: '7 prompting strategies: Persona, Clear Instructions, Examples, Sources, Your Knowledge, Steps, and Push Back.' },
      { q: 'What is the Persona pattern?', a: 'Telling AI who it is: "You are a senior marketing expert with 15 years experience..." - shapes how it responds.' },
      { q: 'What is Multi-shot prompting?', a: 'Giving multiple examples of what you want so AI learns the pattern. More examples = more consistent output.' },
      { q: 'What is Chain of Thought?', a: 'Asking AI to think step-by-step: "Let\'s work through this carefully..." - improves reasoning on complex problems.' },
      { q: 'What is the Flipped Interaction pattern?', a: 'Having AI ask YOU questions first to understand your needs before giving an answer.' },
      { q: 'What does "Push Back, Always" mean?', a: 'Never accept the first response! Ask for improvements, alternatives, or what was missed. Iteration is key.' },
      { q: 'Why combine multiple strategies?', a: 'Each strategy improves output differently. Combining them (persona + examples + steps) creates powerful, reliable prompts.' }
    ],
    'tot': [
      { q: 'What is Tree of Thought?', a: 'Exploring multiple solution paths like branches on a tree, then comparing them to find the best approach.' },
      { q: 'When should you use Tree of Thought?', a: 'For complex decisions with multiple valid approaches - strategy, problem-solving, creative work.' },
      { q: 'How do you prompt for Tree of Thought?', a: '"Let\'s explore 3 different approaches: Approach 1... Approach 2... Approach 3... Now compare and choose the best."' },
      { q: 'What is Expert Prompting?', a: 'Invoking specific expertise: "As a cybersecurity expert with 20 years experience..." for domain-specific accuracy.' }
    ],
    'bias': [
      { q: 'What is AI bias?', a: 'When AI reflects unfair prejudices from its training data - like a hiring AI discriminating based on historical patterns.' },
      { q: 'What is the alignment problem?', a: 'The challenge of making AI do what we actually want, not just what we literally asked for.' },
      { q: 'What is a hallucination in AI?', a: 'When AI confidently generates false information that sounds plausible but is completely made up.' },
      { q: 'How can businesses reduce AI bias?', a: 'Diverse training data, regular bias testing, human oversight, and transparency about AI limitations.' },
      { q: 'What is explainable AI (XAI)?', a: 'AI systems that can explain WHY they made a decision - critical for healthcare, legal, and financial applications.' }
    ],
    'agents': [
      { q: 'What is an AI agent?', a: 'An autonomous AI that can take actions, use tools, and work toward goals without constant human input.' },
      { q: 'What are the 3 stages of AI agents?', a: '1) Goal Initialization (break into subtasks), 2) Reasoning with Tools (use APIs/data), 3) Learning (improve from feedback).' },
      { q: 'What is an API?', a: 'Application Programming Interface - a bridge that lets different software talk to each other.' },
      { q: 'What is MCP?', a: 'Model Context Protocol - a framework for AI agents to share context and work together on complex tasks.' },
      { q: 'How are AI agents used in business?', a: 'Customer service bots, research assistants, automated workflows, data analysis, and process automation.' }
    ],
    'business': [
      { q: 'What is prompt engineering?', a: 'The skill of crafting inputs to AI systems to get better, more accurate, more useful outputs.' },
      { q: 'What is fine-tuning?', a: 'Further training a pre-built AI model on your specific data to customize it for your industry or use case.' },
      { q: 'What is zero-shot prompting?', a: 'Giving AI instructions with NO examples - quick but less consistent. Good for simple tasks.' },
      { q: 'What is one-shot prompting?', a: 'Giving ONE example of what you want. Shows the format but limited guidance.' },
      { q: 'What is the difference between GPT and transformer?', a: 'Transformer is the architecture (the blueprint). GPT is a specific model built using that architecture.' },
      { q: 'Why should you validate AI outputs?', a: 'AI can hallucinate, be biased, or miss context. Always fact-check important decisions - AI assists, humans decide.' }
    ]
  };

  // Descriptive topic names
  const topicNames = {
    'attention': 'Attention Mechanism & Transformers',
    'rag': 'RAG & Knowledge Retrieval',
    'mag7': 'The Magnificent Seven Strategies',
    'tot': 'Tree of Thought & Expert Prompting',
    'bias': 'AI Ethics, Bias & Alignment',
    'agents': 'AI Agents & Tools',
    'business': 'Business AI Fundamentals'
  };

  // Glossary data
  const glossary = [
    {
      term: 'Machine Learning (ML)',
      definition: 'A subset of AI that enables systems to learn from data, identify patterns, and make decisions with minimal human intervention.',
      application: 'ML drives business intelligence by powering demand forecasting, fraud detection, dynamic pricing, targeted marketing, customer segmentation, and process automation—helping organizations make data-driven, real-time decisions at scale.'
    },
    {
      term: 'AGI (Artificial General Intelligence)',
      definition: 'AI with the cognitive ability to understand, learn, and perform any intellectual task a human can.',
      application: 'AGI could function as an enterprise-wide strategist—capable of managing end-to-end business operations, automating complex decisions across departments (finance, supply chain, HR), and enabling innovation with human-level adaptability and reasoning.'
    },
    {
      term: 'ASI (Artificial Superintelligence)',
      definition: 'A level of intelligence far surpassing the most gifted human minds in all aspects—reasoning, creativity, and social intelligence.',
      application: 'ASI could autonomously optimize global business ecosystems, invent entirely new markets or products, and simulate macroeconomic outcomes—reshaping industries through superintelligent forecasting, innovation, and ethical governance at scale.'
    },
    {
      term: 'Referential Learning',
      definition: 'An AI learning model that improves decision-making by referencing and comparing prior experiences, datasets, or interactions.',
      application: 'Used in business to deliver hyper-personalized customer experiences, optimize decision workflows, and improve systems over time—referencing similar cases (e.g., customer profiles, sales patterns, or support tickets) to refine product recommendations, risk scoring, and strategic planning.'
    },
    {
      term: 'Recursive Self-Improvement',
      definition: 'The ability of an AI system to autonomously improve its own algorithms and performance through iterative self-analysis.',
      application: 'Businesses can deploy recursive AI systems in operations, cybersecurity, or financial analysis—enabling tools that continually upgrade themselves, boost accuracy, minimize human input, and adapt to evolving conditions without manual intervention.'
    },
    {
      term: 'Vibe Coding',
      definition: 'An emerging approach to development where you describe what you want in natural language and AI generates the code—coding by "vibes" rather than syntax.',
      application: 'Enables non-technical business users to build prototypes, automate workflows, and create tools without deep programming knowledge—democratizing software development.'
    },
    {
      term: 'API (Application Programming Interface)',
      definition: 'A set of rules that allows one software application to interact with another. It\'s like a "middleman" or bridge between systems.',
      application: 'APIs enable businesses to connect different tools (CRM, payment systems, AI services), automate data flows, and build integrated ecosystems without rebuilding everything from scratch.'
    },
    {
      term: 'MCP (Model Context Protocol)',
      definition: 'A framework or system-level specification for how different AI models or agents share and interpret context during tasks, conversations, or workflows.',
      application: 'Enables multi-agent AI systems to work together seamlessly, sharing context and coordinating on complex business tasks like research, analysis, and decision-making.'
    },
    {
      term: 'RAG (Retrieval Augmented Generation)',
      definition: 'A technique that gives AI access to external knowledge sources by retrieving relevant information before generating responses.',
      application: 'Powers business knowledge bases, customer support systems, and document Q&A—allowing AI to answer questions using your company\'s specific data and documents.'
    },
    {
      term: 'Vector Database',
      definition: 'A specialized database that stores information as numerical vectors (embeddings), enabling semantic search based on meaning rather than keywords.',
      application: 'Essential for RAG systems, recommendation engines, and similarity search—finding relevant content based on conceptual similarity rather than exact matches.'
    },
    {
      term: 'Embedding',
      definition: 'A numerical representation of text, images, or other data that captures semantic meaning in a format AI can process.',
      application: 'Enables semantic search, content recommendations, and clustering—converting business documents, products, or customer data into searchable, comparable vectors.'
    },
    {
      term: 'Transformer',
      definition: 'The neural network architecture behind modern AI like GPT and Claude, using attention mechanisms to process sequences of data.',
      application: 'Powers chatbots, content generation, translation, summarization, and code generation—the foundation of most modern business AI applications.'
    },
    {
      term: 'Attention Mechanism',
      definition: 'A technique that allows AI models to focus on relevant parts of input when processing information, weighing importance dynamically.',
      application: 'Enables AI to understand context in long documents, maintain coherent conversations, and focus on what matters most in complex business data.'
    },
    {
      term: 'Prompt Engineering',
      definition: 'The practice of designing and optimizing inputs to AI systems to get better, more accurate, and more useful outputs.',
      application: 'Critical business skill for getting maximum value from AI tools—well-crafted prompts can dramatically improve content quality, analysis accuracy, and task completion.'
    },
    {
      term: 'Fine-tuning',
      definition: 'The process of further training a pre-trained AI model on specific data to customize it for particular tasks or domains.',
      application: 'Allows businesses to create specialized AI models for their industry, terminology, and use cases—improving accuracy for domain-specific applications.'
    },
    {
      term: 'Hallucination',
      definition: 'When an AI generates false, fabricated, or nonsensical information that sounds plausible but is not accurate.',
      application: 'A key risk in business AI deployment—requires validation, fact-checking, and RAG implementations to ensure AI outputs are trustworthy for decision-making.'
    }
  ];

  const assignments = {
    assignment1: {
      title: 'Assignment 1: ML Quiz',
      desc: 'Introduction to Machine Learning',
      icon: '📝',
      sections: [
        {
          title: 'Key Topics to Study',
          type: 'list',
          items: ['What is Machine Learning?', 'Supervised vs Unsupervised Learning', 'Neural Networks basics', 'Transformers & Attention Mechanism']
        },
        {
          title: 'Practice Questions',
          type: 'numbered',
          items: ['What is the difference between supervised and unsupervised learning?', 'Explain the attention mechanism in transformers', 'What are the key components of a neural network?']
        },
        {
          title: 'Pro Tip',
          type: 'tip',
          content: 'Review Week 1 content thoroughly! Focus on understanding concepts, not memorizing definitions.'
        }
      ]
    },
    assignment2: {
      title: 'Assignment 2: 1st Prompting Assignment',
      desc: 'Practice The Magnificent Seven',
      icon: '🎯',
      sections: [
        {
          title: 'Your Mission',
          type: 'highlight',
          content: 'Apply ALL 7 prompting strategies to a real business scenario in one comprehensive prompt.'
        },
        {
          title: 'The Magnificent Seven',
          type: 'strategies',
          items: [
            { name: 'Persona Pattern', desc: 'Give AI a specific role', example: 'You are a senior marketing analyst...' },
            { name: 'Multi-Shot', desc: 'Provide multiple examples', example: 'Here are 3 examples of good responses...' },
            { name: 'Chain of Thought', desc: 'Ask for step-by-step reasoning', example: 'Let\'s think through this step by step...' },
            { name: 'ReAct', desc: 'Reasoning + Acting', example: 'Analyze this problem, then suggest actions...' },
            { name: 'Flipped Interaction', desc: 'Let AI ask YOU questions', example: 'Ask me questions to understand my needs...' },
            { name: 'Game Play', desc: 'Make it interactive/fun', example: 'Let\'s play a game where you\'re the customer...' },
            { name: 'Template', desc: 'Provide exact output format', example: 'Format your response as: Problem | Solution | Impact' }
          ]
        },
        {
          title: 'Requirements',
          type: 'checklist',
          items: ['Choose a business problem', 'Create 1 prompt using ALL 7 strategies', 'Minimum 500 words', 'Submit your prompt + AI\'s response']
        },
        {
          title: 'Grading Breakdown',
          type: 'grades',
          items: [
            { category: 'All 7 strategies used clearly', weight: '70%' },
            { category: 'Business relevance', weight: '20%' },
            { category: 'Quality of output', weight: '10%' }
          ]
        }
      ]
    },
    assignment3: {
      title: 'Assignment 3: Business FAQ',
      desc: 'Create FAQ using RAG concepts',
      icon: '💼',
      sections: [
        {
          title: 'Your Mission',
          type: 'highlight',
          content: 'Create a comprehensive FAQ for a business using multi-shot prompting and demonstrate RAG concepts.'
        },
        {
          title: 'What is RAG?',
          type: 'definition',
          term: 'Retrieval Augmented Generation',
          content: 'A technique that gives AI access to external knowledge sources, improving accuracy and relevance of responses.'
        },
        {
          title: '6 RAG Terms to Define',
          type: 'terms',
          items: [
            { term: 'Retrieval', def: 'Finding relevant information from a knowledge base' },
            { term: 'Augmented', def: 'Enhanced with external data' },
            { term: 'Generation', def: 'Creating the final response' },
            { term: 'Vector Database', def: 'Storage for searchable information' },
            { term: 'Embedding', def: 'Converting text to searchable format' },
            { term: 'Semantic Search', def: 'Finding by meaning, not just keywords' }
          ]
        },
        {
          title: 'Requirements',
          type: 'checklist',
          items: ['Pick a real or fictional business', 'Create 10+ FAQ questions', 'Use multi-shot prompting', 'Show how RAG would improve answers']
        },
        {
          title: 'Pro Tip',
          type: 'tip',
          content: 'Think about common customer questions. Include both technical and general questions. Show before/after comparisons with RAG.'
        }
      ]
    },
    assignment4: {
      title: 'Assignment 4: 2nd Prompting',
      desc: 'Advanced prompting techniques',
      icon: '⚡',
      sections: [
        {
          title: 'Your Mission',
          type: 'highlight',
          content: 'Choose 2 of 3 advanced techniques and apply them to a complex scenario.'
        },
        {
          title: 'Choose 2 Techniques',
          type: 'options',
          items: [
            { name: 'Multi-Shot Prompting', desc: 'Provide multiple examples to guide AI output patterns' },
            { name: 'Expert Prompting', desc: 'Invoke deep domain expertise for specialized answers' },
            { name: 'Chain-of-Thought', desc: 'Break down complex reasoning into logical steps' }
          ]
        },
        {
          title: 'Requirements',
          type: 'checklist',
          items: ['Select 2 techniques', 'Apply to a business scenario', 'Show clear before/after improvement', 'Explain why you chose each technique']
        }
      ]
    },
    assignment5: {
      title: 'Assignment 5: Teach Yourself',
      desc: 'Build your own AI tutor',
      icon: '🎓',
      sections: [
        {
          title: 'Your Mission',
          type: 'highlight',
          content: 'Build an AI tutor that knows its role, meets you where you are, and guides your learning journey.'
        },
        {
          title: 'Tutor Requirements',
          type: 'list',
          items: ['Knows its role (clear persona)', 'Assesses your current knowledge level', 'Adapts explanations to your needs', 'Uses Socratic questioning', 'Provides practice opportunities']
        },
        {
          title: 'Requirements',
          type: 'checklist',
          items: ['Choose a topic YOU want to learn', 'Design prompts for different learning modes', 'Document your learning journey', 'Show how the tutor adapted to you']
        },
        {
          title: 'Pro Tip',
          type: 'tip',
          content: 'This is YOUR chance to learn something you\'ve always wanted! Make it personal and meaningful.'
        }
      ]
    },
    assignment6: {
      title: 'Assignment 6: AI Business Plan',
      desc: 'Create an AI-powered business',
      icon: '🚀',
      sections: [
        {
          title: 'Your Mission',
          type: 'highlight',
          content: 'Write a 500-word essay analyzing ethical challenges and proposing an AI-powered business solution.'
        },
        {
          title: 'Include These Elements',
          type: 'list',
          items: ['Problem you\'re solving', 'AI solution and how it works', 'Business model', 'Market analysis', 'Ethical considerations']
        },
        {
          title: 'Requirements',
          type: 'checklist',
          items: ['500-word essay minimum', 'Reference course readings', 'Address ethical challenges', 'Propose realistic AI solution']
        },
        {
          title: 'Pro Tip',
          type: 'tip',
          content: 'Connect your ideas to concepts from multiple weeks. Show how the Magnificent Seven, RAG, and ethics all come together!'
        }
      ]
    }
  };

  // Week content data
  const weeks15 = {
    week1: {
      title: 'Week 1: Attention is All You Need',
      subtitle: 'Introduction to AI & Transformers',
      unlockCode: 'ATTENTION',
      content: `📚 **What is AI?**

Artificial Intelligence (AI) enables machines to perform tasks that typically require human intelligence - learning, understanding language, recognizing patterns, and making decisions.

**Key Concepts:**

**GPT & Large Language Models**
- GPT = Generative Pre-trained Transformer
- Trained on massive amounts of text data
- Can generate human-like text
- Understanding context is crucial

**The Transformer Architecture**
- Revolutionary breakthrough in AI (2017)
- Enables processing of entire sequences at once
- Powers ChatGPT, Claude, and other LLMs

**Attention Mechanism**
- The secret sauce of transformers
- Allows model to focus on relevant parts of input
- Computes relationships between all words
- Example: In "The cat sat on the mat", attention helps the model know "it" refers to "cat"

**Why This Matters:**
Understanding attention helps you understand:
- How AI processes your prompts
- Why context matters so much
- How to write better prompts

**AI Agents**
- Programs that can act autonomously
- Make decisions based on goals
- Examples: Customer service bots, research assistants`
    },
    week2: {
      title: 'Week 2: The Magnificent Seven',
      subtitle: 'Prompting Strategies for Success',
      unlockCode: 'MAG7HERO',
      content: `⚡ **The Magnificent Seven Prompting Strategies**

**1. Persona Pattern**
Give the AI a specific role or expertise
Example: "You are a senior data scientist..."

**2. Multi-Shot Prompting**
Provide multiple examples to guide the AI
Example: Show 2-3 examples of good outputs

**3. Chain of Thought**
Ask AI to explain reasoning step-by-step
Example: "Let's think through this carefully..."

**4. ReAct (Reasoning + Acting)**
Combine analysis with action steps
Example: "Analyze this problem, then suggest solutions"

**5. Flipped Interaction**
Let the AI ask YOU questions
Example: "Ask me questions to understand my needs"

**6. Game Play**
Make interactions engaging and interactive
Example: "Let's play a scenario where..."

**7. Template Pattern**
Specify exact output format
Example: "Format as: Problem | Solution | Impact"

**Why These Work:**
- Give AI clear structure
- Reduce ambiguity
- Improve output quality
- Make prompts reusable

**Practice Tip:**
Start with one strategy, master it, then combine!`
    },
    week3: {
      title: 'Week 3: Be An AI Hero at Work',
      subtitle: 'Create a Business FAQ with RAG',
      unlockCode: 'VECTOR42',
      content: `💼 **RAG: Retrieval Augmented Generation**

**What is RAG?**
A technique that gives AI access to external knowledge sources

**How RAG Works:**
1. Store documents in a searchable database
2. When user asks a question, retrieve relevant docs
3. Feed docs + question to AI
4. AI generates answer based on retrieved info

**Key Components:**

**Vector Database**
- Stores information in searchable format
- Enables semantic search
- Examples: Pinecone, Weaviate, ChromaDB

**Embeddings**
- Converting text to numerical vectors
- Similar meanings = similar vectors
- Enables "meaning-based" search

**Semantic Search**
- Search by meaning, not just keywords
- "How do I reset password?" finds "password recovery"
- Much more powerful than traditional search

**Business Applications:**
- Customer support FAQs
- Internal knowledge bases
- Document Q&A systems
- Research assistants

**Multi-Shot Prompting for FAQs:**
Show the AI examples of good FAQ Q&A pairs to improve output quality.

**Example:**
Instead of: "Tell me about returns"
RAG enables: "Based on our return policy document, here's how to return items within 30 days..."`
    },
    week4: {
      title: 'Week 4: Shoot Your Shot',
      subtitle: 'Zero, One & Multi-Shot Prompting',
      unlockCode: 'PROMPTPRO',
      content: `🎯 **Shot-Based Prompting Techniques**

**Zero-Shot**
Give no examples, just instructions
- Pros: Quick and simple
- Cons: Less consistent
- Example: "Write a product description"

**One-Shot**
Provide one example
- Pros: Shows desired format
- Cons: Limited guidance
- Example: "Like this: [example]. Now do one for..."

**Multi-Shot**
Provide multiple examples
- Pros: Very consistent output
- Cons: Longer prompts
- Example: "Here are 3 examples... Now create #4"

**When to Use Each:**

**Zero-Shot:**
- Simple, common tasks
- When you want variety
- Quick iterations

**One-Shot:**
- Specific format needed
- Medium complexity
- Reference example

**Multi-Shot:**
- Consistency critical
- Complex patterns
- High-quality needed

**Best Practice:**
Start with zero-shot. If output isn't good enough, add examples.

**Example Comparison:**

Zero: "Write a tweet"
One: "Write a tweet like: [example]"
Multi: "Here are 3 great tweets: [ex1][ex2][ex3]. Write one similar."`
    },
    week5: {
      title: 'Week 5: Alternate AI-verses',
      subtitle: 'Tree of Thought & Expert Prompts',
      unlockCode: 'TREEOFAI',
      content: `🌳 **Advanced Prompting Techniques**

**Tree of Thought (ToT)**
Break complex problems into branches
- Explore multiple solution paths
- Evaluate each path
- Choose the best one

Example:
"Let's explore 3 different approaches to this problem:
Approach 1: [solution path]
Approach 2: [alternative path]  
Approach 3: [another path]
Now compare them and choose the best."

**Expert Prompting**
Invoke specific expertise domains
- "As a [expert role]..."
- Leverages specialized knowledge
- Improves accuracy in domain

Example:
"As a cybersecurity expert with 20 years experience, analyze this system..."

**Decision Trees**
Map out decision-making process
- If X then Y, else Z
- Helps with complex scenarios
- Great for troubleshooting

Example:
"Create a decision tree:
If customer is new → action A
If customer is returning → action B
If customer has complaint → action C"

**Combining Techniques:**
- Use Tree of Thought for complex decisions
- Add Expert Prompting for accuracy
- Include Chain of Thought for reasoning

**When to Use:**
- Complex business decisions
- Technical problem-solving
- Strategic planning
- Scenarios with multiple variables`
    }
  };

  const weeks610 = {
    week6: {
      title: 'Week 6: Rise of the Machines',
      subtitle: 'The Alignment Problem & Ethics',
      unlockCode: 'ETHICAL1',
      content: `⚖️ **AI Ethics & Alignment**

**The Alignment Problem:**
How do we ensure AI systems do what we actually want them to do?

**Key Ethical Concerns:**

**Fairness & Bias**
- AI learns from data - which may contain human biases
- Example: Hiring AI trained on historical data may discriminate
- Solution: Diverse training data, bias testing, human oversight

**Transparency**
- "Black box" problem - we can't always explain AI decisions
- Important for healthcare, legal, financial applications
- Solution: Explainable AI (XAI) techniques

**Privacy**
- AI training requires massive data
- Risk of exposing private information
- Solution: Differential privacy, data minimization

**Environmental Impact**
- Training large models uses significant energy
- Carbon footprint concerns
- Solution: Efficient architectures, renewable energy

**Safety & Control**
- Ensuring AI can't cause unintended harm
- Preventing misuse
- Solution: Safety guidelines, red-teaming, testing

**Value Alignment:**
Aligning AI behavior with human values
- What values? Whose values?
- Cultural differences
- Long-term considerations

**Practical Applications:**
- Review AI outputs for bias
- Consider ethical implications
- Be transparent about AI use
- Think about consequences`
    },
    week7: {
      title: 'Week 7: Student, Teach Thyself!',
      subtitle: 'AI as Your Personal Tutor',
      unlockCode: 'BIZWIZ25',
      content: `🎓 **AI-Powered Learning**

**Custom AI Tutors:**
Create personalized learning experiences with AI

**Effective Learning Prompts:**

**Socratic Method**
"Ask me questions to test my understanding of [topic]"
- AI asks YOU questions
- Reveals gaps in knowledge
- Active learning

**Explain Like I'm 5**
"Explain [complex concept] in simple terms"
- Breaks down complexity
- Uses analogies
- Builds foundations

**Feynman Technique**
"Help me explain [concept] as if teaching someone else"
- Teaching reinforces learning
- Identifies weak spots
- Deepens understanding

**Spaced Repetition**
"Quiz me on [topic] with increasing difficulty"
- Optimizes memory retention
- Adapts to your level
- Long-term learning

**Creating Your AI Study Buddy:**
1. Define your learning goals
2. Design prompts for different learning modes
3. Track progress and adjust
4. Combine with other study methods

**Example AI Tutor Prompts:**

"I'm learning about RAG. First explain it simply, then ask me 3 questions to test my understanding."

"Act as my programming tutor. When I make mistakes, don't just give answers - ask guiding questions."

"Create a study plan for learning the Magnificent Seven strategies over 2 weeks."

**Best Practices:**
- Be specific about your level
- Ask for analogies and examples
- Request practice problems
- Have AI explain your mistakes`
    },
    week8: {
      title: 'Week 8: Design Thinking Meets AI',
      subtitle: 'Human-Centered AI Solutions',
      unlockCode: 'AGENT007',
      content: `🎨 **Design Thinking with AI**

**The Design Thinking Process:**

**1. Empathize**
Understand the user's needs
- AI can: Analyze user feedback, find patterns
- Prompt: "Analyze these customer reviews and identify pain points"

**2. Define**
Clearly state the problem
- AI can: Synthesize insights, frame problems
- Prompt: "Based on these insights, define the core problem"

**3. Ideate**
Generate creative solutions
- AI can: Brainstorm ideas, suggest alternatives
- Prompt: "Generate 10 creative solutions for [problem]"

**4. Prototype**
Build quick versions to test
- AI can: Create mockups, write sample code
- Prompt: "Create a simple prototype of this solution"

**5. Test**
Get feedback and iterate
- AI can: Simulate user testing, analyze results
- Prompt: "What questions would users ask about this?"

**AI in Agile Workflows:**

**Sprint Planning**
"Help me break this feature into user stories"

**Daily Standups**
"Summarize these updates and identify blockers"

**Retrospectives**
"Analyze our sprint data and suggest improvements"

**Best Practices:**
- Keep human judgment central
- Use AI to augment, not replace thinking
- Iterate based on real feedback
- Combine AI insights with team wisdom

**Example Workflow:**
1. AI analyzes customer data
2. Team interprets findings
3. AI generates solution ideas
4. Team selects and refines
5. AI helps prototype
6. Team tests with users`
    },
    week9: {
      title: 'Week 9: Beyond ChatGPT',
      subtitle: 'Plugins, Tools & Integration',
      unlockCode: 'AGENT007',
      content: `🔌 **Extending AI Capabilities**

**GPT Plugins & Tools:**

**What are Plugins?**
- Extend AI capabilities beyond text
- Connect to external services
- Enable real-time data access
- Perform actions in other apps

**Popular Plugin Types:**

**Data Access**
- Web browsing
- Database queries
- API integration
- Real-time information

**Computation**
- Code execution
- Math & calculations
- Data analysis
- Visualization

**Actions**
- Send emails
- Schedule meetings
- Create documents
- Update systems

**Business Applications:**

**Customer Service**
- Plugin: CRM integration
- AI + customer history
- Personalized responses

**Data Analysis**
- Plugin: Database access
- AI + your data
- Automated insights

**Content Creation**
- Plugin: Design tools
- AI + templates
- Automated production

**Development**
- Plugin: Code execution
- AI + testing
- Automated debugging

**Building with AI Tools:**

**API Integration**
Connect AI to your systems
- Anthropic API
- OpenAI API
- Custom endpoints

**Workflow Automation**
- Zapier + AI
- Make.com + AI
- Custom scripts

**Best Practices:**
- Start simple, add complexity
- Test integrations thoroughly
- Monitor API usage
- Handle errors gracefully
- Keep human in the loop

**Security Considerations:**
- Protect API keys
- Limit access scope
- Validate inputs
- Monitor usage`
    },
    week10: {
      title: 'Week 10: AI Entrepreneurship',
      subtitle: 'Building AI-Powered Businesses',
      unlockCode: 'ALLSTAR',
      content: `🚀 **AI Business Models**

**Opportunities in AI:**

**1. AI-Enhanced Services**
Add AI to existing services
- Example: Accounting firm + AI analysis
- Low barrier to entry
- Immediate value

**2. AI-Native Products**
Build products around AI
- Example: Custom AI writing assistant
- Higher technical complexity
- Scalable business model

**3. AI Consulting**
Help others implement AI
- Example: AI strategy consulting
- Leverages existing expertise
- Service-based revenue

**4. AI Training & Education**
Teach others about AI
- Example: Corporate AI training
- Growing demand
- Multiple revenue streams

**Key Business Questions:**

**Problem**
- What specific problem does AI solve?
- Who has this problem?
- How urgent is it?

**Solution**
- Why is AI the right solution?
- What alternatives exist?
- What's your unique advantage?

**Market**
- Who are your customers?
- How big is the market?
- How will you reach them?

**Business Model**
- How will you make money?
- Subscription? Usage-based? One-time?
- What are your costs?

**Competition**
- Who else is solving this?
- What makes you different?
- What's your moat?

**Building Your AI Business:**

**Phase 1: Validate**
- Test the problem exists
- Build simple prototype
- Get customer feedback

**Phase 2: Build**
- Create MVP
- Refine based on feedback
- Establish processes

**Phase 3: Scale**
- Grow customer base
- Optimize operations
- Expand offerings

**Common Pitfalls:**
- Solution looking for problem
- Underestimating AI limitations
- Ignoring user experience
- Poor data strategy
- Scaling too fast

**Success Factors:**
- Deep understanding of customer
- Strong technical execution
- Focus on specific use case
- Great user experience
- Sustainable business model

**Resources:**
- AI APIs (Anthropic, OpenAI)
- No-code tools (Bubble, Webflow)
- Cloud platforms (AWS, GCP)
- Community support`
    }
  };

  // Prompt Lab strategies
  const strategies = [
    { name: 'Persona', hint: 'Give the AI a specific role or expertise' },
    { name: 'Multi-Shot', hint: 'Provide multiple examples' },
    { name: 'Chain of Thought', hint: 'Ask for step-by-step reasoning' },
    { name: 'ReAct', hint: 'Combine reasoning with actions' },
    { name: 'Flipped Interaction', hint: 'Let AI ask YOU questions' },
    { name: 'Game Play', hint: 'Make it interactive or fun' },
    { name: 'Template', hint: 'Specify exact output format' }
  ];

  // Chat functions
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    // Mark chat as used
    if (!completedModules.chat) {
      setCompletedModules(prev => ({ ...prev, chat: true }));
    }

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 800,
          system: `You are Max, an AI tutor for COLL.121. You're friendly, witty, and conversational - like a smart friend who's good at explaining things. You have a sense of humor but you're not trying too hard to sound young.

The student's name is ${userProfile.name || 'there'}. Their experience level is ${userProfile.experienceLevel || 'unknown'}. Their preferred learning style is ${userProfile.learningStyle || 'not specified'}. Their main goal is: ${userProfile.primaryGoal || 'general learning'}.

Adapt your explanations based on their experience level:
- Beginner: Use simple analogies, avoid jargon, explain terms
- Intermediate: Can use some technical terms, go deeper on concepts
- Advanced: Technical discussions welcome, focus on nuances

TONE: Warm, casual, a bit playful. Use conversational language but avoid excessive slang. An occasional emoji is fine, but don't overdo it.

COLL.121 KNOWLEDGE:
- Magnificent Seven = 7 prompting strategies: Persona, Multi-Shot, Chain of Thought, ReAct, Flipped Interaction, Game Play, Template
- RAG = Retrieval Augmented Generation (giving AI access to external knowledge)
- Topics: transformers, attention mechanism, GPT, LLMs, embeddings, vector databases, AI ethics, bias

FOR COURSE QUESTIONS: Be accurate and clear. Use helpful analogies. Show genuine enthusiasm for interesting concepts without being over the top.

Be helpful, warm, and occasionally funny - but always natural.`,
          messages: [{ 
            role: 'user', 
            content: chatInput 
          }]
        })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.content[0].text }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: "Hey! Need help with COLL.121?" }]);
    }
    setIsTyping(false);
  };

  // Shuffle flashcards function
  const shuffleFlashcards = (cards) => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Mark flashcard topic as complete and reveal code
  const completeFlashcardTopic = (topic) => {
    if (!completedModules.studybuddy[topic]) {
      setCompletedModules(prev => ({
        ...prev,
        studybuddy: { ...prev.studybuddy, [topic]: true }
      }));
      
      // Find and unlock the associated code
      const codeEntry = Object.entries(unlockCodes).find(([code, data]) => data.module === topic);
      if (codeEntry && !unlockedCodes.includes(codeEntry[0])) {
        setUnlockedCodes(prev => [...prev, codeEntry[0]]);
        setCelebrationCode(codeEntry[0]);
        setShowUnlockCelebration(true);
      }
    }
  };

  // Redeem a code
  const redeemCode = () => {
    const code = codeInput.toUpperCase().trim();
    if (unlockCodes[code]) {
      if (redeemedCodes.includes(code)) {
        setCodeMessage('You\'ve already redeemed this code!');
      } else {
        setRedeemedCodes(prev => [...prev, code]);
        // Actually unlock the feature
        const feature = unlockCodes[code].feature;
        setUnlockedFeatures(prev => ({ ...prev, [feature]: true }));
        setCodeMessage(`🎉 ${unlockCodes[code].name} unlocked! You now have access to: ${unlockCodes[code].reward}`);
      }
    } else {
      setCodeMessage('Invalid code. Keep learning to discover more codes!');
    }
    setCodeInput('');
  };

  // Calculate progress
  const calculateProgress = () => {
    const flashcardProgress = Object.values(completedModules.studybuddy).filter(Boolean).length;
    const weekProgress = Object.values(completedModules.weeks).filter(Boolean).length;
    const assignmentProgress = Object.values(completedModules.assignments).filter(Boolean).length;
    const totalModules = 7 + 10 + 6 + 3; // flashcards + weeks + assignments + other
    const completed = flashcardProgress + weekProgress + assignmentProgress + 
      (completedModules.promptlab ? 1 : 0) + 
      (completedModules.glossary ? 1 : 0) + 
      (completedModules.chat ? 1 : 0);
    return Math.round((completed / totalModules) * 100);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        if (showCodeModal) {
          setShowCodeModal(false);
        } else if (showUnlockCelebration) {
          setShowUnlockCelebration(false);
        } else if (currentView === 'chat' || currentView === 'studybuddy' || currentView === 'assignments' || 
            currentView === 'promptlab' || currentView === 'weeks15' || currentView === 'weeks610' || 
            currentView === 'glossary' || currentView === 'achievements') {
          setCurrentView('hub');
        } else if (currentView === 'hub') {
          setCurrentView('landing');
        }
      }

      if (currentView === 'studybuddy' && studyView === 'flashcards') {
        if (e.key === 'ArrowRight') {
          const cards = isShuffled ? shuffledCards : flashcards[selectedTopic];
          setCurrentCard(c => (c + 1) % cards.length);
          setShowAnswer(false);
          setSimpleExplanation('');
        }
        if (e.key === 'ArrowLeft') {
          const cards = isShuffled ? shuffledCards : flashcards[selectedTopic];
          setCurrentCard(c => c > 0 ? c - 1 : cards.length - 1);
          setShowAnswer(false);
          setSimpleExplanation('');
        }
        if (e.key === ' ' && !isExplaining) {
          e.preventDefault();
          setShowAnswer(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentView, studyView, selectedTopic, isShuffled, shuffledCards, isExplaining, showCodeModal, showUnlockCelebration]);

  const [promptAnalysis, setPromptAnalysis] = useState(null);
  const [rewrittenPrompt, setRewrittenPrompt] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);

  const checkPrompt = async () => {
    if (!userPrompt.trim()) return;
    
    setIsAnalyzing(true);
    setPromptAnalysis(null);
    setRewrittenPrompt(null);
    
    // Mark prompt lab as used
    if (!completedModules.promptlab) {
      setCompletedModules(prev => ({ ...prev, promptlab: true }));
    }
    
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 600,
          system: `You analyze prompts for the Magnificent Seven strategies. Be encouraging but honest. Keep feedback brief and actionable.`,
          messages: [{ 
            role: 'user', 
            content: `Analyze this prompt for the 7 strategies. For each one found, quote the relevant part briefly.

THE MAGNIFICENT SEVEN:
1. Persona - Giving AI a role/expertise
2. Multi-Shot - Providing examples
3. Chain of Thought - Asking for step-by-step reasoning
4. ReAct - Combining reasoning with actions
5. Flipped Interaction - Having AI ask questions
6. Game Play - Making it interactive/fun
7. Template - Specifying output format

PROMPT TO ANALYZE:
"${userPrompt}"

Respond in this exact format:
SCORE: X/7

FOUND:
- [Strategy name]: "[brief quote or description]"
(list each strategy found)

MISSING:
- [Strategy name]: [quick tip to add it]
(list strategies not found)

TIPS: [One sentence of encouragement or advice]` 
          }]
        })
      });
      const data = await res.json();
      setPromptAnalysis(data.content[0].text);
    } catch {
      setPromptAnalysis("Couldn't analyze right now - but keep practicing! Make sure you're including all 7 strategies.");
    }
    setIsAnalyzing(false);
  };

  const rewritePrompt = async () => {
    if (!userPrompt.trim()) return;
    
    setIsRewriting(true);
    setRewrittenPrompt(null);
    
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1200,
          system: `You are an expert prompt engineer who helps students improve their prompts using the Magnificent Seven strategies. Your job is to take their prompt and rewrite it to include ALL 7 strategies while keeping their original intent and business scenario intact. Make the rewritten prompt practical and professional.`,
          messages: [{ 
            role: 'user', 
            content: `Rewrite this prompt to include ALL 7 Magnificent Seven strategies. Keep the same topic/intent but enhance it with any missing strategies.

THE MAGNIFICENT SEVEN:
1. Persona - Give AI a specific role/expertise (e.g., "You are a senior marketing strategist with 15 years experience...")
2. Multi-Shot - Provide 2-3 examples of desired output
3. Chain of Thought - Ask for step-by-step reasoning (e.g., "Think through this step by step...")
4. ReAct - Combine reasoning with actions (e.g., "First analyze, then recommend actions...")
5. Flipped Interaction - Have AI ask clarifying questions first
6. Game Play - Make it interactive or scenario-based
7. Template - Specify exact output format

ORIGINAL PROMPT:
"${userPrompt}"

INSTRUCTIONS:
1. Rewrite the prompt to naturally incorporate ALL 7 strategies
2. Keep the same business topic/scenario from the original
3. Make it flow naturally - don't just list strategies mechanically
4. Use clear section headers or formatting
5. The rewritten prompt should be ready to copy and use immediately

Respond with ONLY the rewritten prompt, no explanations or preamble. Start directly with the improved prompt.` 
          }]
        })
      });
      const data = await res.json();
      setRewrittenPrompt(data.content[0].text);
    } catch {
      setRewrittenPrompt("Couldn't rewrite right now - try again in a moment!");
    }
    setIsRewriting(false);
  };

  // Always-visible home button (except on landing page and onboarding)
  const HomeButton = () => {
    if (currentView === 'landing' || currentView === 'onboarding') return null;
    return (
      <button
        onClick={() => setCurrentView('landing')}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-full shadow-lg shadow-indigo-500/50 flex items-center justify-center transition-all hover:scale-110"
        title="Home (ESC to go back)"
      >
        <span className="text-2xl">🏠</span>
      </button>
    );
  };

  // Unlock Celebration Modal
  const UnlockCelebration = () => {
    if (!showUnlockCelebration || !celebrationCode) return null;
    const codeData = unlockCodes[celebrationCode];
    
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-500/50 rounded-3xl p-8 max-w-md w-full text-center animate-pulse">
          <div className="text-6xl mb-4">{codeData.icon}</div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            🎉 Code Unlocked!
          </h2>
          <p className="text-gray-300 mb-6">You've discovered a secret code by completing this module!</p>
          
          <div className="bg-black/40 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-400 mb-2">Your unlock code:</p>
            <p className="text-3xl font-mono font-bold text-yellow-400 tracking-wider">{celebrationCode}</p>
          </div>
          
          <p className="text-sm text-gray-400 mb-6">
            Go to Achievements to redeem this code for: <span className="text-indigo-400">{codeData.reward}</span>
          </p>
          
          <button
            onClick={() => setShowUnlockCelebration(false)}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all"
          >
            Awesome! Continue Learning
          </button>
        </div>
      </div>
    );
  };

  // ==============================================
  // ONBOARDING / INTAKE FORM
  // ==============================================
  if (currentView === 'onboarding' && !userProfile.onboardingComplete) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-purple-950/10 to-black"></div>
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-xl w-full relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm mb-6">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span className="text-gray-300">Let's personalize your experience</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Welcome to Your AI for Business Tutor
              </span>
            </h1>
            
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4].map(step => (
                <div 
                  key={step}
                  className={`w-3 h-3 rounded-full transition-all ${
                    step === onboardingStep ? 'bg-indigo-500 w-8' : 
                    step < onboardingStep ? 'bg-indigo-500' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            {onboardingStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <User className="w-12 h-12 mx-auto text-indigo-400 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">What's your name?</h2>
                  <p className="text-gray-400">Your tutor, Max, will personalize your learning experience</p>
                </div>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-lg focus:outline-none focus:border-indigo-500 text-center"
                  autoFocus
                />
                <button
                  onClick={() => setOnboardingStep(2)}
                  disabled={!userProfile.name.trim()}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-lg hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {onboardingStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <TrendingUp className="w-12 h-12 mx-auto text-indigo-400 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Your AI Experience Level?</h2>
                  <p className="text-gray-400">This helps us adjust explanations to your level</p>
                </div>
                <div className="space-y-3">
                  {[
                    { value: 'beginner', label: '🌱 Beginner', desc: 'New to AI - explain everything simply' },
                    { value: 'intermediate', label: '🌿 Intermediate', desc: 'Some experience with ChatGPT/AI tools' },
                    { value: 'advanced', label: '🌳 Advanced', desc: 'Comfortable with technical AI concepts' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setUserProfile(prev => ({ ...prev, experienceLevel: option.value }))}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        userProfile.experienceLevel === option.value
                          ? 'bg-indigo-600/30 border-indigo-500'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-semibold text-lg">{option.label}</div>
                      <div className="text-sm text-gray-400">{option.desc}</div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setOnboardingStep(1)}
                    className="px-6 py-4 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setOnboardingStep(3)}
                    disabled={!userProfile.experienceLevel}
                    className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {onboardingStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Brain className="w-12 h-12 mx-auto text-indigo-400 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">How do you learn best?</h2>
                  <p className="text-gray-400">We'll tailor content to your style</p>
                </div>
                <div className="space-y-3">
                  {[
                    { value: 'visual', label: '👁️ Visual', desc: 'Diagrams, examples, and demonstrations' },
                    { value: 'reading', label: '📚 Reading', desc: 'Detailed explanations and documentation' },
                    { value: 'practice', label: '🛠️ Hands-on', desc: 'Learn by doing exercises and projects' },
                    { value: 'discussion', label: '💬 Discussion', desc: 'Interactive Q&A and conversations' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setUserProfile(prev => ({ ...prev, learningStyle: option.value }))}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        userProfile.learningStyle === option.value
                          ? 'bg-indigo-600/30 border-indigo-500'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-semibold text-lg">{option.label}</div>
                      <div className="text-sm text-gray-400">{option.desc}</div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setOnboardingStep(2)}
                    className="px-6 py-4 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setOnboardingStep(4)}
                    disabled={!userProfile.learningStyle}
                    className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {onboardingStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Rocket className="w-12 h-12 mx-auto text-indigo-400 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">What's your main goal?</h2>
                  <p className="text-gray-400">We'll prioritize content that helps you achieve it</p>
                </div>
                <div className="space-y-3">
                  {[
                    { value: 'ace-class', label: '🎯 Ace this class', desc: 'Focus on assignments and exams' },
                    { value: 'career', label: '💼 Career skills', desc: 'Build practical AI skills for work' },
                    { value: 'business', label: '🚀 Start AI business', desc: 'Learn to build AI-powered products' },
                    { value: 'curiosity', label: '🧠 General understanding', desc: 'Just want to learn about AI' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setUserProfile(prev => ({ ...prev, primaryGoal: option.value }))}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        userProfile.primaryGoal === option.value
                          ? 'bg-indigo-600/30 border-indigo-500'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-semibold text-lg">{option.label}</div>
                      <div className="text-sm text-gray-400">{option.desc}</div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setOnboardingStep(3)}
                    className="px-6 py-4 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      setUserProfile(prev => ({ ...prev, onboardingComplete: true }));
                      setCurrentView('landing');
                    }}
                    disabled={!userProfile.primaryGoal}
                    className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-semibold text-lg hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" /> Let's Start Learning!
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setUserProfile(prev => ({ ...prev, onboardingComplete: true }));
              setCurrentView('landing');
            }}
            className="mt-6 text-gray-500 hover:text-gray-300 text-sm mx-auto block"
          >
            Skip for now →
          </button>
        </div>
      </div>
    );
  }

  // ==============================================
  // LANDING PAGE
  // ==============================================
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-purple-950/10 to-black"></div>
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-4xl w-full relative z-10">
          {/* Progress Bar */}
          {userProfile.onboardingComplete && (
            <div className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Your Progress</span>
                <span className="text-sm font-bold text-indigo-400">{calculateProgress()}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">{unlockedCodes.length} codes discovered</span>
                <button 
                  onClick={() => setCurrentView('achievements')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <Trophy className="w-3 h-3" /> View Achievements
                </button>
              </div>
            </div>
          )}

          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm mb-8 backdrop-blur-xl shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-gray-300">
                {userProfile.name ? `Welcome back, ${userProfile.name}!` : 'COLL.121: AI for Business'}
              </span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                COLL.121: AI for Business
              </span>
              <br />
              <span className="text-3xl lg:text-4xl bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent">
                Your Complete Study System
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Master Prof. Akmal's course with AI tutoring, assignment guides, flashcards, and complete curriculum—everything you need to ace COLL.121
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button
              onClick={() => setCurrentView('hub')}
              className="group relative px-12 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-2xl opacity-60 group-hover:opacity-80"></div>
              <div className="relative flex items-center justify-center gap-3">
                <Brain className="w-6 h-6" />
                <span>Start Studying</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>

            <button
              onClick={() => setCurrentView('chat')}
              className="group relative px-12 py-6 bg-white/5 border border-white/10 rounded-2xl font-semibold text-lg hover:bg-white/10 hover:scale-105 transition-all duration-300 shadow-lg shadow-indigo-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-2xl opacity-20 group-hover:opacity-40"></div>
              <div className="relative flex items-center justify-center gap-3">
                <MessageCircle className="w-6 h-6" />
                <span>AI Chat Tutor</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
            <button
              onClick={() => setCurrentView('assignments')}
              className="relative bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 hover:scale-[1.02] transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/50">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold mb-2">Assignment Help</h3>
              <p className="text-xs text-gray-400">Step-by-step guides for all 6 assignments</p>
            </button>

            <button
              onClick={() => {
                setCurrentView('studybuddy');
                setStudyView('dashboard');
              }}
              className="relative bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 hover:scale-[1.02] transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/50">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold mb-2">Study Buddy System</h3>
              <p className="text-xs text-gray-400">Flashcards with spaced repetition</p>
            </button>

            <button
              onClick={() => setCurrentView('promptlab')}
              className="relative bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 hover:scale-[1.02] transition-all shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/50">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold mb-2">Prompt Practice Lab</h3>
              <p className="text-xs text-gray-400">Interactive Magnificent Seven practice</p>
            </button>

            <button
              onClick={() => {
                setSelectedWeek('week1');
                setCurrentView('weeks15');
              }}
              className="relative bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 hover:scale-[1.02] transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/50">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold mb-2">10 Weeks of Content</h3>
              <p className="text-xs text-gray-400">Complete lessons for all 10 weeks</p>
            </button>

            <button
              onClick={() => setCurrentView('achievements')}
              className="relative bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 hover:scale-[1.02] transition-all shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/50">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold mb-2">Achievements</h3>
              <p className="text-xs text-gray-400">{unlockedCodes.length} codes discovered</p>
            </button>
          </div>

          <div className="mt-24 pt-12 border-t border-white/5">
            <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 rounded-3xl p-8 mb-12">
              <div className="text-center mb-6">
                <span className="text-3xl mb-4 block">🧠</span>
                <h2 className="text-2xl font-bold mb-2">Built for How You Actually Learn</h2>
                <p className="text-gray-400">Designed for ADHD brains, better for everyone</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="font-bold mb-2 text-pink-400">Bite-Sized Chunks</h3>
                  <p className="text-sm text-gray-400">No walls of text. Information broken into digestible pieces that don't overwhelm.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🎮</span>
                  </div>
                  <h3 className="font-bold mb-2 text-green-400">Gamified Progress</h3>
                  <p className="text-sm text-gray-400">Unlock codes, earn achievements, and track progress to keep your brain engaged and motivated.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h3 className="font-bold mb-2 text-blue-400">Learn Your Way</h3>
                  <p className="text-sm text-gray-400">Chat with Max, flip through flashcards, or dive into content—multiple paths to understanding.</p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 italic">
                  "Clear structure, instant feedback, zero fluff—the way learning should be."
                </p>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-500">
              Prof. Hassan Akmal • Fall 2025 • Mondays 10-11AM EST
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================
  // ACHIEVEMENTS PAGE
  // ==============================================
  if (currentView === 'achievements') {
    return (
      <div className={`min-h-screen text-white p-6 ${unlockedFeatures.professorMode ? 'bg-gradient-to-br from-yellow-950 via-black to-yellow-950' : 'bg-black'}`}>
        <HomeButton />
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setCurrentView('hub')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Hub
          </button>

          <div className="mb-8">
            <h1 className={`text-4xl font-bold mb-2 ${unlockedFeatures.professorMode ? 'text-yellow-400' : ''}`}>
              {unlockedFeatures.professorMode ? '✨ ' : '🏆 '}Achievements & Unlock Codes
            </h1>
            <p className="text-gray-400">Complete modules to discover secret codes and unlock rewards!</p>
          </div>

          {/* Professor Mode Badge */}
          {unlockedFeatures.professorMode && (
            <div className="bg-gradient-to-r from-yellow-600/30 to-amber-600/30 border border-yellow-500/50 rounded-2xl p-6 mb-8 text-center">
              <div className="text-4xl mb-2">👑</div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-2">Professor Mode Active</h2>
              <p className="text-yellow-200/70">You've unlocked the Golden Scholar achievement! The app now has a special golden theme.</p>
            </div>
          )}

          {/* Code Redemption */}
          <div className={`border rounded-2xl p-6 mb-8 ${unlockedFeatures.professorMode ? 'bg-yellow-900/20 border-yellow-500/30' : 'bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30'}`}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Gift className={unlockedFeatures.professorMode ? 'w-6 h-6 text-yellow-400' : 'w-6 h-6 text-indigo-400'} />
              Redeem a Code
            </h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && redeemCode()}
                placeholder="Enter unlock code..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono uppercase tracking-wider focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={redeemCode}
                disabled={!codeInput.trim()}
                className={`px-6 py-3 rounded-xl font-semibold disabled:opacity-50 transition-all ${unlockedFeatures.professorMode ? 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'}`}
              >
                Redeem
              </button>
            </div>
            {codeMessage && (
              <p className={`mt-3 text-sm ${codeMessage.includes('🎉') ? 'text-green-400' : 'text-gray-400'}`}>
                {codeMessage}
              </p>
            )}
          </div>

          {/* Active Features */}
          {Object.values(unlockedFeatures).some(Boolean) && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Unlock className="w-6 h-6 text-green-400" />
                Your Unlocked Features
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {unlockedFeatures.promptTemplates && (
                  <div className="bg-black/30 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">🧪</span>
                    <div>
                      <div className="font-bold text-green-400">Prompt Templates</div>
                      <div className="text-xs text-gray-400">4 ready-to-use templates in Prompt Lab</div>
                    </div>
                  </div>
                )}
                {unlockedFeatures.caseStudies && (
                  <div className="bg-black/30 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">💼</span>
                    <div>
                      <div className="font-bold text-green-400">Case Study Library</div>
                      <div className="text-xs text-gray-400">4 real-world AI business cases</div>
                    </div>
                  </div>
                )}
                {unlockedFeatures.professorMode && (
                  <div className="bg-black/30 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">✨</span>
                    <div>
                      <div className="font-bold text-yellow-400">Professor Mode</div>
                      <div className="text-xs text-gray-400">Golden theme activated</div>
                    </div>
                  </div>
                )}
                {unlockedFeatures.certificate && (
                  <div className="bg-black/30 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <div className="font-bold text-green-400">Certificate Generator</div>
                      <div className="text-xs text-gray-400">Generate your completion certificate</div>
                    </div>
                  </div>
                )}
                {unlockedFeatures.detailedResponses && (
                  <div className="bg-black/30 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <div className="font-bold text-green-400">Detailed AI Responses</div>
                      <div className="text-xs text-gray-400">Max gives more thorough explanations</div>
                    </div>
                  </div>
                )}
                {unlockedFeatures.expertTips && (
                  <div className="bg-black/30 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">🌳</span>
                    <div>
                      <div className="font-bold text-green-400">Expert Tips</div>
                      <div className="text-xs text-gray-400">Pro tips shown in flashcards</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Certificate Generator */}
          {unlockedFeatures.certificate && (
            <div className="bg-gradient-to-br from-amber-900/40 to-yellow-900/40 border border-yellow-500/30 rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-400" />
                🎓 Generate Your Certificate
              </h2>
              <p className="text-gray-300 mb-4">Congratulations on completing the course! Generate your personalized certificate of completion.</p>
              <button
                onClick={() => setCurrentView('certificate')}
                className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 rounded-xl font-semibold"
              >
                🏆 Generate Certificate
              </button>
            </div>
          )}

          {/* Progress Overview */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Your Progress</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-black/30 rounded-xl p-4">
                <div className={`text-3xl font-bold ${unlockedFeatures.professorMode ? 'text-yellow-400' : 'text-indigo-400'}`}>{calculateProgress()}%</div>
                <div className="text-sm text-gray-400">Overall</div>
              </div>
              <div className="bg-black/30 rounded-xl p-4">
                <div className="text-3xl font-bold text-yellow-400">{unlockedCodes.length}</div>
                <div className="text-sm text-gray-400">Codes Found</div>
              </div>
              <div className="bg-black/30 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-400">{redeemedCodes.length}</div>
                <div className="text-sm text-gray-400">Redeemed</div>
              </div>
            </div>
          </div>

          {/* All Codes */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">All Achievement Codes</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(unlockCodes).map(([code, data]) => {
                const isUnlocked = unlockedCodes.includes(code);
                const isRedeemed = redeemedCodes.includes(code);
                
                return (
                  <div 
                    key={code}
                    className={`rounded-2xl p-5 border transition-all ${
                      isRedeemed 
                        ? 'bg-green-900/20 border-green-500/30' 
                        : isUnlocked 
                        ? 'bg-yellow-900/20 border-yellow-500/30' 
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`text-3xl ${!isUnlocked && 'opacity-30 grayscale'}`}>
                          {data.icon}
                        </div>
                        <div>
                          <h3 className="font-bold">{data.name}</h3>
                          <p className="text-sm text-gray-400">{data.reward}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isRedeemed ? (
                          <span className="text-green-400 text-sm flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> Active
                          </span>
                        ) : isUnlocked ? (
                          <span className="font-mono text-yellow-400 text-sm bg-yellow-900/30 px-2 py-1 rounded">
                            {code}
                          </span>
                        ) : (
                          <Lock className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hint */}
          <div className={`mt-8 rounded-xl p-6 ${unlockedFeatures.professorMode ? 'bg-yellow-900/20 border border-yellow-500/30' : 'bg-indigo-900/20 border border-indigo-500/30'}`}>
            <div className="flex items-start gap-3">
              <Sparkles className={unlockedFeatures.professorMode ? 'w-6 h-6 text-yellow-400 flex-shrink-0 mt-1' : 'w-6 h-6 text-indigo-400 flex-shrink-0 mt-1'} />
              <div>
                <h3 className={`font-bold mb-2 ${unlockedFeatures.professorMode ? 'text-yellow-400' : 'text-indigo-400'}`}>Pro Tip</h3>
                <p className="text-sm text-gray-300">
                  Complete flashcard decks, read weekly content, and practice in the Prompt Lab to discover secret codes. 
                  The special code <strong className="text-yellow-400">1.618</strong> (the golden ratio) unlocks Professor Mode! 🔍
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================
  // MAIN HUB
  // ==============================================
  if (currentView === 'hub') {
    return (
      <div className="min-h-screen bg-black text-white">
        <HomeButton />
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative border-b border-white/10 bg-black/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentView('landing')} className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Brain className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {userProfile.name ? `${userProfile.name}'s Learning Hub` : 'COLL.121 Learning Hub'}
                </h1>
                <p className="text-sm text-gray-400">Prof. Hassan Akmal • Fall 2025</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('achievements')}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-900/30 border border-yellow-500/30 rounded-xl hover:bg-yellow-900/50 transition-all"
            >
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">{unlockedCodes.length} Codes</span>
            </button>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-8 py-8">
          <h2 className="text-2xl font-bold mb-6">Your Modules</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={() => {
                setCurrentView('studybuddy');
                setStudyView('dashboard');
              }}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:scale-[1.02] transition-all shadow-lg hover:shadow-red-500/40 text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center mb-4 shadow-lg shadow-red-500/50">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Study Buddy</h3>
              <p className="text-sm text-gray-400 mb-4">Flashcards & spaced repetition</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-sm font-medium text-indigo-400">Open Module</span>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-indigo-400" />
              </div>
            </button>

            <button
              onClick={() => setCurrentView('chat')}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:scale-[1.02] transition-all shadow-lg hover:shadow-indigo-500/40 text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/50">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Chat Tutor</h3>
              <p className="text-sm text-gray-400 mb-4">Ask Max anything about COLL.121</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-sm font-medium text-indigo-400">Open Module</span>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-indigo-400" />
              </div>
            </button>

            <button
              onClick={() => setCurrentView('assignments')}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:scale-[1.02] transition-all shadow-lg hover:shadow-green-500/40 text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 shadow-lg shadow-green-500/50">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Assignment Workshop</h3>
              <p className="text-sm text-gray-400 mb-4">Step-by-step guides for all 6</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-sm font-medium text-indigo-400">Open Module</span>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-indigo-400" />
              </div>
            </button>

            <button
              onClick={() => setCurrentView('promptlab')}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:scale-[1.02] transition-all shadow-lg hover:shadow-yellow-500/40 text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/50">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Prompt Lab</h3>
              <p className="text-sm text-gray-400 mb-4">Practice Magnificent Seven</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-sm font-medium text-indigo-400">Open Module</span>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-indigo-400" />
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedWeek('week1');
                setCurrentView('weeks15');
              }}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:scale-[1.02] transition-all shadow-lg hover:shadow-blue-500/40 text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/50">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Weeks 1-5</h3>
              <p className="text-sm text-gray-400 mb-4">AI fundamentals & prompting</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-sm font-medium text-indigo-400">Open Module</span>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-indigo-400" />
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedWeek('week6');
                setCurrentView('weeks610');
              }}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:scale-[1.02] transition-all shadow-lg hover:shadow-purple-500/40 text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/50">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Weeks 6-10</h3>
              <p className="text-sm text-gray-400 mb-4">Ethics, business & entrepreneurship</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-sm font-medium text-indigo-400">Open Module</span>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-indigo-400" />
              </div>
            </button>

            <button
              onClick={() => setCurrentView('glossary')}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:scale-[1.02] transition-all shadow-lg hover:shadow-teal-500/40 text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center mb-4 shadow-lg shadow-teal-500/50">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Key Terms Glossary</h3>
              <p className="text-sm text-gray-400 mb-4">16 essential AI definitions</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-sm font-medium text-indigo-400">Open Module</span>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-indigo-400" />
              </div>
            </button>

            <button
              onClick={() => setCurrentView('achievements')}
              className="group bg-gradient-to-br from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-2xl p-6 hover:bg-yellow-900/40 hover:scale-[1.02] transition-all shadow-lg hover:shadow-yellow-500/40 text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/50">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Achievements</h3>
              <p className="text-sm text-gray-400 mb-4">{unlockedCodes.length}/{Object.keys(unlockCodes).length} codes discovered</p>
              <div className="flex items-center justify-between pt-4 border-t border-yellow-500/20">
                <span className="text-sm font-medium text-yellow-400">View Rewards</span>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-yellow-400" />
              </div>
            </button>

            {/* Case Studies - Only shows when unlocked */}
            {unlockedFeatures.caseStudies && (
              <button
                onClick={() => setCurrentView('casestudies')}
                className="group bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-2xl p-6 hover:bg-green-900/40 hover:scale-[1.02] transition-all shadow-lg hover:shadow-green-500/40 text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Unlock className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-400">UNLOCKED</span>
                </div>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 shadow-lg shadow-green-500/50">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Case Study Library</h3>
                <p className="text-sm text-gray-400 mb-4">4 real-world AI business cases</p>
                <div className="flex items-center justify-between pt-4 border-t border-green-500/20">
                  <span className="text-sm font-medium text-green-400">Explore Cases</span>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-green-400" />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==============================================
  // AI CHAT
  // ==============================================
  if (currentView === 'chat') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <HomeButton />
        <div className="border-b border-white/10 bg-black/80 backdrop-blur-xl p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button onClick={() => setCurrentView('landing')} className="flex items-center gap-2 text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="font-bold">💬 AI Chat Tutor</div>
            <div className="w-16"></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-4">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
                  : 'bg-white/10 border border-white/10'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/10 rounded-2xl p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-6 border-t border-white/10 max-w-4xl mx-auto w-full">
          <div className="flex gap-3">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about any COLL.121 topic..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500"
            />
            <button 
              onClick={sendMessage} 
              disabled={!chatInput.trim()}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================
  // STUDY BUDDY
  // ==============================================
  if (currentView === 'studybuddy') {
    if (studyView === 'flashcards' && selectedTopic) {
      const originalCards = flashcards[selectedTopic];
      const cards = isShuffled ? shuffledCards : originalCards;
      const card = cards[currentCard];
      const isLastCard = currentCard === cards.length - 1;

      const handleShuffle = () => {
        const shuffled = shuffleFlashcards(originalCards);
        setShuffledCards(shuffled);
        setIsShuffled(true);
        setCurrentCard(0);
        setShowAnswer(false);
        setSimpleExplanation('');
      };

      const explainSimply = async () => {
        setIsExplaining(true);
        setSimpleExplanation('');
        try {
          const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 400,
              system: `You explain AI concepts to a 10 year old. Use simple words, fun analogies, and relatable examples. No jargon. Keep it to 2-3 short paragraphs. Be friendly and encouraging!`,
              messages: [{ 
                role: 'user', 
                content: `Explain this concept to me like I'm 10 years old:\n\nQuestion: ${card.q}\nAnswer: ${card.a}` 
              }]
            })
          });
          const data = await res.json();
          setSimpleExplanation(data.content[0].text);
        } catch {
          setSimpleExplanation("Imagine you have a super smart robot friend who's learning to help you! That's basically what this concept is about. Ask Max in the chat for more help!");
        }
        setIsExplaining(false);
      };

      return (
        <div className="min-h-screen bg-black text-white p-6">
          <HomeButton />
          <UnlockCelebration />
          <div className="max-w-2xl mx-auto">
            <button 
              onClick={() => {
                setStudyView('dashboard');
                setSimpleExplanation('');
              }}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">{topicNames[selectedTopic]}</h2>
                <button
                  onClick={handleShuffle}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-sm font-semibold flex items-center gap-2"
                >
                  🔀 Shuffle
                </button>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-400">
                  Card {currentCard + 1} of {cards.length}
                  {isShuffled && <span className="ml-2 text-purple-400">(Shuffled)</span>}
                </p>
                <div className="flex gap-1">
                  {cards.map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-2 rounded-full ${i === currentCard ? 'bg-indigo-500' : 'bg-white/20'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div 
              onClick={() => setShowAnswer(!showAnswer)}
              className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-2 border-indigo-500/50 rounded-3xl p-8 min-h-[250px] flex items-center justify-center cursor-pointer hover:border-indigo-400 transition-all"
            >
              <div className="text-center">
                <p className="text-xl mb-4 font-medium">{card.q}</p>
                {showAnswer && (
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <p className="text-lg text-green-400">{card.a}</p>
                  </div>
                )}
                {!showAnswer && (
                  <p className="text-sm text-gray-400 mt-4">👆 Tap to reveal answer</p>
                )}
              </div>
            </div>

            {showAnswer && (
              <>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      if (isLastCard) {
                        // Complete the topic and potentially unlock code
                        completeFlashcardTopic(selectedTopic);
                      }
                      setCurrentCard(c => (c + 1) % cards.length);
                      setShowAnswer(false);
                      setSimpleExplanation('');
                    }}
                    className={`flex-1 rounded-xl py-4 font-semibold flex items-center justify-center gap-2 ${
                      isLastCard 
                        ? 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500' 
                        : 'bg-green-600 hover:bg-green-500'
                    }`}
                  >
                    {isLastCard ? (
                      <>
                        <Trophy className="w-5 h-5" /> Complete Deck!
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" /> Got it! Next →
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={explainSimply}
                  disabled={isExplaining}
                  className="w-full mt-3 bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-500 hover:to-orange-400 disabled:opacity-50 rounded-xl py-4 font-semibold flex items-center justify-center gap-2"
                >
                  {isExplaining ? '🤔 Thinking...' : '👶 Explain Like I\'m 10'}
                </button>

                {simpleExplanation && (
                  <div className="mt-4 bg-gradient-to-br from-pink-900/30 to-orange-900/30 border border-pink-500/30 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🧒</span>
                      <span className="font-bold text-pink-400">Simple Explanation</span>
                    </div>
                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{simpleExplanation}</p>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  setCurrentCard(c => c > 0 ? c - 1 : cards.length - 1);
                  setShowAnswer(false);
                  setSimpleExplanation('');
                }}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm"
              >
                ← Previous
              </button>
              <button
                onClick={() => {
                  setCurrentCard(c => (c + 1) % cards.length);
                  setShowAnswer(false);
                  setSimpleExplanation('');
                }}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm"
              >
                Skip →
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-black text-white p-6">
        <HomeButton />
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => setCurrentView('hub')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Hub
          </button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Study Buddy</h1>
            <p className="text-gray-400">Master COLL.121 concepts with flashcards - complete decks to unlock secret codes!</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {Object.keys(flashcards).map(topic => {
              const isCompleted = completedModules.studybuddy[topic];
              return (
                <div
                  key={topic}
                  onClick={() => {
                    setSelectedTopic(topic);
                    setStudyView('flashcards');
                    setCurrentCard(0);
                    setShowAnswer(false);
                  }}
                  className={`bg-white/5 border rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer ${
                    isCompleted ? 'border-green-500/50' : 'border-white/10 hover:border-indigo-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                      <Trophy className="w-6 h-6" />
                    </div>
                    {isCompleted && (
                      <span className="text-green-400 text-sm flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Done
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-3">{topicNames[topic]}</h3>
                  <div className="flex gap-3">
                    <div className="bg-black/30 rounded-lg p-3 flex-1">
                      <div className="text-xl font-bold">{flashcards[topic].length}</div>
                      <div className="text-xs text-gray-400">cards</div>
                    </div>
                    <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg py-2 text-sm font-medium">
                      {isCompleted ? 'Review' : 'Study Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ==============================================
  // ASSIGNMENTS
  // ==============================================
  if (currentView === 'assignments') {
    return (
      <div className="min-h-screen bg-black text-white">
        <HomeButton />
        <div className="flex h-screen">
          <div className="w-64 border-r border-white/10 p-6 overflow-y-auto">
            <button 
              onClick={() => setCurrentView('hub')}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 w-full"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="text-xl font-bold mb-6">Assignments</h2>
            {Object.keys(assignments).map(key => (
              <button
                key={key}
                onClick={() => setSelectedAssignment(key)}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-all ${
                  selectedAssignment === key 
                    ? 'bg-indigo-600 text-white' 
                    : 'hover:bg-white/5 text-gray-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    {assignments[key].title}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-8">
              <div className="mb-8 flex items-center gap-4">
                <span className="text-5xl">{assignments[selectedAssignment].icon}</span>
                <div>
                  <h1 className="text-3xl font-bold mb-1">{assignments[selectedAssignment].title}</h1>
                  <p className="text-gray-400">{assignments[selectedAssignment].desc}</p>
                </div>
              </div>

              <div className="space-y-6">
                {assignments[selectedAssignment].sections.map((section, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xl font-bold mb-4">{section.title}</h3>
                    
                    {section.type === 'list' && (
                      <ul className="space-y-2">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-300">
                            <span className="text-indigo-400 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.type === 'numbered' && (
                      <ol className="space-y-2">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-300">
                            <span className="text-indigo-400 font-bold">{i + 1}.</span>
                            {item}
                          </li>
                        ))}
                      </ol>
                    )}

                    {section.type === 'highlight' && (
                      <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-xl p-4">
                        <p className="text-indigo-300">{section.content}</p>
                      </div>
                    )}

                    {section.type === 'tip' && (
                      <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-xl p-4">
                        <p className="text-yellow-300">💡 {section.content}</p>
                      </div>
                    )}

                    {section.type === 'strategies' && (
                      <div className="space-y-3">
                        {section.items.map((item, i) => (
                          <div key={i} className="bg-black/30 rounded-xl p-4">
                            <div className="font-bold text-indigo-400 mb-1">{i + 1}. {item.name}</div>
                            <div className="text-sm text-gray-400 mb-2">{item.desc}</div>
                            <div className="text-xs text-gray-500 italic">"{item.example}"</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.type === 'checklist' && (
                      <div className="space-y-2">
                        {section.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 text-gray-300">
                            <div className="w-5 h-5 border-2 border-gray-600 rounded"></div>
                            {item}
                          </div>
                        ))}
                      </div>
                    )}

                    {section.type === 'grades' && (
                      <div className="space-y-2">
                        {section.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center bg-black/30 rounded-lg px-4 py-2">
                            <span className="text-gray-300">{item.category}</span>
                            <span className="font-bold text-indigo-400">{item.weight}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.type === 'definition' && (
                      <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4">
                        <div className="font-bold text-purple-400 mb-2">{section.term}</div>
                        <p className="text-gray-300">{section.content}</p>
                      </div>
                    )}

                    {section.type === 'terms' && (
                      <div className="grid md:grid-cols-2 gap-3">
                        {section.items.map((item, i) => (
                          <div key={i} className="bg-black/30 rounded-xl p-3">
                            <div className="font-bold text-teal-400 text-sm">{item.term}</div>
                            <div className="text-xs text-gray-400">{item.def}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.type === 'options' && (
                      <div className="space-y-3">
                        {section.items.map((item, i) => (
                          <div key={i} className="bg-black/30 rounded-xl p-4 border border-white/10 hover:border-indigo-500/50 transition-all cursor-pointer">
                            <div className="font-bold text-indigo-400 mb-1">{item.name}</div>
                            <div className="text-sm text-gray-400">{item.desc}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================
  // PROMPT LAB
  // ==============================================
  if (currentView === 'promptlab') {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <HomeButton />
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setCurrentView('hub')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Hub
          </button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">🧪 Prompt Practice Lab</h1>
            <p className="text-gray-400">Practice the Magnificent Seven prompting strategies - get analysis AND see how to improve!</p>
          </div>

          {/* Unlocked Templates Section */}
          {unlockedFeatures.promptTemplates && (
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Gift className="w-6 h-6 text-purple-400" />
                🎁 Unlocked: Prompt Templates Library
              </h2>
              <p className="text-sm text-gray-400 mb-4">Click any template to load it into your prompt editor:</p>
              <div className="grid md:grid-cols-2 gap-3">
                {promptTemplates.map((template, i) => (
                  <button
                    key={i}
                    onClick={() => setUserPrompt(template.prompt)}
                    className="bg-black/40 border border-purple-500/20 rounded-xl p-4 text-left hover:bg-purple-900/30 hover:border-purple-500/40 transition-all"
                  >
                    <div className="font-bold text-purple-300 mb-1">{template.name}</div>
                    <div className="text-xs text-gray-500">All 7 strategies included • Click to load</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">The Magnificent Seven</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {strategies.map((s, i) => (
                <div key={i} className="bg-black/30 rounded-xl p-3 flex items-start gap-3">
                  <span className="text-2xl">{['👤', '📚', '🔗', '🎬', '🔄', '🎮', '📝'][i]}</span>
                  <div>
                    <div className="font-bold text-indigo-400">{s.name}</div>
                    <div className="text-xs text-gray-400">{s.hint}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Test Your Prompt</h2>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Paste your prompt here to analyze which strategies you've used..."
              className="w-full h-48 bg-black/30 border border-white/10 rounded-xl p-4 text-gray-300 focus:outline-none focus:border-indigo-500 resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={checkPrompt}
                disabled={!userPrompt.trim() || isAnalyzing}
                className="flex-1 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:opacity-50 rounded-xl font-bold text-lg"
              >
                {isAnalyzing ? '🔍 Analyzing...' : '⚡ Analyze My Prompt'}
              </button>
              <button
                onClick={rewritePrompt}
                disabled={!userPrompt.trim() || isRewriting}
                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 rounded-xl font-bold text-lg"
              >
                {isRewriting ? '✨ Rewriting...' : '🪄 Rewrite & Improve'}
              </button>
            </div>
          </div>

          {promptAnalysis && (
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                Analysis Results
              </h2>
              <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                {promptAnalysis}
              </div>
            </div>
          )}

          {rewrittenPrompt && (
            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  Improved Prompt (All 7 Strategies)
                </h2>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(rewrittenPrompt);
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-semibold flex items-center gap-2"
                >
                  📋 Copy to Clipboard
                </button>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-green-500/20">
                <div className="whitespace-pre-wrap text-gray-200 leading-relaxed font-mono text-sm">
                  {rewrittenPrompt}
                </div>
              </div>
              <div className="mt-4 bg-green-900/30 rounded-lg p-3">
                <p className="text-sm text-green-300">
                  💡 <strong>Tip:</strong> Study how each strategy was incorporated, then try writing your own version!
                </p>
              </div>
            </div>
          )}

          {!unlockedFeatures.promptTemplates && (
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <Lock className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-purple-400 mb-2">🔒 Locked: Prompt Templates Library</h3>
                  <p className="text-sm text-gray-300">
                    Complete the "Shoot Your Shot" (Week 4) flashcard deck to unlock the <strong>PROMPTPRO</strong> code, which gives you access to 4 ready-to-use prompt templates with all 7 strategies!
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Zap className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-indigo-400 mb-2">How to Use This Lab</h3>
                <ol className="text-sm text-gray-300 space-y-2">
                  <li><strong>1. Write a prompt</strong> for any business scenario you're working on</li>
                  <li><strong>2. Click "Analyze"</strong> to see which strategies you've included</li>
                  <li><strong>3. Click "Rewrite & Improve"</strong> to see a perfected version with all 7 strategies</li>
                  <li><strong>4. Compare & learn</strong> from the differences to improve your prompting skills!</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================
  // WEEKS 1-5
  // ==============================================
  if (currentView === 'weeks15') {
    return (
      <div className="min-h-screen bg-black text-white">
        <HomeButton />
        <div className="flex h-screen">
          <div className="w-64 border-r border-white/10 p-6 overflow-y-auto">
            <button 
              onClick={() => setCurrentView('hub')}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 w-full"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="text-xl font-bold mb-6">Weeks 1-5</h2>
            {Object.keys(weeks15).map(key => (
              <button
                key={key}
                onClick={() => setSelectedWeek(key)}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-all ${
                  selectedWeek === key 
                    ? 'bg-indigo-600 text-white' 
                    : 'hover:bg-white/5 text-gray-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    {weeks15[key].title}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{weeks15[selectedWeek].title}</h1>
                <p className="text-xl text-gray-400">{weeks15[selectedWeek].subtitle}</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="prose prose-invert max-w-none">
                  {weeks15[selectedWeek].content.split('\n').map((line, i) => (
                    <p key={i} className="mb-4 text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-6 bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Gift className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-yellow-400 mb-2">Hidden Code Hint</h3>
                    <p className="text-sm text-gray-300">
                      Complete the flashcard deck for this week's topic to discover a secret unlock code! 🔓
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================
  // WEEKS 6-10
  // ==============================================
  if (currentView === 'weeks610') {
    return (
      <div className="min-h-screen bg-black text-white">
        <HomeButton />
        <div className="flex h-screen">
          <div className="w-64 border-r border-white/10 p-6 overflow-y-auto">
            <button 
              onClick={() => setCurrentView('hub')}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 w-full"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="text-xl font-bold mb-6">Weeks 6-10</h2>
            {Object.keys(weeks610).map(key => (
              <button
                key={key}
                onClick={() => setSelectedWeek(key)}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-all ${
                  selectedWeek === key 
                    ? 'bg-purple-600 text-white' 
                    : 'hover:bg-white/5 text-gray-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    {weeks610[key].title}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{weeks610[selectedWeek].title}</h1>
                <p className="text-xl text-gray-400">{weeks610[selectedWeek].subtitle}</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="prose prose-invert max-w-none">
                  {weeks610[selectedWeek].content.split('\n').map((line, i) => (
                    <p key={i} className="mb-4 text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-6 bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-purple-400 mb-2">Apply What You Learned</h3>
                    <p className="text-sm text-gray-300">
                      Use the AI Chat Tutor to discuss these concepts, or check the Assignment Workshop for related projects!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================
  // GLOSSARY
  // ==============================================
  if (currentView === 'glossary') {
    const filteredGlossary = glossary.filter(item => 
      item.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      item.definition.toLowerCase().includes(glossarySearch.toLowerCase())
    );

    // Mark glossary as viewed
    if (!completedModules.glossary) {
      setCompletedModules(prev => ({ ...prev, glossary: true }));
    }

    return (
      <div className="min-h-screen bg-black text-white p-6">
        <HomeButton />
        <div className="max-w-5xl mx-auto">
          <button 
            onClick={() => setCurrentView('hub')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Hub
          </button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Key Terms Glossary</h1>
            <p className="text-gray-400">Essential AI and business terminology for COLL.121</p>
          </div>

          <div className="mb-6">
            <input
              type="text"
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              placeholder="Search terms..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="space-y-4">
            {filteredGlossary.map((item, index) => (
              <div 
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
              >
                <h3 className="text-xl font-bold text-teal-400 mb-3">{item.term}</h3>
                <div className="mb-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Definition</div>
                  <p className="text-gray-300">{item.definition}</p>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Business Application</div>
                  <p className="text-gray-400 text-sm">{item.application}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredGlossary.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No terms found matching "{glossarySearch}"
            </div>
          )}

          <div className="mt-8 bg-teal-900/20 border border-teal-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-teal-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-teal-400 mb-2">Study Tip</h3>
                <p className="text-sm text-gray-300">
                  These terms appear throughout the course. Try explaining each one in your own words, or ask the AI Chat Tutor to quiz you!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================
  // CERTIFICATE GENERATOR
  // ==============================================
  if (currentView === 'certificate') {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-950 via-black to-amber-950 text-white p-6">
        <HomeButton />
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setCurrentView('achievements')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Achievements
          </button>

          {/* Certificate Preview */}
          <div className="bg-gradient-to-br from-amber-100 to-yellow-50 rounded-3xl p-2 shadow-2xl shadow-yellow-500/20">
            <div className="border-4 border-yellow-600 rounded-2xl p-12 text-center bg-white">
              <div className="text-6xl mb-4">🏆</div>
              <div className="text-yellow-600 text-sm uppercase tracking-[0.3em] mb-4">Certificate of Completion</div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">COLL.121: AI for Business</h1>
              <div className="w-32 h-1 bg-yellow-500 mx-auto my-6"></div>
              <p className="text-gray-600 mb-2">This certifies that</p>
              <p className="text-3xl font-bold text-gray-800 mb-4">{userProfile.name || 'Student'}</p>
              <p className="text-gray-600 mb-8">
                has successfully completed the AI for Business course,<br />
                demonstrating proficiency in prompt engineering, RAG systems,<br />
                and AI business applications.
              </p>
              <div className="flex justify-center items-center gap-12 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{calculateProgress()}%</div>
                  <div className="text-sm text-gray-500">Course Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{redeemedCodes.length}</div>
                  <div className="text-sm text-gray-500">Achievements</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {Object.values(completedModules.studybuddy).filter(Boolean).length}
                  </div>
                  <div className="text-sm text-gray-500">Topics Mastered</div>
                </div>
              </div>
              <div className="flex justify-between items-end px-12">
                <div className="text-center">
                  <div className="w-40 border-t-2 border-gray-400 pt-2">
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="text-gray-800">{today}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-40 border-t-2 border-gray-400 pt-2">
                    <p className="text-sm text-gray-600">Instructor</p>
                    <p className="text-gray-800">Prof. Hassan Akmal</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-xs text-gray-400">
                Golden Scholar Achievement • Code: 1.618
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 mb-4">Take a screenshot to save your certificate!</p>
            <button
              onClick={() => setCurrentView('achievements')}
              className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 rounded-xl font-semibold"
            >
              Back to Achievements
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================
  // CASE STUDIES (Unlocked with BIZWIZ25)
  // ==============================================
  if (currentView === 'casestudies') {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <HomeButton />
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setCurrentView('hub')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Hub
          </button>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-900/30 border border-green-500/30 rounded-full text-sm mb-4">
              <Unlock className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Unlocked Feature</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">💼 Case Study Library</h1>
            <p className="text-gray-400">Real-world examples of AI transforming businesses</p>
          </div>

          <div className="space-y-6">
            {caseStudies.map((study, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs px-2 py-1 bg-indigo-900/50 border border-indigo-500/30 rounded-full text-indigo-300">
                      {study.industry}
                    </span>
                    <h3 className="text-xl font-bold mt-2">{study.title}</h3>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Challenge</div>
                    <p className="text-gray-300">{study.challenge}</p>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">AI Solution</div>
                    <p className="text-gray-300">{study.aiSolution}</p>
                  </div>
                  
                  <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-4">
                    <div className="text-xs text-green-400 uppercase tracking-wide mb-1">Results</div>
                    <p className="text-green-300">{study.results}</p>
                  </div>
                  
                  <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4">
                    <div className="text-xs text-indigo-400 uppercase tracking-wide mb-1">Key Lesson</div>
                    <p className="text-indigo-300">{study.lesson}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-yellow-400 mb-2">Apply These Lessons</h3>
                <p className="text-sm text-gray-300">
                  Use these case studies as inspiration for Assignment 6 (AI Business Plan). Think about how you could apply similar AI solutions to problems you've seen in your own life or work!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <HomeButton />
      <UnlockCelebration />
    </>
  );
};

export default CompleteAITutorSystem;
