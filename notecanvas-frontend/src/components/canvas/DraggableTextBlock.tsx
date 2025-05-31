
import {useDraggable} from "@dnd-kit/core";
import {TextBlock } from "@/types/block";

export default function DraggableTextBlock({
  block,
  isOverlay = false,
  isHidden = false,
  overlayPosition,
  updateBlockContent
}: {
  block: TextBlock;
  isOverlay?: boolean;
  isHidden?: boolean;
  overlayPosition?: { x: number; y: number };
  updateBlockContent: (id: string, content: string) => void;
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: block.id,
  });

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
      ref={setNodeRef}
      {...(!isOverlay ? listeners : {})}
      {...attributes}
      style={style}
      className="p-2 bg-gray-100 border rounded shadow"
    >
      <textarea
        className="w-64 h-24 resize-none bg-blue-500 border p-2"
        defaultValue={block.content}
        onChange={(e) => {
            if (!isOverlay) {
                const newContent = e.target.value;
                updateBlockContent(block.id, newContent);
            }
        }}
        readOnly={isOverlay}
      />
    </div>
  );
}