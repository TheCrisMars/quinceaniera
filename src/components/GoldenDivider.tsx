export default function GoldenDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center my-4 sm:my-6 opacity-85 ${className}`}>
      <div className="h-[1px] w-20 sm:w-36 bg-gradient-to-r from-transparent via-[#cba158] to-[#cba158]" />
      <div className="mx-4 flex items-center gap-1 text-[#cba158]">
        <span className="text-xs">✦</span>
        <span className="text-base">👑</span>
        <span className="text-xs">✦</span>
      </div>
      <div className="h-[1px] w-20 sm:w-36 bg-gradient-to-l from-transparent via-[#cba158] to-[#cba158]" />
    </div>
  );
}
