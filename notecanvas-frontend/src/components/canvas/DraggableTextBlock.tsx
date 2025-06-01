
import {useDraggable} from "@dnd-kit/core";
import {TextBlock } from "@/types/block";
import { useEffect, useRef } from "react";


export default function DraggableTextBlock({
  block,
  isOverlay = false,
  isHidden = false,
  isFocused = false,
  onDoubleClick,
  onBlur,
  overlayPosition,
  updateBlockContent
}: {
  block: TextBlock;
  isOverlay?: boolean;
  isHidden?: boolean;
  isFocused?: boolean;
  onDoubleClick?: () => void;
  onBlur?: () => void;
  overlayPosition?: { x: number; y: number };
  updateBlockContent: (id: string, content: string) => void;
}) {
//   const { attributes, setNodeRef } = useDraggable({
//     id: block.id,
//   });
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: block.id,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isFocused && textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();
    }
  }, [isFocused]);

  const style: React.CSSProperties = {
    transform: isOverlay
      ? `translate3d(${overlayPosition?.x || 0}px, ${overlayPosition?.y || 0}px, 0)`
      : `translate3d(${block.x}px, ${block.y}px, 0)`,
    position: isOverlay ? "fixed" : "absolute",
    zIndex: 10,
    opacity: isHidden ? 0 : 1,
    pointerEvents: isOverlay ? "none" : "auto",
  };

  return (
    <div
      onMouseDownCapture={(e) => {
        if (isFocused) e.stopPropagation();
      }}
      onClickCapture={(e) => {
        if (isFocused) e.stopPropagation();
      }}
      ref={setNodeRef}
      {...(isFocused || isOverlay ? {} : listeners)}
      {...attributes}
      style={style}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick?.();
      }}
      className={`p-2 border rounded shadow ${
        isFocused ? 'ring-2 ring-red-500' : 'bg-gray-100'
      }`}
    >
      <textarea
        ref={textareaRef}
        className="w-64 h-24 resize-none bg-blue-500 border p-2"
        // defaultValue={block.content}
        value={block.content}
        onBlur={onBlur}
        onChange={(e) => {
            if (!isOverlay) {
                const newContent = e.target.value;
                updateBlockContent(block.id, newContent);
            }
        }}
        readOnly={!isFocused || isOverlay} // 👈 disable typing unless focused
      />
    </div>
  );
}