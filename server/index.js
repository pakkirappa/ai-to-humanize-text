const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Word count utility
function getWordCount(text) {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Enhanced humanization with variation tracking
function humanizeText(text, targetWordCount) {
  let result = text;
  const usedPatterns = new Set(); // Track what we've already applied
  
  // Apply humanization layers selectively
  result = restructureSentences(result, targetWordCount, usedPatterns);
  result = varyVocabulary(result, targetWordCount);
  result = addNaturalElements(result, targetWordCount, usedPatterns);
  result = adjustWordCount(result, targetWordCount);
  
  return result;
}

function restructureSentences(text, targetWordCount, usedPatterns) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  return sentences.map((sentence, index) => {
    let modified = sentence.trim();
    
    // Only modify first sentence OR randomly modify others (not both)
    if (index === 0 && Math.random() < 0.4 && !usedPatterns.has('firstSentence')) {
      const openings = ['Look,', 'Here\'s the thing:', 'So basically,', 'Let me break this down:'];
      modified = openings[Math.floor(Math.random() * openings.length)] + ' ' + modified.toLowerCase();
      usedPatterns.add('firstSentence');
    } else if (index > 0 && Math.random() < 0.15 && !usedPatterns.has('midSentence')) {
      const starters = ['Actually,', 'Honestly,', 'To be fair,'];
      modified = starters[Math.floor(Math.random() * starters.length)] + ' ' + modified.toLowerCase();
      usedPatterns.add('midSentence');
    }
    
    // Apply contractions sparingly
    if (Math.random() < 0.6) {
      modified = modified.replace(/\bdo not\b/gi, "don't");
      modified = modified.replace(/\bcannot\b/gi, "can't");
      modified = modified.replace(/\bwill not\b/gi, "won't");
      modified = modified.replace(/\bit is\b/gi, "it's");
      modified = modified.replace(/\bthat is\b/gi, "that's");
    }
    
    // Break long sentences occasionally
    if (modified.length > 100 && Math.random() < 0.3) {
      const breakPoints = [' and ', ' but ', ' because '];
      for (const breakPoint of breakPoints) {
        if (modified.includes(breakPoint)) {
          const parts = modified.split(breakPoint);
          if (parts.length === 2) {
            modified = parts[0] + '. ' + parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
            break;
          }
        }
      }
    }
    
    return modified;
  }).join('. ') + '.';
}

function varyVocabulary(text, targetWordCount) {
  const synonymMaps = {
    // More natural, less formal replacements
    'utilize': ['use', 'work with'],
    'demonstrate': ['show', 'prove'],
    'facilitate': ['help', 'make easier'],
    'implement': ['put in place', 'set up'],
    'subsequently': ['later', 'then'],
    'nevertheless': ['however', 'but'],
    'furthermore': ['also', 'plus'],
    'therefore': ['so', 'thus'],
    'significant': ['important', 'big'],
    'approximately': ['about', 'around'],
    'numerous': ['many', 'lots of'],
    'conduct': ['do', 'run'],
    'commence': ['start', 'begin'],
    'methodology': ['approach', 'method'],
    'optimization': ['improvement', 'tweaking'],
    
    // Phrase simplification
    'in order to': ['to'],
    'due to the fact that': ['because'],
    'at this point in time': ['now'],
    'in the event that': ['if'],
    'with regard to': ['about']
  };
  
  let result = text;
  
  // Only replace some instances, not all
  for (const [original, alternatives] of Object.entries(synonymMaps)) {
    const regex = new RegExp(`\\b${original}\\b`, 'gi');
    const matches = result.match(regex);
    
    if (matches) {
      // Only replace 40-70% of instances
      const replaceCount = Math.floor(matches.length * (0.4 + Math.random() * 0.3));
      let replaced = 0;
      
      result = result.replace(regex, (match) => {
        if (replaced < replaceCount && Math.random() < 0.7) {
          replaced++;
          return alternatives[Math.floor(Math.random() * alternatives.length)];
        }
        return match;
      });
    }
  }
  
  return result;
}

