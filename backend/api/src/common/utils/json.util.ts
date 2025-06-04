export function extractJsonFromCodeBlock(text: string): any | null {
  const match = text.match(/```json\s*([\s\S]*?)```/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch {
      const braceMatch = match[1].match(/{[\s\S]*}/);
      if (braceMatch) {
        try {
          return JSON.parse(braceMatch[0]);
        } catch {
          return null;
        }
      }
      return null;
    }
  }
  const braceMatch = text.match(/{[\s\S]*}/);
  if (braceMatch) {
    try {
      return JSON.parse(braceMatch[0]);
    } catch {
      return null;
    }
  }
  return null;
}
