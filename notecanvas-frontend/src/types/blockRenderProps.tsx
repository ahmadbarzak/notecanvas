import { Block } from "./block";

export interface BlockRenderProps<T extends Block = Block> {
  block: T;
  isOverlay?: boolean;
  isHidden?: boolean;
  isFocused?: boolean;
  isResizable?: boolean;
  overlayPosition?: { x: number; y: number };
  onClick?: () => void;
  onDoubleClick?: () => void;
  updateBlockContent: (id: string, content: string) => void;
  resizeBlock?: (id: string, updates: { x: number; y: number; width: number; height: number }) => void;
}