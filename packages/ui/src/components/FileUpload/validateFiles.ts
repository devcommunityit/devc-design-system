/** Reason a file was rejected on the client. */
export type FileRejectionReason = 'type' | 'size' | 'count';

export interface FileRejection {
  file: File;
  reason: FileRejectionReason;
}

export interface FileConstraints {
  /** Allowed MIME types (`image/png`), wildcards (`image/*`) or extensions (`.pdf`). Empty = any. */
  accept?: string[];
  /** Maximum size of each file in bytes. */
  maxSize?: number;
  /** Maximum total number of files (already selected + new). */
  maxFiles?: number;
}

/** True if the file matches one of the accept entries (MIME, wildcard or extension, case-insensitive). */
export function matchesAccept(file: File, accept: string[] | undefined): boolean {
  if (!accept || accept.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept.some((raw) => {
    const entry = raw.trim().toLowerCase();
    if (entry.startsWith('.')) return name.endsWith(entry);
    if (entry.endsWith('/*')) return type.startsWith(entry.slice(0, -1));
    return type === entry;
  });
}

/**
 * Client-side pre-validation only: it improves feedback but is NOT a security control.
 * The server must validate type, size and content again.
 */
export function validateFiles(files: File[], constraints: FileConstraints, alreadySelected = 0): { accepted: File[]; rejected: FileRejection[] } {
  const accepted: File[] = [];
  const rejected: FileRejection[] = [];
  for (const file of files) {
    if (!matchesAccept(file, constraints.accept)) rejected.push({ file, reason: 'type' });
    else if (constraints.maxSize !== undefined && file.size > constraints.maxSize) rejected.push({ file, reason: 'size' });
    else if (constraints.maxFiles !== undefined && alreadySelected + accepted.length >= constraints.maxFiles) rejected.push({ file, reason: 'count' });
    else accepted.push(file);
  }
  return { accepted, rejected };
}