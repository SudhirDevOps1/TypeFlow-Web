import { memo } from "react";

export const AmbientBg = memo(function AmbientBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 bg-[#070b14]">
      {/* Soft animated gradient ambient spotlights */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-30 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #00f5c4 0%, #7c3aed 50%, transparent 80%)",
        }}
      />
      <div
        className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full opacity-20 blur-[140px]"
        style={{
          background: "radial-gradient(circle, #7c3aed 0%, #f59e0b 60%, transparent 80%)",
        }}
      />
      <div
        className="absolute top-1/3 -right-20 w-[450px] h-[450px] rounded-full opacity-20 blur-[130px]"
        style={{
          background: "radial-gradient(circle, #00f5c4 0%, #ec4899 70%, transparent 80%)",
        }}
      />
      {/* Subtle modern cyber grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "40px 44px",
          maskImage: "radial-gradient(circle at 50% 30%, black 30%, transparent 80%)",
        }}
      />
    </div>
  );
});
