import DraggableTextBlock from "./components/canvas/DraggableTextBlock";
import { TextBlock, ImageBlock, AudioBlock } from "@/types/block";
import { BlockRenderProps } from "@/types/blockRenderProps";
import { JSX } from "react";


type BlockRendererMap = {
  text: (props: BlockRenderProps<TextBlock>) => JSX.Element;
  image: (props: BlockRenderProps<ImageBlock>) => JSX.Element;
  audio: (props: BlockRenderProps<AudioBlock>) => JSX.Element;
};

export const blockRendererMap: Partial<BlockRendererMap> = {
  text: (props: BlockRenderProps<TextBlock>) => <DraggableTextBlock {...props} />,
};