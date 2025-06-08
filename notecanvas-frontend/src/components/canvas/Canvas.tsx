import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  useSensors,
  useSensor,
  PointerSensor
} from "@dnd-kit/core";
import { HistoryEntry } from "@/types/historyEntry";
import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Block, TextBlock } from "@/types/block";
import { BlockRenderProps } from "@/types/blockRenderProps";
import { blockRendererMap } from "@/blockRegistry";
import { JSX } from "react";
import { ResizeState } from "@/resizeManager";

export default function Canvas() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [resizingBlockId, setResizingBlockId] = useState<string | null>(null);
  const historyRef = useRef<HistoryEntry[]>([]);


  const draggingBlock = blocks.find((b) => b.id === draggingBlockId) || null;

  function getRenderer<T extends Block>(block: T) {
    return blockRendererMap[block.type] as
      | ((props: BlockRenderProps<T>) => JSX.Element)
      | undefined;
  }

  const isMouseDownRef = useRef(false);

  useEffect(() => {
    console.log("history:", historyRef.current);
    const handleDown = () => { isMouseDownRef.current = true; };
    const handleUp = () => { isMouseDownRef.current = false; };

    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
    };
  }, []);


  const blocksRef = useRef(blocks);
  const resizingBlockIdRef = useRef(resizingBlockId);

  useEffect(() => {
    blocksRef.current = blocks;
    resizingBlockIdRef.current = resizingBlockId;
  }, [blocks, resizingBlockId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && !isMouseDownRef.current && resizingBlockIdRef.current) {
        const prev = blocksRef.current;
        const idx = prev.findIndex((b) => b.id === resizingBlockIdRef.current);
        const block = prev[idx];
        if (!block) return;

        historyRef.current.push({
          type: "delete",
          block,
          index: idx,
        });
        console.log("delete - history:", historyRef.current);


        setBlocks([...prev.slice(0, idx), ...prev.slice(idx + 1)]);
        setResizingBlockId(null);
      }

      if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
        const lastAction = historyRef.current.pop();
        console.log("undo - history:", historyRef.current);
        if (!lastAction) return;

        if (lastAction.type === "delete") {
          setBlocks((prev) => [
            ...prev.slice(0, lastAction.index),
            lastAction.block,
            ...prev.slice(lastAction.index),
          ]);
        }

        if (lastAction.type === "resize" || lastAction.type === "move") {
          setBlocks(blocksRef.current.map(b =>
            b.id === lastAction.blockId ? lastAction.prev : b
          ));
        }

      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 50,
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


  function resizeBlock(id: string, updates: { x: number; y: number; width: number; height: number }) {

    const prevBlock = blocks.find((b) => b.id === id);
    if (prevBlock) {
      historyRef.current.push({
        type: "resize",
        blockId: id,
        prev: prevBlock,
      });
      console.log("resize - history:", historyRef.current);
    }

    setBlocks((prev) =>
      prev.map(
        (b) => b.id === id ? { ...b, ...updates } : b 
      )
    );
  }

  function handleDragStart(event: DragStartEvent) {

    if (ResizeState.isResizing) {
      return;
    }

    const id = event.active.id as string;
    setDraggingBlockId(event.active.id as string);


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
      width: 274,
      height: 141,
    };
    setBlocks((prev) => [...prev, newBlock]);
  }

  function handleDragEnd(event: DragEndEvent) {

    if (ResizeState.isResizing) {
      return;
    }

    const { active, delta } = event;

    const prevBlock = blocks.find((b) => b.id === active.id);
    if (prevBlock) {
      historyRef.current.push({
        type: "move",
        blockId: prevBlock.id,
        prev: { ...prevBlock },
      });
      console.log("move - history:", historyRef.current);
    }

    setBlocks((prev) =>
      prev.map((b) => b.id === active.id ?
         { ...b, x: b.x + delta.x, y: b.y + delta.y } :  b
    ));
    setResizingBlockId(draggingBlockId);
    setDraggingBlockId(null);
  }

  return (
    <div 
      onMouseDown={() => {
        if (resizingBlockId) {
          setResizingBlockId(null);
        }
        if (focusedBlockId) {
          setFocusedBlockId(null);
        }
      }}
      style={{ backgroundColor: "white" }}
      className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
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
        {blocks.map((block) => {

          const Renderer = getRenderer(block);

          return Renderer ? (
            <Renderer
              key={block.id}
              block={block}
              isHidden={block.id === draggingBlockId}
              isFocused={focusedBlockId === block.id}
              isResizable={resizingBlockId === block.id}
              onDoubleClick={() => {
                setResizingBlockId(null);
                setFocusedBlockId(block.id)
              }}
              updateBlockContent={updateBlockContent}
              resizeBlock={resizeBlock}
            />
          ) : null;
        })}

        {draggingBlockId && (
        <DragOverlay>
          {
            (
              () => {
                if (!draggingBlock) return null;

                const Renderer = getRenderer(draggingBlock);

                return Renderer ? (
                  <Renderer
                    block={draggingBlock}
                    isOverlay
                    isResizable
                    overlayPosition={{ x: draggingBlock.x, y: draggingBlock.y }}
                    updateBlockContent={updateBlockContent}
                  />
                ) : null;
              }
            )()
          }
        </DragOverlay>
        )}
      </DndContext>
    </div>
  );
}
