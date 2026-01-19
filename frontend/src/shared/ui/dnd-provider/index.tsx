import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import React, { useState } from "react";

export type DragData = Record<string, unknown>;

export const DndProvider = <T extends DragData>({
  children,
  onDragEnd,
  renderOverlay,
}: {
  children: React.ReactNode;
  onDragEnd: (data: T, overId: string | null) => void;
  renderOverlay?: (activeItem: T | null) => React.ReactNode;
}) => {
  const [activeItem, setActiveItem] = useState<T | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveItem(event.active.data.current as T);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const data = event.active.data.current as T;
    const overId = event.over?.id as string | null;
    onDragEnd(data, overId);
    setActiveItem(null);
  };

  const handleDragCancel = () => {
    setActiveItem(null);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      {renderOverlay && <DragOverlay>{renderOverlay(activeItem)}</DragOverlay>}
    </DndContext>
  );
};
