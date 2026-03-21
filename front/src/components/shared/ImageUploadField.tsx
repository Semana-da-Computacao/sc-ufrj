/**
 * Campo de upload de imagem com preview
 * - Drag-and-drop ou clique para selecionar
 * - Redimensiona automaticamente para ≤ 1 MB via Canvas API
 * - Armazena como base64 (data-URL) para envio ao backend
 * - Aceita PNG, JPG, WebP, GIF
 */
import { useRef, useState, useCallback } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { resizeImageToBase64, base64SizeBytes, formatBytes } from "@/lib/imageUtils";

interface ImageUploadFieldProps {
  /** Valor atual: base64 data-URL ou URL externa */
  value: string;
  onChange: (base64: string) => void;
  /** Label exibido no campo */
  label?: string;
  /** Proporção do preview, ex: "16/9" | "1/1" | "3/1" */
  aspectRatio?: "16/9" | "1/1" | "3/1" | "4/3";
  /** Texto de ajuda abaixo do campo */
  hint?: string;
  /** Limite de tamanho em bytes (padrão 1 MB) */
  maxBytes?: number;
  className?: string;
}

const ASPECT_CLASSES: Record<string, string> = {
  "16/9": "aspect-video",
  "1/1":  "aspect-square",
  "3/1":  "aspect-[3/1]",
  "4/3":  "aspect-[4/3]",
};

export function ImageUploadField({
  value,
  onChange,
  label,
  aspectRatio = "16/9",
  hint,
  maxBytes = 1_000_000,
  className,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sizeInfo, setSizeInfo] = useState<string | null>(null);

  const aspectClass = ASPECT_CLASSES[aspectRatio] ?? "aspect-video";

  async function processFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem (PNG, JPG, WebP...)");
      return;
    }

    setProcessing(true);
    setError(null);
    setSizeInfo(null);

    try {
      const base64 = await resizeImageToBase64(file, maxBytes);
      const bytes = base64SizeBytes(base64);
      setSizeInfo(formatBytes(bytes));
      onChange(base64);
    } catch {
      setError("Erro ao processar a imagem. Tente outro arquivo.");
    } finally {
      setProcessing(false);
    }
  }

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file) processFile(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxBytes]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  function handleClear() {
    onChange("");
    setSizeInfo(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const hasImage = !!value;

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <p className="text-xs font-mono text-muted-foreground">{label}</p>
      )}

      {/* ── Área de drop / preview ── */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded border transition-colors",
          aspectClass,
          dragging
            ? "border-primary bg-primary/5"
            : hasImage
            ? "border-border"
            : "border-dashed border-border hover:border-primary/50 cursor-pointer",
          processing && "pointer-events-none opacity-70"
        )}
        onClick={() => !hasImage && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {/* Preview da imagem */}
        {hasImage && !processing && (
          <>
            <img
              src={value}
              alt="Preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Overlay com botões ao fazer hover */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 hover:bg-black/50 transition-colors group">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 rounded bg-card/90 px-3 py-1.5 text-xs font-mono text-foreground transition-opacity hover:bg-card"
              >
                <Upload className="h-3.5 w-3.5" />
                trocar
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleClear(); }}
                className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 rounded bg-destructive/90 px-3 py-1.5 text-xs font-mono text-white transition-opacity hover:bg-destructive"
              >
                <X className="h-3.5 w-3.5" />
                remover
              </button>
            </div>
          </>
        )}

        {/* Estado de processamento */}
        {processing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs font-mono text-muted-foreground">processando imagem...</p>
          </div>
        )}

        {/* Placeholder (sem imagem) */}
        {!hasImage && !processing && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded border border-dashed border-current opacity-40">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div className="text-center">
              <p className="text-xs font-mono">
                {dragging ? "solte aqui" : "clique ou arraste uma imagem"}
              </p>
              <p className="text-xs font-mono text-muted-foreground/50 mt-0.5">
                PNG · JPG · WebP — max {formatBytes(maxBytes)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Info de tamanho ── */}
      {sizeInfo && !error && (
        <p className="text-xs font-mono text-muted-foreground/60">
          {/* tamanho final: */} {sizeInfo} após compressão
        </p>
      )}

      {/* ── Erro ── */}
      {error && (
        <p className="text-xs font-mono text-destructive">{error}</p>
      )}

      {hint && !error && !sizeInfo && (
        <p className="text-xs font-mono text-muted-foreground/50">{hint}</p>
      )}

      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