function addNaturalElements(text, targetWordCount, usedPatterns) {
  let result = text;
  const currentWordCount = getWordCount(result);
  
  // Add ONE type of natural element, not multiple
  const elementTypes = ['transition', 'personal', 'emphasis', 'casual'];
  const chosenType = elementTypes[Math.floor(Math.random() * elementTypes.length)];
  
  if (currentWordCount < targetWordCount * 0.95) {
    switch (chosenType) {
      case 'transition':
        if (!usedPatterns.has('transition')) {
          result = addTransition(result);
          usedPatterns.add('transition');
        }
        break;
        
      case 'personal':
        if (!usedPatterns.has('personal')) {
          result = addPersonalTouch(result);
          usedPatterns.add('personal');
        }
        break;
        
      case 'emphasis':
        if (!usedPatterns.has('emphasis')) {
          result = addEmphasis(result);
          usedPatterns.add('emphasis');
        }
        break;
        
      case 'casual':
        if (!usedPatterns.has('casual')) {
          result = addCasualElement(result);
          usedPatterns.add('casual');
        }
        break;
    }
  }
  
  return result;
}

function addTransition(text) {
  const transitions = ['Also,', 'Plus,', 'What\'s more,', 'Additionally,'];
  const sentences = text.split('.').filter(s => s.trim().length > 0);
  
  if (sentences.length > 2 && Math.random() < 0.5) {
    const randomIndex = 1 + Math.floor(Math.random() * (sentences.length - 2));
    const transition = transitions[Math.floor(Math.random() * transitions.length)];
    sentences[randomIndex] = ' ' + transition + ' ' + sentences[randomIndex].trim().toLowerCase();
  }
  
  return sentences.join('.') + '.';
}

function addPersonalTouch(text) {
  const personalExpressions = [
    'in my experience', 'from what I understand', 'personally speaking'
  ];
  
  if (Math.random() < 0.4) {
    const expression = personalExpressions[Math.floor(Math.random() * personalExpressions.length)];
    return text.replace(/\. /, `, ${expression}. `);
  }
  
  return text;
}

function addEmphasis(text) {
  const emphasis = ['really', 'actually', 'quite', 'pretty'];
  const word = emphasis[Math.floor(Math.random() * emphasis.length)];
  
  return text.replace(/\b(is|are|was|were)\b/, `${word} $1`);
}

function addCasualElement(text) {
  const casualElements = [
    ', which is pretty cool',
    ', if you ask me',
    ', to be honest'
  ];
  
  if (Math.random() < 0.3) {
    const element = casualElements[Math.floor(Math.random() * casualElements.length)];
    return text.replace(/\.$/, element + '.');
  }
  
  return text;
}

function adjustWordCount(text, targetWordCount) {
  let result = text;
  let currentWordCount = getWordCount(result);
  
  // If too short, add ONE meaningful filler
  if (currentWordCount < targetWordCount * 0.9) {
    const fillers = [
      'It\'s worth noting that',
      'What\'s interesting is that',
      'From a practical standpoint,',
      'When you think about it,'
    ];
    
    const filler = fillers[Math.floor(Math.random() * fillers.length)];
    const sentences = result.split('.');
    const randomIndex = Math.floor(Math.random() * Math.max(1, sentences.length - 1));
    sentences[randomIndex] += '. ' + filler;
    result = sentences.join('.');
  }
  
  // If too long, trim intelligently
  if (getWordCount(result) > targetWordCount * 1.05) {
    const words = result.split(' ');
    result = words.slice(0, targetWordCount).join(' ');
    
    // Ensure proper ending
    if (!result.match(/[.!?]$/)) {
      result += '.';
    }
  }
  
  return result;
}

app.post("/humanize", async (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }
  
  try {
    const originalWordCount = getWordCount(text);
    
    // Apply humanization
    let humanized = humanizeText(text, originalWordCount);
    
    // Final cleanup
    humanized = finalPolish(humanized);
    
    const finalWordCount = getWordCount(humanized);
    
    res.json({ 
      humanized,
      originalWordCount,
      finalWordCount
    });
  } catch (err) {
    console.error('Humanization error:', err);
    res.status(500).json({ error: "Humanization failed.", details: err.message });
  }
});

function finalPolish(text) {
  let result = text;
  
  // Clean up formatting
  result = result.replace(/\s+/g, ' ');
  result = result.replace(/\.\s*\./g, '.');
  result = result.replace(/\.\s+([a-z])/g, (match, letter) => '. ' + letter.toUpperCase());
  
  // Fix capitalization after starters
  result = result.replace(/(Actually|Honestly|To be fair|Also|Plus),\s+([a-z])/g, 
    (match, starter, letter) => `${starter}, ${letter.toUpperCase()}`);
  
  return result;
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));


