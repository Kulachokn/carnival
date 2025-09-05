import he from 'he';

export function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  
  // Use the 'he' library to properly decode all HTML entities
  return he.decode(str);
}