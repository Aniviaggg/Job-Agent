type SearchResult = {
  title: string;
  snippet: string;
  url: string;
};

function decodeHtmlEntities(input: string) {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

function stripHtml(input: string) {
  return decodeHtmlEntities(input.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
}

function decodeUrl(url: string) {
  try {
    const parsed = new URL(url, 'https://html.duckduckgo.com');
    const uddg = parsed.searchParams.get('uddg');
    return uddg ? decodeURIComponent(uddg) : url;
  } catch {
    return url;
  }
}

export class SearchService {
  static async searchInterviewExperience(position: string, company?: string, limit = 5) {
    const query = [company, position, '面经', '面试题', '公开面试'].filter(Boolean).join(' ');
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Search request failed with status ${response.status}`);
    }

    const html = await response.text();
    const resultBlocks = html.match(/<div class="result[^>]*>[\s\S]*?<\/div>\s*<\/div>/g) || [];
    const results: SearchResult[] = [];

    for (const block of resultBlocks) {
      const titleMatch = block.match(/<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
      const snippetMatch = block.match(/<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>|<div[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/div>/);

      if (!titleMatch) continue;

      const href = decodeUrl(titleMatch[1]);
      const title = stripHtml(titleMatch[2]);
      const snippetRaw = snippetMatch ? (snippetMatch[1] || snippetMatch[2] || '') : '';
      const snippet = stripHtml(snippetRaw);

      if (title) {
        results.push({ title, snippet, url: href });
      }

      if (results.length >= limit) break;
    }

    return results;
  }
}
