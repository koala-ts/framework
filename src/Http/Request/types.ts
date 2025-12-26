import type { File } from 'formidable';
import type { Request } from 'koa';
import type { JsonValue } from 'type-fest';

export type UploadedFile = File;
export type UploadedFilesMap = Record<string, UploadedFile | UploadedFile[]>;

export interface HttpRequest extends Request {
  body?: Record<string, unknown> & JsonValue;
  files?: UploadedFilesMap;
  params: Record<string, unknown>;
}
