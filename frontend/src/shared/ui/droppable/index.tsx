'use client';

import { useDroppable } from "@dnd-kit/core";
import React from "react";

export const Droppable = ({
  id,
  children,
}: {
  id: string;
  children: (props: {
    ref: (node: HTMLElement | null) => void;
    isOver: boolean;
  }) => React.ReactNode;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return <>{children({ ref: setNodeRef, isOver })}</>;
};
