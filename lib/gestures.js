export const GESTURES = {
  FIST: {
    name: 'Fist',
    icon: '👊',
    english: 'Hello / Solidarity',
    description: 'Close all fingers into a tight fist',
    steps: ['Curl all fingers inward', 'Tuck thumb over fingers', 'Keep palm facing you'],
    fingers: { thumb: 'curled', index: 'curled', middle: 'curled', ring: 'curled', pinky: 'curled' }
  },
  OPEN_HAND: {
    name: 'Open Hand',
    icon: '🖐️',
    english: 'Stop / Five',
    description: 'Extend all fingers straight out',
    steps: ['Extend all fingers straight', 'Spread fingers slightly', 'Keep palm facing forward'],
    fingers: { thumb: 'extended', index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended' }
  },
  POINT_UP: {
    name: 'Point Up',
    icon: '☝️',
    english: 'One / Up',
    description: 'Extend only your index finger upward',
    steps: ['Curl all fingers except index', 'Point index finger upward', 'Keep hand steady'],
    fingers: { thumb: 'curled', index: 'extended', middle: 'curled', ring: 'curled', pinky: 'curled' }
  },
  PEACE: {
    name: 'Peace / V',
    icon: '✌️',
    english: 'Victory / Two',
    description: 'Extend index and middle fingers in a V shape',
    steps: ['Extend index and middle fingers', 'Form a V shape', 'Curl other fingers down'],
    fingers: { thumb: 'curled', index: 'extended', middle: 'extended', ring: 'curled', pinky: 'curled' }
  },
  THUMBS_UP: {
    name: 'Thumbs Up',
    icon: '👍',
    english: 'Good / Approval',
    description: 'Make a fist with thumb pointing up',
    steps: ['Make a fist', 'Extend thumb upward', 'Keep other fingers curled'],
    fingers: { thumb: 'extended', index: 'curled', middle: 'curled', ring: 'curled', pinky: 'curled' },
    thumbDirection: 'up'
  },
  THUMBS_DOWN: {
    name: 'Thumbs Down',
    icon: '👎',
    english: 'Bad / Disapproval',
    description: 'Make a fist with thumb pointing down',
    steps: ['Make a fist', 'Point thumb downward', 'Keep other fingers curled'],
    fingers: { thumb: 'extended', index: 'curled', middle: 'curled', ring: 'curled', pinky: 'curled' },
    thumbDirection: 'down'
  },
  SHAKA: {
    name: 'Shaka',
    icon: '🤙',
    english: 'Call me / Hang loose',
    description: 'Extend thumb and pinky, curl middle fingers',
    steps: ['Extend thumb and pinky', 'Curl middle three fingers', 'Rotate hand slightly'],
    fingers: { thumb: 'extended', index: 'curled', middle: 'curled', ring: 'curled', pinky: 'extended' }
  },
  LOVE_YOU: {
    name: 'I Love You',
    icon: '🤟',
    english: 'I Love You (ASL)',
    description: 'Extend thumb, index, and pinky; curl middle and ring',
    steps: ['Extend thumb, index, and pinky', 'Curl middle and ring fingers', 'Form the ASL "ILY" sign'],
    fingers: { thumb: 'extended', index: 'extended', middle: 'curled', ring: 'curled', pinky: 'extended' }
  },
  ROCK_ON: {
    name: 'Rock On',
    icon: '🤘',
    english: 'Rock / Heavy Metal',
    description: 'Extend index and pinky; curl middle, ring, and thumb',
    steps: ['Extend index and pinky', 'Curl middle and ring fingers', 'Tuck thumb over curled fingers'],
    fingers: { thumb: 'curled', index: 'extended', middle: 'curled', ring: 'curled', pinky: 'extended' }
  },
  OK_SIGN: {
    name: 'OK',
    icon: '👌',
    english: 'Okay / Perfect',
    description: 'Touch thumb and index tip to form a circle',
    steps: ['Touch thumb tip to index tip', 'Form a circle', 'Extend other three fingers'],
    fingers: { thumb: 'extended', index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended' },
    special: 'okCircle'
  },
  THREE: {
    name: 'Three',
    icon: '3️⃣',
    english: 'Three',
    description: 'Extend thumb, index, and middle fingers',
    steps: ['Extend thumb, index, and middle', 'Curl ring and pinky', 'Hold steady'],
    fingers: { thumb: 'extended', index: 'extended', middle: 'extended', ring: 'curled', pinky: 'curled' }
  },
  FOUR: {
    name: 'Four',
    icon: '🖖',
    english: 'Four',
    description: 'Extend four fingers, curl thumb inward',
    steps: ['Extend index through pinky', 'Curl thumb inward', 'Spread fingers slightly'],
    fingers: { thumb: 'curled', index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended' }
  }
};

export const CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],
  [5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],
  [13,17],[17,18],[18,19],[19,20],[0,17]
];

export const FINGER_INDICES = {
  thumb: { tip: 4, ip: 3, mcp: 1 },
  index: { tip: 8, pip: 6, mcp: 5 },
  middle: { tip: 12, pip: 10, mcp: 9 },
  ring: { tip: 16, pip: 14, mcp: 13 },
  pinky: { tip: 20, pip: 18, mcp: 17 }
};

export function isFingerExtended(landmarks, fingerType, handedness) {
  const finger = FINGER_INDICES[fingerType];
  if (!finger) return false;

  if (fingerType === 'thumb') {
    const isMirrored = handedness === 'Left';
    return isMirrored ? landmarks[finger.tip].x > landmarks[finger.ip].x : landmarks[finger.tip].x < landmarks[finger.ip].x;
  }
  return landmarks[finger.tip].y < landmarks[finger.pip].y && landmarks[finger.pip].y < landmarks[finger.mcp].y;
}

export function getFingerStates(landmarks, handedness) {
  const states = {};
  for (const finger of Object.keys(FINGER_INDICES)) {
    states[finger] = isFingerExtended(landmarks, finger, handedness) ? 'extended' : 'curled';
  }
  return states;
}

export function distance(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

export function recognizeGesture(landmarks, handedness) {
  const fingerStates = getFingerStates(landmarks, handedness);
  let bestMatch = null, bestScore = 0;

  for (const [key, gesture] of Object.entries(GESTURES)) {
    let score = 0, totalChecks = 0;

    for (const [finger, expected] of Object.entries(gesture.fingers)) {
      totalChecks++;
      if (fingerStates[finger] === expected) score++;
    }

    if (gesture.thumbDirection) {
      totalChecks++;
      const thumbDir = landmarks[4].y > landmarks[1].y ? 'down' : 'up';
      if (thumbDir === gesture.thumbDirection) score++;
    }

    if (gesture.special === 'okCircle') {
      totalChecks++;
      if (distance(landmarks[4], landmarks[8]) < 0.05) score++;
    }

    const normalized = score / totalChecks;
    if (normalized > bestScore) {
      bestScore = normalized;
      bestMatch = { key, ...gesture, confidence: normalized };
    }
  }

  return bestMatch && bestScore >= 0.7 ? bestMatch : null;
}
