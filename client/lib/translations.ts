export interface Translation {
  [key: string]: string;
}

export interface Translations {
  en: Translation;
  hi: Translation;
  te: Translation;
}

export const translations: Translations = {
  en: {
    // Header
    'header.title': 'CareerCompass',
    'header.subtitle': 'AI-Powered Career Guide',
    'header.login': 'Login',
    'header.getStarted': 'Get Started',
    'header.compareCareers': 'Compare Careers',
    'header.resumeAnalyzer': 'Resume Analyzer',
    'header.careerRoadmaps': 'Career Roadmaps',
    'header.aiAssistant': 'AI Assistant',
    'header.dailyTips': 'Daily Tips',
    'header.goalTracker': 'Goal Tracker',
    
    // Hero Section
    'hero.title': 'Discover Your',
    'hero.subtitle': 'Perfect Career Path',
    'hero.description': 'Powered by advanced AI, we analyze your interests, skills, and academic background to recommend careers that perfectly match your unique profile. Start your journey towards a fulfilling and successful career today.',
    'hero.cta': 'Your journey to success starts here.',
    
    // Stats
    'stats.accuracy': '95% Accuracy',
    'stats.students': '10K+ Students',
    'stats.careers': '500+ Careers',
    
    // Assessment Form
    'assessment.title': 'AI-Powered Career Assessment',
    'assessment.description': 'Answer a few questions to get personalized career recommendations powered by advanced artificial intelligence',
    'assessment.academicBackground': 'Academic Background',
    'assessment.stream': 'Academic Stream',
    'assessment.streamPlaceholder': 'Select your academic stream',
    'assessment.cgpa': 'CGPA / Percentage',
    'assessment.cgpaPlaceholder': 'e.g., 8.5 or 85%',
    'assessment.experience': 'Experience Level',
    'assessment.experiencePlaceholder': 'Select your experience level',
    'assessment.careerGoal': 'Career Goal Timeline',
    'assessment.careerGoalPlaceholder': 'When do you want to start?',
    'assessment.skills': 'Your Skills',
    'assessment.interests': 'Your Interests',
    'assessment.submitButton': 'Generate AI Career Recommendations',
    
    // Loading
    'loading.title': 'AI is Analyzing Your Profile',
    'loading.description': 'Please wait while we generate your personalized career recommendations',
    
    // Results
    'results.title': 'Your Personalized Career Recommendations',
    'results.description': 'Based on your profile analysis, here are the top career paths tailored for you',
    'results.takeAgain': 'Take Assessment Again',
    'results.export': 'Export Results',
    
    // Career Cards
    'career.match': 'Match',
    'career.salary': 'Salary Range',
    'career.growth': 'Job Growth',
    'career.skills': 'Key Skills Required',
    'career.companies': 'Top Hiring Companies',
    'career.overview': 'Overview',
    'career.roadmap': 'Roadmap',
    'career.courses': 'Courses',
    'career.jobs': 'Jobs',
    
    // Features
    'features.title': 'Why Choose CareerCompass?',
    'features.description': 'Our comprehensive AI-powered platform provides everything you need for career success',
    'features.aiAnalysis': 'AI-Powered Analysis',
    'features.aiDescription': 'Advanced machine learning algorithms analyze your complete profile for accurate recommendations',
    'features.marketData': 'Real-time Market Data',
    'features.marketDescription': 'Live salary data, job market trends, and industry insights updated daily',
    'features.roadmaps': 'Personalized Roadmaps',
    'features.roadmapsDescription': 'Step-by-step learning paths with courses, certifications, and project recommendations',
    'features.guidance': 'Expert Guidance',
    'features.guidanceDescription': '24/7 AI career assistant and access to industry mentors and career counselors'
  },
  
  hi: {
    // Header
    'header.title': 'CareerCompass',
    'header.subtitle': 'AI-संचालित करियर गाइड',
    'header.login': 'लॉगिन',
    'header.getStarted': 'शुरू करें',
    'header.compareCareers': 'करियर तुलना करें',
    'header.resumeAnalyzer': 'रिज्यूमे विश्लेषक',
    'header.careerRoadmaps': 'करियर रोडमैप',
    'header.aiAssistant': 'AI सहायक',
    'header.dailyTips': 'दैनिक टिप्स',
    'header.goalTracker': 'लक्ष्य ट्रैकर',
    
    // Hero Section
    'hero.title': 'अपना खोजें',
    'hero.subtitle': 'आदर्श करियर पथ',
    'hero.description': 'उन्नत AI द्वारा संचालित, हम आपकी रुचियों, कौशल और शैक्षणिक पृष्ठभूमि का विश्लेषण करते हैं ताक��� आपके अनूठे प्रोफाइल से पूर्णतः मेल खाने वाले करियर की सिफारिश कर सकें। आज ही अपनी संतुष्टिजनक और सफल करियर की यात्��ा शुरू करें।',
    'hero.cta': 'आपकी सफलता की यात्रा यहाँ से शुरू होती है।',
    
    // Stats
    'stats.accuracy': '95% सटीकता',
    'stats.students': '10K+ छात्र',
    'stats.careers': '500+ करियर',
    
    // Assessment Form
    'assessment.title': 'AI-संचालित करियर मूल्यांकन',
    'assessment.description': 'उन्नत आर्टिफिशियल इंटेलिजेंस द्वारा संचालित व्यक्तिगत करियर सिफारिशें प्राप्त करने के लिए कुछ प्रश्नों के उत्तर दें',
    'assessment.academicBackground': 'शैक्षणिक पृष्ठभूमि',
    'assessment.stream': 'शैक्षणिक स्ट्रीम',
    'assessment.streamPlaceholder': 'अपनी शैक्���णिक स्ट्रीम चुनें',
    'assessment.cgpa': 'CGPA / प्रतिशत',
    'assessment.cgpaPlaceholder': 'जैसे, 8.5 या 85%',
    'assessment.experience': 'अनुभव स्तर',
    'assessment.experiencePlaceholder': 'अपना अनुभव स्तर चुनें',
    'assessment.careerGoal': 'करियर लक्ष्य समयसीमा',
    'assessment.careerGoalPlaceholder': 'आप कब शुरू करना चाहते हैं?',
    'assessment.skills': 'आपके कौशल',
    'assessment.interests': 'आपकी रुचियां',
    'assessment.submitButton': 'AI करियर सिफारिशें उत्पन्�� करें',
    
    // Loading
    'loading.title': 'AI आपकी प्रोफाइल का विश्लेषण कर रहा है',
    'loading.description': 'कृपया प्रतीक्षा करें जबकि हम आपकी व्यक्तिगत करियर सिफारिशें तैयार करते हैं',
    
    // Results
    'results.title': 'आपकी व्यक्तिगत करियर सिफारिशें',
    'results.description': 'आपके प्रो��ाइल विश्लेषण के आधार पर, यहाँ आपके लिए तैयार किए गए शीर्ष करियर पथ हैं',
    'results.takeAgain': 'मूल्यांकन फिर से लें',
    'results.export': 'परिणा��� निर्यात करें'
  },
  
  te: {
    // Header
    'header.title': 'CareerCompass',
    'header.subtitle': 'AI-ఆధారిత కెరీర్ గైడ్',
    'header.login': 'లాగిన్',
    'header.getStarted': 'ప్రారంభించండి',
    'header.compareCareers': 'కెరీర్లను పోల్చండి',
    'header.resumeAnalyzer': 'రెజ్యూమ్ ఎనలైజర్',
    'header.careerRoadmaps': 'కెరీర్ రోడ్‌మ్యాప్‌లు',
    'header.aiAssistant': 'AI అసిస్టెంట్',
    'header.dailyTips': 'దైనిక టిప్స్',
    'header.goalTracker': 'లక్ష్య ట్రాకర్',
    
    // Hero Section
    'hero.title': 'మీ కనుగొనండి',
    'hero.subtitle': 'పరిపూర్ణ కెరీర్ మార్గం',
    'hero.description': 'అధునాతన AI ద్వారా శక్తివంతం, మేము మీ అభిరుచులు, నైపుణ్యాలు మరియు అకాడెమిక్ నేపథ్యాన్ని విశ్లేషించి మీ ప్రత్యేక ప్రొఫైల్‌తో పూర్తిగా సరిపో��ే కెరీర్‌లను సిఫార్సు చేస్తాము. సంతృప్తికరమైన మరియు విజయవంతమైన కెరీర్ వైపు మీ ప్రయాణాన్ని ఈరోజే ప్రారంభించండి.',
    'hero.cta': 'మీ విజయ ప్రయాణం ఇక్కడ ప్రారంభమవుతుంది.',
    
    // Stats
    'stats.accuracy': '95% ఖచ్చితత్వం',
    'stats.students': '10K+ విద్యార్థులు',
    'stats.careers': '500+ కెరీర్లు',
    
    // Assessment Form
    'assessment.title': 'కెరీర్ అసెస్‌మెంట్',
    'assessment.description': 'వ్యక్తిగత AI-ఆధారిత కెరీర్ సిఫార్సులను పొందడానికి ఈ సమగ్ర అసెస్‌మెంట్‌ను పూర్తి చేయ���డి',
    'assessment.academicBackground': 'అకాడెమిక్ బ్యాక్‌గ్రౌండ్',
    'assessment.stream': 'అకాడెమిక్ స్ట్రీమ్',
    'assessment.streamPlaceholder': 'మీ అకాడెమిక్ స్ట్రీమ్‌ను ఎంచుకోండి',
    'assessment.cgpa': 'CGPA / శాతం',
    'assessment.cgpaPlaceholder': 'ఉదా., 8.5 లేదా 85%',
    'assessment.experience': 'అనుభవ స్థాయి',
    'assessment.experiencePlaceholder': 'మీ అనుభవ స్థాయిని ఎంచుకోండి',
    'assessment.careerGoal': 'కెరీర్ లక్ష్య కాలవ్యవధి',
    'assessment.careerGoalPlaceholder': 'మీరు ఎప్పుడు ప్రారంభించాలనుకుంటున్నారు?',
    'assessment.skills': 'మీ నైపుణ్యాలు',
    'assessment.interests': 'మీ అభిరుచులు',
    'assessment.submitButton': 'AI కెరీర్ సిఫార్సులను రూపొందించండి',
    
    // Loading
    'loading.title': 'AI మీ ప్రొఫైల్‌ను విశ్లేషిస్తోంది',
    'loading.description': 'మేము ��ీ వ్యక్తి��త కెరీర్ సిఫార్సులను రూపొందిస్తున్నప్పుడు దయచేసి వేచి ఉండండి',
    
    // Results
    'results.title': 'మీ వ్యక్తిగత కెరీర్ సిఫార్సులు',
    'results.description': 'మీ ప్రొఫైల్ విశ్లేషణ ఆధారంగా, మీ కోసం రూపొందించిన అగ్ర కెరీర్ మార్గాలు ఇవి',
    'results.takeAgain': 'అసెస్‌మెంట్‌ను మళ్లీ తీసుకోండి',
    'results.export': 'ఫలితాలను ఎగుమతి చేయండి'
  }
};

export type SupportedLanguage = keyof Translations;

export const supportedLanguages: { code: SupportedLanguage; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' }
];

export function getTranslation(language: SupportedLanguage, key: string): string {
  return translations[language]?.[key] || translations.en[key] || key;
}
