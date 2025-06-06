export type BlockType = "text" | "audio" | "image";

export interface BaseBlock {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface TextBlock extends BaseBlock {
  type: "text";
  content: string;
}

export interface AudioBlock extends BaseBlock {
  type: "audio";
  content: string; // URL or path to the audio file
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  content: string; // URL or path to the image file
}

export type Block = TextBlock | AudioBlock | ImageBlock;

