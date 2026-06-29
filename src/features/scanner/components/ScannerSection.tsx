import React, { useRef, useEffect } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

interface ScannerSectionProps {
  isActive: boolean;
  onScanSuccess: (data: string) => void;
}

const ScannerSection: React.FC<ScannerSectionProps> = ({
  isActive,
  onScanSuccess,
}) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef<boolean>(false);
  const scannerContainerId = 'barcode-scanner-container';

  // ============================================
  // توقف اسکنر
  // ============================================
  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
        console.log('✅ اسکنر متوقف شد');
      } catch (error) {
        console.error('خطا در توقف اسکنر:', error);
      }
    }
    isScanningRef.current = false;
  };

  // ============================================
  // شروع اسکنر
  // ============================================
  const startScanner = async () => {
    if (isScanningRef.current) {
      console.log('⏳ اسکنر در حال اجراست');
      return;
    }

    const element = document.getElementById(scannerContainerId);
    if (!element) {
      console.log('❌ المنت اسکنر پیدا نشد');
      return;
    }

    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (e) {}
      scannerRef.current = null;
    }

    try {
      scannerRef.current = new Html5Qrcode(scannerContainerId);
      isScanningRef.current = true;

      const config = {
        fps: 15,
        qrbox: { width: 280, height: 180 },
        aspectRatio: 1.0,
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.CODE_93,
          Html5QrcodeSupportedFormats.ITF,
          Html5QrcodeSupportedFormats.CODABAR,
          Html5QrcodeSupportedFormats.RSS_14,
          Html5QrcodeSupportedFormats.RSS_EXPANDED,
        ],
      };

      await scannerRef.current.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          if (decodedText) {
            stopScanner();
            onScanSuccess(decodedText);
          }
        },
        () => {}
      );

      console.log('✅ اسکنر شروع شد');
    } catch (error) {
      console.error('❌ خطا در شروع اسکنر:', error);
      isScanningRef.current = false;
    }
  };

  // ============================================
  // مدیریت فعال/غیرفعال شدن اسکنر
  // ============================================
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        startScanner();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      stopScanner();
    }
  }, [isActive]);

  // ============================================
  // پاکسازی در unmount
  // ============================================
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  // ============================================
  // رندر
  // ============================================
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-xl">
      <div
        id={scannerContainerId}
        className="w-full rounded-2xl overflow-hidden bg-black"
        style={{ minHeight: '300px' }}
      />
      
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
        <span>💡 نور کافی</span>
        <span>📏 فاصله مناسب</span>
        <span>📷 بارکد واضح</span>
      </div>
    </div>
  );
};

export default ScannerSection;