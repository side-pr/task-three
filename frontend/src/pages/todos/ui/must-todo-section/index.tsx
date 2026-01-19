import { ScheduleItem } from "@pages/todos/api/schedule-get-list";
import { TodoListItem } from "@pages/todos/ui/todo-list-item";
import { Badge } from "@shared/ui";
import { useDroppable } from "@dnd-kit/core";

export const MustTodoSection = ({
  scheduleItems,
}: {
  scheduleItems: { schedules: ScheduleItem[] };
}) => {
  const itemCount = scheduleItems.schedules?.length ?? 0;
  const completedCount =
    scheduleItems.schedules?.filter((schedule) => schedule.isCompleted)
      .length ?? 0;

  const { setNodeRef, isOver } = useDroppable({
    id: "must-todo-section",
  });

  return (
    <section
      ref={setNodeRef}
      className={isOver ? "ring-2 ring-blue-500 rounded-2xl" : ""}
    >
      <div className="flex justify-between">
        <div>
          <h2 className="text-title2 font-semibold">오늘 할 일</h2>
          <p className="text-body2 text-gray-500 font-regular">
            자기 전까지 꼭 끝낼 일
          </p>
        </div>
        <Badge>
          {completedCount}/{itemCount}
        </Badge>
      </div>

      {itemCount === 0 ? (
        <div className="flex items-center justify-center bg-gray-300 h-[232px] max-h-[232px] rounded-2xl">
          <p className="text-body2 text-gray-400 font-regular">
            할 일 목록 작성 후 <br />
            여기로 옮겨주세요
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2 mt-3">
          {scheduleItems.schedules.map((schedule) => (
            <TodoListItem
              key={schedule.scheduleId}
              todo={{
                taskId: schedule.taskId,
                name: schedule.taskName,
                isCompleted: schedule.isCompleted,
              }}
              onDelete={() => {
                // TODO: implement schedule delete
                console.log("delete schedule", schedule.scheduleId);
              }}
              onUpdate={() => {
                // TODO: implement schedule update
                console.log("update schedule", schedule.scheduleId);
              }}
              onToggleComplete={() => {
                // TODO: implement schedule toggle complete
                console.log("toggle schedule", schedule.scheduleId);
              }}
            />
          ))}
        </ul>
      )}
    </section>
  );
};
