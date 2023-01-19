export type ZefUploadTypes = 'image' | 'video' | 'gif' | 'file';

export class ZefUploadItem {
  dataUrl: string;
  type: ZefUploadTypes;
  meta: File;
  width?: number;
  height?: number;
  thumbnails?: string[];
}
