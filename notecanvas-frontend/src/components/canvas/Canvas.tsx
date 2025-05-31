import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  useDraggable,
} from "@dnd-kit/core";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Block, TextBlock } from "@/types/block";

export default function Canvas() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeBlock = blocks.find((b) => b.id === activeId) || null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function addTextBlock() {
    const newBlock: TextBlock = {
      id: uuidv4(),
      type: "text",
      x: 100,
      y: 100,
      content: "New text",
    };
    setBlocks((prev) => [...prev, newBlock]);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, delta } = event;
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === active.id
          ? { ...b, x: b.x + delta.x, y: b.y + delta.y }
          : b
      )
    );
    setActiveId(null);
  }

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-white overflow-hidden">
      <button
        onClick={addTextBlock}
        className="absolute top-4 left-4 bg-black text-white px-4 py-2 rounded z-10"
      >
        Add Text
      </button>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {blocks.map((block) =>
          block.type === "text" ? (
            <DraggableTextBlock key={block.id} block={block} isHidden={block.id === activeId} />
          ) : null
        )}

        {activeId && (
        <DragOverlay>
          {activeBlock?.type === "text" && (
            <DraggableTextBlock
              block={activeBlock}
              isOverlay
              overlayPosition={{ x: activeBlock.x, y: activeBlock.y }}
            />
          )}
        </DragOverlay>
        )}
      </DndContext>
    </div>
  );
}

function DraggableTextBlock({
  block,
  isOverlay = false,
  isHidden = false,
  overlayPosition,
}: {
  block: TextBlock;
  isOverlay?: boolean;
  isHidden?: boolean;
  overlayPosition?: { x: number; y: number };
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
        readOnly={isOverlay}
      />
    </div>
  );
}