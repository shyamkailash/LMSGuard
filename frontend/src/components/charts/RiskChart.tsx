type RiskChartProps = {
  score: number;
  label: string;
};

export function RiskChart({ score, label }: RiskChartProps) {
  return (
    <div className="relative mx-auto grid size-40 place-items-center">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(#7c3aed ${score * 3.6}deg, rgb(255 255 255 / 0.08) 0deg)`,
        }}
      />
      <div className="absolute inset-2 rounded-full bg-[#111119]" />
      <div className="relative text-center">
        <p className="text-4xl font-semibold text-zinc-50">{score}</p>
        <p className="mt-1 text-xs text-zinc-500">{label}</p>
      </div>
    </div>
  );
}
