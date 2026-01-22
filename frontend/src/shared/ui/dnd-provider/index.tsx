'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import React, { useState } from "react";

export type DragData = Record<string, unknown>;

const ACTIVATION_DELAY_MS = 200;

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: ACTIVATION_DELAY_MS,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: ACTIVATION_DELAY_MS,
        tolerance: 5,
      },
    })
  );

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
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      {renderOverlay && <DragOverlay>{renderOverlay(activeItem)}</DragOverlay>}
    </DndContext>
  );
};
