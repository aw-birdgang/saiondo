export function fillPromptTemplate(template: string, params: Record<string, string>): string {
  return template.replace(/{{(.*?)}}/g, (_, key) => params[key.trim()] ?? '');
}
