// src/types/quagga.d.ts
declare module 'quagga' {
  export interface QuaggaConfig {
    inputStream: {
      name: string;
      type: string;
      target: HTMLElement | null;
      constraints?: {
        facingMode?: string;
        width?: { ideal: number };
        height?: { ideal: number };
      };
    };
    locator?: {
      patchSize?: string;
      halfSample?: boolean;
    };
    decoder: {
      readers: string[];
    };
    locate?: boolean;
    numOfWorkers?: number;
    frequency?: number;
  }

  export interface QuaggaResult {
    codeResult: {
      code: string;
      start: number;
      end: number;
      codeset: number;
      startInfo: {
        error: number;
        code: number;
        start: number;
        end: number;
      };
      decodedCodes: {
        code: number;
        start: number;
        end: number;
        error: number;
      }[];
    };
    line: {
      x: number;
      y: number;
    }[];
    angle: number;
    pattern: number[];
    box: {
      x: number;
      y: number;
    }[];
    boxes: {
      x: number;
      y: number;
    }[][];
  }

  export interface QuaggaError {
    message: string;
  }

  export interface QuaggaStatic {
    init(
      config: QuaggaConfig,
      callback: (err: QuaggaError | null) => void
    ): void;
    start(): void;
    stop(): void;
    pause(): void;
    onDetected(callback: (result: QuaggaResult) => void): void;
    onProcessed(callback: (result: QuaggaResult | null) => void): void;
    offDetected(callback?: (result: QuaggaResult) => void): void;
    offProcessed(callback?: (result: QuaggaResult | null) => void): void;
    setReaders(readers: string[]): void;
    canvas: {
      ctx: {
        overlay: CanvasRenderingContext2D;
      };
      dom: {
        overlay: HTMLCanvasElement;
      };
    };
    ImageDebug: {
      drawPath(
        path: { x: number; y: number }[],
        offset: { x: number; y: number },
        ctx: CanvasRenderingContext2D,
        style: { color: string; lineWidth: number }
      ): void;
    };
  }

  const Quagga: QuaggaStatic;
  export default Quagga;
}