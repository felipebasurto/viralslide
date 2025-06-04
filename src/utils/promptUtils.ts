
interface PromptConfig {
  prompts: {
    viral_hooks: {
      en: string;
      es: string;
    };
    organic_hooks: {
      en: string;
      es: string;
    };
    organic_instructions: string;
    slide_instructions: string;
    json_format: string;
  };
}

// Since we can't dynamically import YAML in the browser, we'll define the config as a JS object
const promptConfig: PromptConfig = {
  prompts: {
    viral_hooks: {
      en: `EXAMPLES OF VIRAL HOOKS (use as inspiration):
- "what if I told you there's a simple way to achieve [RESULT]?"
- "stop scrolling if you want to discover [SECRET]"
- "imagine if you could [DESIRED OUTCOME]"
- "why does nobody talk about [TOPIC]?"
- "this will change how you see [TOPIC]"
- "everything you knew about [TOPIC] is 100% wrong"
- "have you ever wondered why [PROBLEM]?"
- "nobody told you this yet but [TRUTH]"
- "are you tired of [PROBLEM]? then try this"
- "here's why 99% of [AUDIENCE] fail at [TOPIC]"`,
      es: `EXAMPLES OF VIRAL HOOKS (use as inspiration):
- "¿sabías que hay una forma sencilla de conseguir [RESULTADO]?"
- "deja de desplazarte si quieres descubrir [SECRETO]"
- "¿y si te dijera que [RESULTADO] está a un solo paso?"
- "¿por qué nadie habla de [TEMA]?"
- "imagina que pudieras [RESULTADO DESEADO]"
- "esto cambiará tu forma de ver [TEMA]"
- "todo lo que sabías sobre [TEMA] es 100% erróneo"
- "¿te has preguntado alguna vez por qué [PROBLEMA]?"
- "nadie te lo ha dicho todavía pero [VERDAD]"
- "¿estás cansado de [PROBLEMA]? entonces prueba esto"`
    },
    organic_hooks: {
      en: `EXAMPLES OF ORGANIC EDUCATIONAL HOOKS (use as inspiration):
- "3 things I learned about [TOPIC] after years of experience"
- "why [CONCEPT] actually works (explained simply)"
- "the difference between [OPTION A] and [OPTION B] nobody explains"
- "5 signs you're doing [ACTIVITY] correctly"
- "what actually happens when [PROCESS] - the science behind it"
- "common [AREA] mistakes you can easily avoid"
- "how [CONCEPT] actually works - step by step guide"
- "important [TOPIC] lessons that took me years to learn"`,
      es: `EJEMPLOS DE HOOKS ORGÁNICOS EDUCATIVOS (usa como inspiración):
- "3 cosas que aprendí sobre [TEMA] después de años de experiencia"
- "por qué [CONCEPTO] funciona realmente (explicado simple)"
- "la diferencia entre [OPCIÓN A] y [OPCIÓN B] que nadie explica"
- "5 señales de que estás haciendo [ACTIVIDAD] correctamente"
- "qué pasa realmente cuando [PROCESO] - la ciencia detrás"
- "errores comunes en [ÁREA] que puedes evitar fácilmente"
- "cómo funciona realmente [CONCEPTO] - guía paso a paso"
- "lecciones importantes sobre [TEMA] que me tomó años aprender"`
    },
    organic_instructions: `ORGANIC CONTENT MODE - CRITICAL REQUIREMENTS:
- Generate PURELY EDUCATIONAL content with zero promotional elements
- Focus on sharing genuine knowledge, insights, and practical tips
- No mentions of products, services, apps, tools, or anything that could be construed as promotional
- No calls-to-actions for purchases, sign-ups, downloads, or external links
- Content should feel like a helpful teacher sharing valuable knowledge
- Use conversational, authentic tone focused on education
- End with engagement questions about learning experiences or knowledge sharing
- No "limited time," "special offer," "our solution," "buy now," or similar language
- The goal is to provide pure value and education to the audience`,
    slide_instructions: `INSTRUCTIONS FOR ORGANIC EDUCATIONAL SLIDES

CRITICAL GUIDELINES  
- avoid any language that implies you're selling or promoting a service/product  
- content must feel like a genuine, free resource—no "buy now," no "special offer," no "limited time," etc.  
- focus solely on sharing insights, practical tips, or thought-provoking ideas that readers can use immediately  
- tone should be conversational, authentic, lowercase, and free of emojis or markdown  

STRUCTURE (7 SLIDES TOTAL)  
1. **HOOK (slide 1)**  
   - one scroll-stopping sentence that sparks curiosity or challenges a common belief  
   - use psychological triggers (e.g., surprising fact, counterintuitive statement, emotional appeal)  
   - do not hint at a product or service—make it feel like a free insight  

2. **CONTENT SLIDES (slides 2–6)**  
   - five slides of purely actionable, no-fluff advice or ideas  
   - each slide must present one standalone "aha" moment or practical tactic  
   - avoid any reference to "our tool," "our solution," "download," "sign up," etc.  
   - write in lowercase; keep sentences short, clear, and conversational  

3. **CTA (slide 7)**  
   - encourage organic engagement: ask a question or invite readers to comment/share their thoughts or experiences  
   - do not ask for clicks, sign-ups, or purchases  

EXAMPLE ADJUSTMENTS  
- if your original hook sounded like "ready to transform your workflow with our app?", change it to "most people waste hours on busywork without realizing it"  
- replace any slide that hints at a product with a slide that simply explains a new perspective, a statistic, or a small ritual readers can try today  
- the CTA should never "learn more" or "book a call" but something like "what's your experience? share below"`,
    json_format: `JSON format:
{
  "title": "authentic lowercase title that promises real value",
  "hook": "{hook_type} that {hook_description}",
  "slides": ["value slide 1", "value slide 2", "value slide 3", "value slide 4", "value slide 5"],
  "cta": "organic engagement call-to-action that asks for comments/shares/experiences",
  "searchTerms": ["visual 1", "visual 2", "visual 3", "visual 4", "visual 5", "visual 6", "visual 7"]
}`
  }
};

export const buildPrompt = (
  formatId: string,
  systemPrompt: string,
  customTopic: string,
  language: string,
  customFormat: string,
  organicMode: boolean,
  formatInfo?: { title: string }
): string => {
  const topic = customTopic || `${formatInfo?.title.toLowerCase()} content`;
  const languageInstruction = language === "es" ? 
    "Respond in Spanish. All content should be in Spanish." : 
    "Respond in English. All content should be in English.";

  const formatInstruction = formatId === "custom" && customFormat ? 
    `Create content using this CUSTOM FORMAT: ${customFormat}` : 
    `Create viral TikTok slideshow content in "${formatInfo?.title}" format`;

  const hooksSection = organicMode 
    ? promptConfig.prompts.organic_hooks[language as 'en' | 'es']
    : promptConfig.prompts.viral_hooks[language as 'en' | 'es'];

  const organicInstructions = organicMode ? promptConfig.prompts.organic_instructions : "";

  const hookDescription = organicMode 
    ? "educational hook that teaches something valuable"
    : "viral hook that stops scrolling immediately";

  const jsonFormat = promptConfig.prompts.json_format.replace(
    "{hook_type}",
    organicMode ? "educational hook" : "viral hook"
  ).replace(
    "{hook_description}",
    hookDescription
  );

  return `${formatInstruction} for: ${systemPrompt}

${customTopic ? `Topic: ${topic}` : ''}

${languageInstruction}

${hooksSection}

${organicInstructions}

${promptConfig.prompts.slide_instructions}

${jsonFormat}`;
};
