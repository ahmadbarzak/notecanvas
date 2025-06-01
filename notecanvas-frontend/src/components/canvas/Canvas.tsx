import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  useSensors,
  useSensor,
  PointerSensor
} from "@dnd-kit/core";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Block, TextBlock } from "@/types/block";
import DraggableTextBlock from "./DraggableTextBlock";

export default function Canvas() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);


  const activeBlock = blocks.find((b) => b.id === activeId) || null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 10,
      },
    })
  );

  function updateBlockContent(id: string, content: string) {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id && b.type === "text"
          ? { ...b, content }
          : b
      )
    );
  }

  function handleDragStart(event: DragStartEvent) {
    const id = event.active.id as string;
    setActiveId(event.active.id as string);

    setBlocks((prev) => {
      const draggedBlock = prev.find((b) => b.id === id);
      if (!draggedBlock) return prev;

      const withoutDragged = prev.filter((b) => b.id !== id);
      return [...withoutDragged, draggedBlock]; // put on top
  });
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
    <div 
      onClick={() => setFocusedBlockId(null)}
      className="relative w-full h-[calc(100vh-64px)] bg-white overflow-hidden">
      <button
        onClick={addTextBlock}
        className="absolute top-4 left-4 bg-black text-white px-4 py-2 rounded z-10"
      >
        Add Text
      </button>

      <DndContext  
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        {blocks.map((block) =>
          block.type === "text" ? (
            <DraggableTextBlock 
              key={block.id}
              block={block}
              isHidden={block.id === activeId}
              isFocused={focusedBlockId === block.id}
              onDoubleClick={() => {
                setFocusedBlockId(block.id);
              }}
              onBlur={() => {
                if (focusedBlockId === block.id) setFocusedBlockId(null);
              }}
              updateBlockContent={updateBlockContent}
            />
          ) : null
        )}

        {activeId && (
        <DragOverlay>
          {activeBlock?.type === "text" && (
            <DraggableTextBlock
              block={activeBlock}
              isOverlay
              overlayPosition={{ x: activeBlock.x, y: activeBlock.y }}
              updateBlockContent={updateBlockContent}
            />
          )}
        </DragOverlay>
        )}
      </DndContext>
    </div>
  );
}
