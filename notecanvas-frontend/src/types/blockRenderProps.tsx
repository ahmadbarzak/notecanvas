import { Block } from "./block";

export interface BlockRenderProps<T extends Block = Block> {
  block: T;
  isOverlay?: boolean;
  isHidden?: boolean;
  isFocused?: boolean;
  overlayPosition?: { x: number; y: number };
  onDoubleClick?: () => void;
  updateBlockContent: (id: string, content: string) => void;
  resizeBlock?: (id: string, updates: { x: number; y: number; width: number; height: number }) => void;
}