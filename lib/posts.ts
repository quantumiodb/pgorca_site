import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags?: string[];
  author?: string;
  draft?: boolean;
  canonical?: string;
  ogImage?: string;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingMinutes: number;
};

export type Post = PostMeta & {
  content: string;
};

function toIsoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") return value;
  throw new Error(`Unsupported date value: ${String(value)}`);
}

function readPostFile(filename: string): Post | null {
  const filePath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as Omit<PostFrontmatter, "date" | "updated"> & {
    date: string | Date;
    updated?: string | Date;
  };

  if (!fm.title || !fm.description || !fm.date) {
    throw new Error(
      `Post ${filename} is missing required frontmatter (title, description, date)`,
    );
  }

  const slug = filename.replace(/\.mdx?$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
  const stats = readingTime(content);

  return {
    ...fm,
    date: toIsoDate(fm.date),
    updated: fm.updated ? toIsoDate(fm.updated) : undefined,
    slug,
    content,
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
  };
}

function listPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
}

export function getAllPosts({ includeDrafts = false } = {}): PostMeta[] {
  return listPostFiles()
    .map((f) => readPostFile(f))
    .filter((p): p is Post => p !== null)
    .filter((p) => includeDrafts || !p.draft)
    .map((p): PostMeta => {
      const { content: _, ...meta } = p;
      void _;
      return meta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatPostDate(iso: string, variant: "short" | "long" = "short") {
  // Parse "YYYY-MM-DD" manually so we never depend on host timezone.
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const [, y, mo, d] = m;
  const months = variant === "long" ? MONTHS_LONG : MONTHS_SHORT;
  return `${months[parseInt(mo, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
}

export function getPost(slug: string): Post | null {
  const files = listPostFiles();
  const match = files.find((f) => {
    const s = f.replace(/\.mdx?$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
    return s === slug;
  });
  if (!match) return null;
  const post = readPostFile(match);
  if (!post || post.draft) return null;
  return post;
}
