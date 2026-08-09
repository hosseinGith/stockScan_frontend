import React, { useEffect, useRef, useState } from "react";
import Quagga from "quagga";

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
  onError?: (error: string) => void;
  onScanStart?: () => void;
  onScanStop?: () => void;
  isActive?: boolean;
  height?: string | number;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onDetected,
  onError,
  onScanStart,
  onScanStop,
  isActive = true,
  height = 320,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const heightValue = typeof height === "number" ? `${height}px` : height;
      containerRef.current.style.height = heightValue;
      containerRef.current.style.minHeight = heightValue;
    }
  }, [height]);

  const stopScanner = () => {
    try {
      Quagga.stop();
      setIsScanning(false);
      if (onScanStop) onScanStop();
      console.log("🛑 اسکنر متوقف شد");
    } catch (err) {
      console.error("خطا در توقف اسکنر:", err);
    }
  };

  const startScanner = () => {
    if (!containerRef.current) {
      console.error("❌ المنت اسکنر پیدا نشد");
      return;
    }

    if (isScanning) {
      stopScanner();
    }

    const config = {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: containerRef.current,
        constraints: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      },
      locator: {
        patchSize: "medium",
        halfSample: true,
      },
      decoder: {
        readers: [
          "ean_reader",
          "ean_8_reader",
          "upc_reader",
          "upc_e_reader",
          "code_128_reader",
          "code_39_reader",
          "code_93_reader",
          "codabar_reader",
          "i2of5_reader",
        ],
      },
      locate: true,
    };

    Quagga.init(config, (err) => {
      if (err) {
        console.error("❌ خطا در راه‌اندازی اسکنر:", err);
        const msg = err.message || "خطا در راه‌اندازی اسکنر";
        setError(msg);
        if (onError) onError(msg);
        return;
      }

      Quagga.start();
      setIsScanning(true);
      setError(null);
      if (onScanStart) onScanStart();
      console.log("✅ اسکنر شروع شد");
    });

    Quagga.onDetected((result) => {
      const code = result?.codeResult?.code;
      if (code) {
        console.log("✅ بارکد تشخیص داده شد:", code);
        stopScanner();
        onDetected(code);
      }
    });

    Quagga.onProcessed((result) => {
      const drawingCtx = Quagga.canvas.ctx.overlay;
      const drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
          result.boxes
            .filter((box) => box !== result.box)
            .forEach((box) => {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                color: "#00FF00",
                lineWidth: 2,
              });
            });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
            color: "#00FF00",
            lineWidth: 2,
          });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(result.line, { x: 0, y: 1 }, drawingCtx, {
            color: "#FF0000",
            lineWidth: 3,
          });
        }
      }
    });
  };

  useEffect(() => {
    (() => {
      if (isActive) {
        const timer = setTimeout(() => {
          startScanner();
        }, 300);
        return () => clearTimeout(timer);
      } else {
        stopScanner();
      }
    })();
  }, [isActive]);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="relative w-full bg-black rounded-2xl overflow-hidden">
      {/* ✅ کانتینر با ارتفاع ثابت */}
      <div
        ref={containerRef}
        className="w-full"
        style={{
          height: typeof height === "number" ? `${height}px` : height,
          minHeight: typeof height === "number" ? `${height}px` : height,
          maxHeight: typeof height === "number" ? `${height}px` : height,
        }}
      />

      {/* وضعیت اسکنر */}
      {!isScanning && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="text-white text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">در حال راه‌اندازی دوربین...</p>
          </div>
        </div>
      )}

      {/* خطا */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="text-center p-4">
            <div className="text-red-500 text-4xl mb-3">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <p className="text-white text-sm">{error}</p>
            <button
              onClick={() => {
                setError(null);
                startScanner();
              }}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm hover:bg-blue-600 transition"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      )}

      {/* باکس اسکن */}
      {isScanning && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-40 border-2 border-blue-500 rounded-lg">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500"></div>
          </div>
        </div>
      )}

      {/* راهنما */}
      <div className="flex items-center justify-center gap-4 py-3 text-xs text-gray-400 bg-black/80">
        <span>💡 نور کافی</span>
        <span>📏 فاصله مناسب</span>
        <span>📷 بارکد واضح</span>
      </div>
    </div>
  );
};

export default BarcodeScanner;
