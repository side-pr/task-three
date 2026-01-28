'use client';

import { useDraggable } from "@dnd-kit/core";
import React from "react";

export const Draggable = ({
  id,
  data,
  disabled = false,
  children,
}: {
  id: string;
  data?: Record<string, unknown>;
  disabled?: boolean;
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
    disabled,
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
