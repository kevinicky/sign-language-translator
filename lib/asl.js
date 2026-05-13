export const ASL_LETTERS = {
  A: {
    letter: 'A',
    icon: '✊',
    desc: 'Fist with thumb on side',
    check: (lm, h) => {
      const curled = ['index', 'middle', 'ring', 'pinky'].every(f => isCurled(lm, f, h));
      const thumbOut = lm[4].x < lm[3].x !== (h === 'Left');
      return curled && thumbOut;
    }
  },
  B: {
    letter: 'B',
    icon: '🖐️',
    desc: 'Four fingers up together, thumb tucked',
    check: (lm, h) => {
      const fourUp = ['index', 'middle', 'ring', 'pinky'].every(f => isExtended(lm, f, h));
      const thumbTucked = lm[4].y > lm[3].y;
      return fourUp && thumbTucked;
    }
  },
  C: {
    letter: 'C',
    icon: '🤏',
    desc: 'Curved hand like a C shape',
    check: (lm, h) => {
      const tipDist = distance(lm[4], lm[8]);
      const mcpSpread = distance(lm[5], lm[17]);
      return tipDist < 0.15 && mcpSpread > 0.15;
    }
  },
  D: {
    letter: 'D',
    icon: '☝️',
    desc: 'Index up, other fingers curled to thumb tip',
    check: (lm, h) => {
      const indexUp = isExtended(lm, 'index', h);
      const othersCurled = ['middle', 'ring', 'pinky'].every(f => isCurled(lm, f, h));
      const thumbTouch = distance(lm[4], lm[8]) < 0.12;
      return indexUp && othersCurled && thumbTouch;
    }
  },
  E: {
    letter: 'E',
    icon: '✊',
    desc: 'Fingers curled down, thumb tucked under',
    check: (lm, h) => {
      const allCurled = ['index', 'middle', 'ring', 'pinky', 'thumb'].every(f => isCurled(lm, f, h));
      return allCurled;
    }
  },
  F: {
    letter: 'F',
    icon: '👌',
    desc: 'OK circle with index+thumb, other three up',
    check: (lm, h) => {
      const okCircle = distance(lm[4], lm[8]) < 0.06;
      const threeUp = ['middle', 'ring', 'pinky'].every(f => isExtended(lm, f, h));
      return okCircle && threeUp;
    }
  },
  G: {
    letter: 'G',
    icon: '👉',
    desc: 'Index pointing sideways, thumb parallel',
    check: (lm, h) => {
      const indexHoriz = Math.abs(lm[8].y - lm[5].y) < 0.1;
      const thumbParallel = Math.abs(lm[4].y - lm[2].y) < 0.1;
      const othersCurled = ['middle', 'ring', 'pinky'].every(f => isCurled(lm, f, h));
      return indexHoriz && thumbParallel && othersCurled;
    }
  },
  H: {
    letter: 'H',
    icon: '🤞',
    desc: 'Index and middle pointing sideways together',
    check: (lm, h) => {
      const twoOut = isExtended(lm, 'index', h) && isExtended(lm, 'middle', h);
      const horiz = Math.abs(lm[8].y - lm[5].y) < 0.12 && Math.abs(lm[12].y - lm[9].y) < 0.12;
      const othersCurled = ['ring', 'pinky'].every(f => isCurled(lm, f, h));
      return twoOut && horiz && othersCurled;
    }
  },
  I: {
    letter: 'I',
    icon: '🤙',
    desc: 'Pinky up, fist closed',
    check: (lm, h) => {
      const pinkyUp = isExtended(lm, 'pinky', h);
      const othersCurled = ['thumb', 'index', 'middle', 'ring'].every(f => isCurled(lm, f, h));
      return pinkyUp && othersCurled;
    }
  },
  K: {
    letter: 'K',
    icon: '✌️',
    desc: 'Index and middle in V, thumb between them',
    check: (lm, h) => {
      const twoUp = isExtended(lm, 'index', h) && isExtended(lm, 'middle', h);
      const vShape = lm[8].x !== lm[12].x && Math.abs(lm[8].x - lm[12].x) > 0.05;
      const thumbBetween = lm[4].x > Math.min(lm[8].x, lm[12].x) && lm[4].x < Math.max(lm[8].x, lm[12].x);
      const othersCurled = ['ring', 'pinky'].every(f => isCurled(lm, f, h));
      return twoUp && vShape && thumbBetween && othersCurled;
    }
  },
  L: {
    letter: 'L',
    icon: '🤙',
    desc: 'L shape with index up and thumb out',
    check: (lm, h) => {
      const indexUp = isExtended(lm, 'index', h);
      const thumbOut = lm[4].x < lm[3].x !== (h === 'Left');
      const othersCurled = ['middle', 'ring', 'pinky'].every(f => isCurled(lm, f, h));
      return indexUp && thumbOut && othersCurled;
    }
  },
  M: {
    letter: 'M',
    icon: '✊',
    desc: 'Three fingers over thumb in fist',
    check: (lm, h) => {
      const curled = ['index', 'middle', 'ring', 'pinky'].every(f => isCurled(lm, f, h));
      const tipsOverThumb = lm[8].y > lm[4].y && lm[12].y > lm[4].y && lm[16].y > lm[4].y;
      return curled && tipsOverThumb;
    }
  },
  N: {
    letter: 'N',
    icon: '✊',
    desc: 'Two fingers over thumb in fist',
    check: (lm, h) => {
      const curled = ['index', 'middle', 'ring', 'pinky'].every(f => isCurled(lm, f, h));
      const tipsOverThumb = lm[8].y > lm[4].y && lm[12].y > lm[4].y;
      return curled && tipsOverThumb;
    }
  },
  O: {
    letter: 'O',
    icon: '⭕',
    desc: 'All fingers curved to thumb, O shape',
    check: (lm, h) => {
      const tipsClose = ['index', 'middle', 'ring', 'pinky'].every(f => {
        const tipIdx = { index: 8, middle: 12, ring: 16, pinky: 20 }[f];
        return distance(lm[4], lm[tipIdx]) < 0.15;
      });
      return tipsClose;
    }
  },
  R: {
    letter: 'R',
    icon: '🤞',
    desc: 'Cross index and middle fingers',
    check: (lm, h) => {
      const crossed = Math.abs(lm[8].x - lm[12].x) < 0.03;
      const twoUp = isExtended(lm, 'index', h) && isExtended(lm, 'middle', h);
      const othersCurled = ['ring', 'pinky'].every(f => isCurled(lm, f, h));
      return crossed && twoUp && othersCurled;
    }
  },
  S: {
    letter: 'S',
    icon: '✊',
    desc: 'Fist with thumb over fingers',
    check: (lm, h) => {
      const curled = ['index', 'middle', 'ring', 'pinky'].every(f => isCurled(lm, f, h));
      const thumbOver = lm[4].y < lm[8].y;
      return curled && thumbOver;
    }
  },
  T: {
    letter: 'T',
    icon: '✊',
    desc: 'Thumb between index and middle',
    check: (lm, h) => {
      const curled = ['index', 'middle', 'ring', 'pinky'].every(f => isCurled(lm, f, h));
      const thumbBetween = lm[4].x > lm[8].x && lm[4].x < lm[12].x;
      return curled && thumbBetween;
    }
  },
  U: {
    letter: 'U',
    icon: '✌️',
    desc: 'Index and middle up together',
    check: (lm, h) => {
      const twoUp = isExtended(lm, 'index', h) && isExtended(lm, 'middle', h);
      const together = Math.abs(lm[8].x - lm[12].x) < 0.05;
      const othersCurled = ['ring', 'pinky', 'thumb'].every(f => isCurled(lm, f, h));
      return twoUp && together && othersCurled;
    }
  },
  V: {
    letter: 'V',
    icon: '✌️',
    desc: 'Index and middle spread in V shape',
    check: (lm, h) => {
      const twoUp = isExtended(lm, 'index', h) && isExtended(lm, 'middle', h);
      const spread = Math.abs(lm[8].x - lm[12].x) > 0.05;
      const othersCurled = ['ring', 'pinky', 'thumb'].every(f => isCurled(lm, f, h));
      return twoUp && spread && othersCurled;
    }
  },
  W: {
    letter: 'W',
    icon: '🖖',
    desc: 'Index, middle, ring up spread',
    check: (lm, h) => {
      const threeUp = isExtended(lm, 'index', h) && isExtended(lm, 'middle', h) && isExtended(lm, 'ring', h);
      const spread = Math.abs(lm[8].x - lm[16].x) > 0.08;
      const othersCurled = ['pinky', 'thumb'].every(f => isCurled(lm, f, h));
      return threeUp && spread && othersCurled;
    }
  },
  X: {
    letter: 'X',
    icon: '☝️',
    desc: 'Index finger hooked/bent',
    check: (lm, h) => {
      const indexBent = lm[8].y > lm[6].y && lm[6].y < lm[5].y;
      const othersCurled = ['middle', 'ring', 'pinky', 'thumb'].every(f => isCurled(lm, f, h));
      return indexBent && othersCurled;
    }
  },
  Y: {
    letter: 'Y',
    icon: '🤙',
    desc: 'Thumb and pinky out, others curled',
    check: (lm, h) => {
      const thumbOut = lm[4].x < lm[3].x !== (h === 'Left');
      const pinkyOut = isExtended(lm, 'pinky', h);
      const othersCurled = ['index', 'middle', 'ring'].every(f => isCurled(lm, f, h));
      return thumbOut && pinkyOut && othersCurled;
    }
  }
};

function isExtended(lm, finger, handedness) {
  const indices = {
    thumb: { tip: 4, ip: 3 },
    index: { tip: 8, pip: 6, mcp: 5 },
    middle: { tip: 12, pip: 10, mcp: 9 },
    ring: { tip: 16, pip: 14, mcp: 13 },
    pinky: { tip: 20, pip: 18, mcp: 17 }
  };
  const f = indices[finger];
  if (finger === 'thumb') {
    return handedness === 'Left' ? lm[f.tip].x > lm[f.ip].x : lm[f.tip].x < lm[f.ip].x;
  }
  return lm[f.tip].y < lm[f.pip].y && lm[f.pip].y < lm[f.mcp].y;
}

function isCurled(lm, finger, handedness) {
  return !isExtended(lm, finger, handedness);
}

function distance(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

export function recognizeASL(landmarks, handedness) {
  let bestMatch = null;
  let bestScore = 0;

  for (const [letter, data] of Object.entries(ASL_LETTERS)) {
    try {
      const match = data.check(landmarks, handedness);
      if (match) {
        return { letter, ...data, confidence: 1.0 };
      }
    } catch (e) {
      continue;
    }
  }

  return null;
}
