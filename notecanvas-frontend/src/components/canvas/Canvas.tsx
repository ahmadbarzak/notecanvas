import {
  DndContext,
  useDraggable,
  DragEndEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Block, TextBlock } from "@/types/block";

export default function Canvas() {
    const [blocks, setBlocks] = useState<Block[]>([]);

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
                b.id === active.id ? {
                    ...b,
                    x: b.x + delta.x,
                    y: b.y + delta.y,
                } : b
            )
        );
    }



    return (
        <div className="relative w-full h-[calc(100vh-64px)] bg-white overflow-hidden">
            <button onClick={addTextBlock}
                className="absolute top-4 left-4 bg-black text-white px-4 py-2 rounded z-10"
            > 
                Add Text 
            </button>

            <DndContext onDragEnd={handleDragEnd}>
                
                { blocks.map((block) => block.type === "text" ?
                    (
                        <DraggableTextBlock key = {block.id} block={block} />
                    ) : null)
                }
            </DndContext>
        </div>
    );
}
                

function DraggableTextBlock({ block }: { block: TextBlock }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: block.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: `translate3d(${block.x}px, ${block.y}px, 0)`,
        position: "absolute",
        zIndex: 1,
      }}
      className="p-2 bg-gray-100 border rounded shadow"
    >
      <textarea
        className="w-64 h-24 resize-none bg-blue-500 border p-2"
        defaultValue={block.content}
      />
    </div>
  );
}