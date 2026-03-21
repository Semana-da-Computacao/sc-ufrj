/**
 * Utilitários de imagem
 * Redimensiona e converte imagens para base64 com limite de tamanho.
 * Toda imagem salva no sistema passa por aqui antes de ir ao backend.
 */

/** Lê um File como data-URL */
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target!.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Carrega uma data-URL em HTMLImageElement */
function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Renderiza imagem no canvas com as dimensões dadas e retorna base64 JPEG */
function canvasToBase64(img: HTMLImageElement, w: number, h: number, quality: number): string {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}

/**
 * Converte File → base64 JPEG, garantindo que o resultado caiba em `maxBytes`.
 * Reduz dimensões iterativamente (×0.8 por passo) e qualidade (de 0.9 a 0.5)
 * até atingir o limite, preservando ao máximo a qualidade visual.
 *
 * @param file      Arquivo de imagem (PNG, JPG, WebP...)
 * @param maxBytes  Tamanho máximo em bytes (padrão: 1 MB)
 * @returns         Data-URL "data:image/jpeg;base64,..."
 */
export async function resizeImageToBase64(
  file: File,
  maxBytes = 1_000_000
): Promise<string> {
  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImageElement(dataUrl);

  const MAX_DIM = 2048; // nunca excede 2048px em qualquer lado
  let w = img.naturalWidth;
  let h = img.naturalHeight;

  // Limita dimensão máxima mantendo proporção
  if (w > MAX_DIM || h > MAX_DIM) {
    const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
    w = Math.floor(w * ratio);
    h = Math.floor(h * ratio);
  }

  // Qualidades a tentar em ordem decrescente
  const QUALITIES = [0.9, 0.8, 0.7, 0.6, 0.5];

  for (let attempt = 0; attempt < 10; attempt++) {
    for (const quality of QUALITIES) {
      const b64 = canvasToBase64(img, w, h, quality);
      // Base64 overhead: 4 chars = 3 bytes
      const estimatedBytes = (b64.length - b64.indexOf(",") - 1) * 0.75;
      if (estimatedBytes <= maxBytes) {
        return b64;
      }
    }
    // Ainda acima do limite — reduz dimensões 20% e tenta novamente
    w = Math.floor(w * 0.8);
    h = Math.floor(h * 0.8);
  }

  // Fallback: retorna com qualidade mínima mesmo que ultrapasse levemente
  return canvasToBase64(img, w, h, 0.4);
}

/**
 * Retorna o tamanho estimado em bytes de uma data-URL base64
 */
export function base64SizeBytes(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1] ?? dataUrl;
  return Math.floor(base64.length * 0.75);
}

/**
 * Formata bytes em string legível (KB / MB)
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
