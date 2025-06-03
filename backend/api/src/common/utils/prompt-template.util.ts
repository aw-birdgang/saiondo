export function fillPromptTemplate(template: string, params: Record<string, any>): string {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    const value = params[key.trim()];
    if (typeof value === 'object') return JSON.stringify(value);
    return value ?? '';
  });
}
