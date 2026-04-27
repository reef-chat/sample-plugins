const res = await fetch(args.url, { redirect: 'follow' });
if (!res.ok) return { ok: false, status: res.status };

const html = await res.text();

const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
const title = titleMatch ? titleMatch[1].trim() : null;

const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
const description = descMatch ? descMatch[1].trim() : null;

return { ok: true, status: res.status, title, description };
