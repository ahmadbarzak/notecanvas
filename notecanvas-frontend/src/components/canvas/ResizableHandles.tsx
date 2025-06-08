import React from "react";

export type ResizeDirection =
  | "top-left" | "top" | "top-right"
  | "right" | "bottom-right" | "bottom"
  | "bottom-left" | "left";

interface ResizableHandlesProps {
  onResizeStart: (e: React.MouseEvent, direction: ResizeDirection) => void;
}

const positionMap: Record<ResizeDirection, string> = {
  "top-left": "top-0 left-0",
  "top": "top-0 left-1/2 -translate-x-1/2",
  "top-right": "top-0 right-0",
  "right": "top-1/2 right-0 -translate-y-1/2",
  "bottom-right": "bottom-0 right-0",
  "bottom": "bottom-0 left-1/2 -translate-x-1/2",
  "bottom-left": "bottom-0 left-0",
  "left": "top-1/2 left-0 -translate-y-1/2",
};

export default function ResizableHandles({ onResizeStart }: ResizableHandlesProps) {
  const directions: ResizeDirection[] = [
    "top-left", "top", "top-right",
    "right", "bottom-right", "bottom",
    "bottom-left", "left"
  ];

  return (
    <>
      {directions.map((dir) => (
        <div
          key={dir}
          onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onResizeStart(e, dir);
              
          }}
          draggable={false}
          style={{ touchAction: "none" }} 
          className={`absolute ${positionMap[dir]} w-2 h-2 bg-blue-500 rounded-sm z-20`}
        />
      ))}
    </>
  );
}
