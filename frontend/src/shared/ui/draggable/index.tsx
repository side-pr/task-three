'use client';

import { useDraggable } from "@dnd-kit/core";
import React from "react";

export const Draggable = ({
  id,
  data,
  children,
}: {
  id: string;
  data?: Record<string, unknown>;
  children: (props: {
    ref: (node: HTMLElement | null) => void;
    listeners: ReturnType<typeof useDraggable>["listeners"];
    attributes: ReturnType<typeof useDraggable>["attributes"];
    isDragging: boolean;
  }) => React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data,
  });

  return (
    <>
      {children({
        ref: setNodeRef,
        listeners,
        attributes,
        isDragging,
      })}
    </>
  );
};
