type StatCardProps = {
  label: string;
  total: number;
  completed: number;
  rate: number;
  color: "blue" | "green";
};

const colorMap = {
  blue: {
    bg: "bg-blue-100",
    bar: "bg-blue-500",
    text: "text-blue-700",
  },
  green: {
    bg: "bg-green-100",
    bar: "bg-green-500",
    text: "text-green-700",
  },
};

export const StatCard = ({ label, total, completed, rate, color }: StatCardProps) => {
  const colors = colorMap[color];

  return (
    <div className={`rounded-2xl p-4 ${colors.bg}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-semibold ${colors.text}`}>{label}</span>
        <span className={`text-xs ${colors.text}`}>
          {completed}/{total}
        </span>
      </div>
      <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${colors.bar}`}
          style={{ width: `${rate}%` }}
        />
      </div>
      <div className={`text-right text-xs mt-1 ${colors.text}`}>{rate}%</div>
    </div>
  );
};
