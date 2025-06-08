
import {useDraggable} from "@dnd-kit/core";
import {TextBlock } from "@/types/block";
import { useEffect, useState, useRef } from "react";
import { BlockRenderProps } from "@/types/blockRenderProps";
import ResizableHandles, { ResizeDirection } from "./ResizableHandles";
import { ResizeState } from "@/resizeManager";


export default function DraggableTextBlock({
  block,
  isOverlay = false,
  isHidden = false,
  isFocused = false,
  isResizable = false,
  overlayPosition,
  onDoubleClick,
  updateBlockContent,
  resizeBlock
}: BlockRenderProps<TextBlock> ) 
{
    
  const dimensionsRef = useRef({
    width: block.width ?? 100,
    height: block.height ?? 100,
  });
  const [dimensions, setDimensions] = useState({
    width: block.width ?? 100,
    height: block.height ?? 100,
  });

  useEffect(() => {
    if (!isOverlay) {
        setDimensions({
        width: block.width ?? 100,
        height: block.height ?? 100,
        });
    }
  }, [block.width, block.height, isOverlay]);

  const livePositionRef = useRef({ x: block.x, y: block.y });
  const [livePosition, setLivePosition] = useState({ x: block.x, y: block.y });


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

  useEffect(() => {
    setLivePosition({ x: block.x, y: block.y });
  }, [block.x, block.y]);

  function handleResizeStart(e: React.MouseEvent, direction: ResizeDirection) {
    ResizeState.isResizing = true;
    
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;

    const resize = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = block.x;
      let newY = block.y;

      // Horizontal
      if (direction.includes("right")) {
        newWidth = startWidth + dx;
      } else if (direction.includes("left")) {
        newWidth = startWidth - dx;
        newX = block.x + dx; // Move x right as box shrinks left
      }

      // Vertical
      if (direction.includes("bottom")) {
        newHeight = startHeight + dy;
      } else if (direction.includes("top")) {
        newHeight = startHeight - dy;
        newY = block.y + dy; // Move y down as box shrinks upward
      }

      // Prevent too small sizes
      const clampedWidth = Math.max(40, newWidth);
      const clampedHeight = Math.max(30, newHeight);

      // Adjust position if clamped
      if (newWidth !== clampedWidth && direction.includes("left")) {
        newX = block.x + (startWidth - clampedWidth);
      }
      if (newHeight !== clampedHeight && direction.includes("top")) {
        newY = block.y + (startHeight - clampedHeight);
      }

      
      setDimensions({
        width: clampedWidth,
        height: clampedHeight,
      });
      dimensionsRef.current = {
        width: clampedWidth,
        height: clampedHeight,
      };

      // Live position update (or store it for later)
      if (!isOverlay) {
        setLivePosition({ x: newX, y: newY }); // optional state
        livePositionRef.current = { x: newX, y: newY };
      }
    };

    const stopResize = () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResize);
      ResizeState.isResizing = false;

      if (!isOverlay && resizeBlock) {
        
        resizeBlock(block.id, {
          x: livePositionRef.current.x,
          y: livePositionRef.current.y,
          width: dimensionsRef.current.width,
          height: dimensionsRef.current.height
        });
      }

    };

    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);
  }


  const style: React.CSSProperties = {
    transform: isOverlay
    ? `translate3d(${overlayPosition?.x || 0}px, ${overlayPosition?.y || 0}px, 0)`
    : `translate3d(${livePosition.x}px, ${livePosition.y}px, 0)`,
    position: isOverlay ? "fixed" : "absolute",
    zIndex: 10,
    opacity: isHidden ? 0 : 1,
    pointerEvents: isOverlay ? "none" : "auto",
    width: dimensions.width,
    height: dimensions.height,
  };


  return (
    <div
      onMouseDown={(e) => { if (isFocused) e.stopPropagation(); }}
      ref={setNodeRef}
      {...(isFocused || isOverlay ? {} : listeners)}
      {...attributes}
      style={style}
      onDoubleClick={(e) => {
        if (!isFocused) {
            e.stopPropagation();
            onDoubleClick?.();
        }
      }}
      className={`p-2 border rounded shadow ${
        isFocused ? 'ring-2 ring-red-500' : 'bg-gray-100'
      } `}
    >
      <textarea
        ref={textareaRef}
        className="w-full h-full resize-none bg-blue-500 border p-2"
        value={block.content}
        onChange={(e) => {
            if (!isOverlay) {
                const newContent = e.target.value;
                updateBlockContent(block.id, newContent);
            }
        }}
        readOnly={!isFocused || isOverlay}
      />
      {isResizable && <ResizableHandles onResizeStart={handleResizeStart} />}
    </div>
  );
}