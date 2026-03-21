/**
 * Componente de leitura de QR Code
 * Usa a câmera do dispositivo para escanear o QR code do participante
 */
import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff } from "lucide-react";

interface QRScannerProps {
  onScan: (result: string) => void;
  isActive?: boolean;
}

export function QRScanner({ onScan, isActive = true }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [scanning, setScanning] = useState(false);
  const containerId = "qr-scanner-container";

  useEffect(() => {
    if (!isActive) return;

    const scanner = new Html5QrcodeScanner(
      containerId,
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        showTorchButtonIfSupported: true,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        // Só processa se não estiver já processando
        if (!scanning) {
          setScanning(true);
          onScan(decodedText);
          // Reset após 2s para permitir próxima leitura
          setTimeout(() => setScanning(false), 2000);
        }
      },
      (error) => {
        // Ignora erros de "não encontrou QR code no frame"
        if (!error.includes("No barcode or QR code detected")) {
          console.debug("QR scan error:", error);
        }
      }
    );

    scannerRef.current = scanner;

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [isActive, onScan, scanning]);

  if (!isActive) {
    return (
      <div className="flex flex-col items-center justify-center h-64 rounded-lg border-2 border-dashed border-muted text-muted-foreground">
        <CameraOff className="h-12 w-12 mb-3" />
        <p className="text-sm">Scanner inativo</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div id={containerId} className="w-full" />
      {scanning && (
        <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-lg">
          <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium animate-pulse">
            Processando...
          </div>
        </div>
      )}
    </div>
  );
}

/** Versão simplificada — campo de input manual como fallback */
export function QRManualInput({ onSubmit }: { onSubmit: (token: string) => void }) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      setValue("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Token do QR code ou email"
        className="flex-1 px-3 py-2 rounded-md border text-sm"
      />
      <Button type="submit" size="sm">
        <Camera className="h-4 w-4" />
        Check-in
      </Button>
    </form>
  );
}
