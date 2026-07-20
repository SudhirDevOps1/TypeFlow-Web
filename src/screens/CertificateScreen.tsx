import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { AmbientBg } from "../components/AmbientBg";

export function CertificateScreen() {
  const { setScreen, userName, lessonProgress, totalWordsTyped, totalSessions } = useGameStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);

  const completed = Object.values(lessonProgress).filter((p) => p.completed).length;
  const unlocked = completed >= 30 || totalWordsTyped >= 5000 || totalSessions >= 25;
  const certName = userName?.trim() || "TypeFlow Student";
  const certId = `TF-${String(completed).padStart(3, "0")}-${String(totalWordsTyped).slice(-4).padStart(4, "0")}`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1600;
    canvas.height = 1100;

    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    g.addColorStop(0, "#0a1220");
    g.addColorStop(1, "#081018");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 16;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(245,158,11,0.55)";
    ctx.strokeRect(72, 72, canvas.width - 144, canvas.height - 144);

    ctx.fillStyle = "rgba(255,255,255,0.06)";
    for (let i = 0; i < 14; i++) {
      ctx.fillRect(120 + i * 100, 130, 36, 2);
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#f59e0b";
    ctx.font = "700 34px Georgia, serif";
    ctx.fillText("TypeFlow Academy", canvas.width / 2, 170);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 78px Georgia, serif";
    ctx.fillText("Certificate of Typing Mastery", canvas.width / 2, 280);

    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.font = "400 32px Georgia, serif";
    ctx.fillText("This certifies that", canvas.width / 2, 380);

    ctx.fillStyle = "#00f5c4";
    ctx.font = "700 64px Georgia, serif";
    ctx.fillText(certName, canvas.width / 2, 490);

    ctx.fillStyle = "rgba(255,255,255,0.78)";
    ctx.font = "400 30px Georgia, serif";
    ctx.fillText("has demonstrated commitment to typing accuracy, rhythm, and keyboard mastery", canvas.width / 2, 580);
    ctx.fillText(`by completing ${completed} levels and typing ${totalWordsTyped.toLocaleString()} words in TypeFlow.`, canvas.width / 2, 635);

    ctx.fillStyle = "#ffffff";
    ctx.font = "600 24px Georgia, serif";
    ctx.fillText(`Certificate ID: ${certId}`, canvas.width / 2, 760);
    ctx.fillText(`Issued locally on ${new Date().toLocaleDateString()}`, canvas.width / 2, 805);

    ctx.fillStyle = "#f59e0b";
    ctx.font = "700 28px Georgia, serif";
    ctx.fillText("Made locally — privacy first — no server tracking", canvas.width / 2, 930);

    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.moveTo(260, 970);
    ctx.lineTo(620, 970);
    ctx.moveTo(980, 970);
    ctx.lineTo(1340, 970);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "500 22px Georgia, serif";
    ctx.fillText("Student Signature", 440, 1010);
    ctx.fillText("TypeFlow Seal", 1160, 1010);

    ctx.beginPath();
    ctx.arc(1160, 905, 68, 0, Math.PI * 2);
    ctx.strokeStyle = "#00f5c4";
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.fillStyle = "rgba(0,245,196,0.16)";
    ctx.fill();

    ctx.fillStyle = "#00f5c4";
    ctx.font = "900 28px Arial";
    ctx.fillText("TF", 1160, 915);

    setReady(true);
  }, [certId, certName, completed, totalWordsTyped]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${certName.replace(/\s+/g, "-").toLowerCase()}-typeflow-certificate.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="relative h-full overflow-hidden">
      <AmbientBg />
      <div className="relative z-10 flex h-full flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-white/5 px-4 py-4 sm:px-6">
          <button onClick={() => setScreen("home")} className="text-xl text-white/40 transition hover:text-white">←</button>
          <div className="flex-1">
            <div className="font-orbitron text-lg font-bold text-white">🏆 Certificate Generator</div>
            <div className="text-xs text-white/40">Canvas → PNG · 100% local · privacy first</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="mx-auto max-w-6xl space-y-5">
            {!unlocked ? (
              <div className="glass rounded-3xl p-8 text-center">
                <div className="text-6xl">🔒</div>
                <div className="mt-3 font-orbitron text-2xl font-bold text-white">Certificate Locked</div>
                <div className="mx-auto mt-2 max-w-2xl text-sm text-white/50">
                  Complete at least <strong className="text-white">30 levels</strong>, or type <strong className="text-white">5,000 words</strong>, or finish <strong className="text-white">25 sessions</strong> to unlock your professional local certificate.
                </div>
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
                <div className="glass rounded-3xl p-4">
                  <canvas ref={canvasRef} className="w-full rounded-2xl bg-black/20" />
                </div>
                <div className="space-y-4">
                  <div className="glass rounded-3xl p-5">
                    <div className="font-orbitron text-base font-bold text-white">Certificate Details</div>
                    <div className="mt-3 space-y-2 text-sm text-white/60">
                      <div>• Student: <span className="text-white">{certName}</span></div>
                      <div>• Completed Levels: <span className="text-white">{completed}</span></div>
                      <div>• Total Words: <span className="text-white">{totalWordsTyped.toLocaleString()}</span></div>
                      <div>• Certificate ID: <span className="text-white">{certId}</span></div>
                    </div>
                  </div>

                  <button
                    onClick={download}
                    disabled={!ready}
                    className="btn-primary w-full rounded-2xl py-4 text-sm font-bold font-orbitron disabled:opacity-50"
                  >
                    ⬇ Download PNG Certificate
                  </button>

                  <div className="glass rounded-3xl p-5 text-sm text-white/55">
                    This certificate is generated entirely on your device using Canvas. No names or results are uploaded anywhere.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
