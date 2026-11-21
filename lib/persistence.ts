import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const chains = new Map<string, Promise<void>>();

/** All submissions are stored as one JSON object per line so appends never rewrite a file. */
export function toJsonlPath(filePath: string): string {
  return /\.json$/i.test(filePath) ? `${filePath.slice(0, -5)}.jsonl` : filePath;
}

function companionJsonPath(jsonlPath: string): string {
  return /\.jsonl$/i.test(jsonlPath) ? `${jsonlPath.slice(0, -6)}.json` : jsonlPath;
}

/**
 * Append a single record. Writes for the same file are serialised in-process,
 * and the OS append keeps each line atomic for concurrent writers.
 */
export function appendRecord<T>(filePath: string, record: T): Promise<void> {
  const target = toJsonlPath(filePath);
  const task = (chains.get(target) ?? Promise.resolve()).then(async () => {
    await mkdir(path.dirname(target), { recursive: true });
    await appendFile(target, `${JSON.stringify(record)}\n`, "utf8");
  });

  chains.set(target, task.catch(() => undefined));
  return task;
}

/** Read all records, with a read fallback for legacy JSON array files. */
export async function readRecords<T>(filePath: string): Promise<T[]> {
  const target = toJsonlPath(filePath);

  try {
    const contents = await readFile(target, "utf8");
    return contents
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .flatMap((line) => {
        try {
          return [JSON.parse(line) as T];
        } catch {
          return [];
        }
      });
  } catch {
    // Fall through to the legacy array file.
  }

  try {
    const legacy = await readFile(companionJsonPath(target), "utf8");
    const parsed: unknown = JSON.parse(legacy);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function resolveDataFile(configured: string | undefined, fallback: string): string {
  const base = configured
    ? path.resolve(process.cwd(), configured)
    : path.join(process.cwd(), "data", fallback);
  return toJsonlPath(base);
}
