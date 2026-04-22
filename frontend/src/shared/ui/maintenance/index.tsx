const MAINTENANCE_UNTIL_KST = '2026-04-23T00:00:00+09:00';

export function isUnderMaintenance(now: Date = new Date()): boolean {
  return now.getTime() < new Date(MAINTENANCE_UNTIL_KST).getTime();
}

export function MaintenanceScreen() {
  return (
    <div className="w-full min-h-dvh flex flex-col items-center justify-center px-6 text-center gap-4">
      <div className="text-5xl">🛠️</div>
      <h1 className="text-2xl font-semibold">서비스 점검중</h1>
      <p className="text-base text-gray-600 leading-relaxed">
        더 나은 서비스 제공을 위해 오늘 하루 동안 점검을 진행하고 있어요.
        <br />
        이용에 불편을 드려 죄송합니다.
      </p>
      <p className="text-sm text-gray-500 mt-2">
        점검 종료 예정: 2026년 4월 22일 24:00 (KST)
      </p>
    </div>
  );
}
