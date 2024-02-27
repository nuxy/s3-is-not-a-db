type FileType = 'base64' | 'blob' | 'json' | 'text';

export interface ConfigOpts {
  bucket: string,
  region: string
}

declare class Bucket {
  config(opts: ConfigOpts): this;
}

declare class Model {
  constructor(name: string);
  name(value?: string): string;
  parent(value?: this): string;
  fields(arr?: string[]): string[];
  type(value?: FileType): string;
  isValidName(value: string): boolean;
  isValidParent(value: this): boolean;
  isValidFields(arr: string[]): boolean;
  isValidType(value: FileType): boolean;
}

export = {Bucket, Model};
