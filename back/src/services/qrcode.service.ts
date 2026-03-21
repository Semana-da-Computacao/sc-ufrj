/**
 * Serviço de QR Code
 * Gera QR codes para identificação dos usuários no check-in
 */
import QRCode from "qrcode";

/**
 * Gera o QR code de um usuário como imagem base64 (data URL)
 * O conteúdo do QR code é o token único do usuário
 *
 * @param qrCodeToken - Token único do usuário (qrCodeToken do banco)
 * @returns Data URL da imagem PNG do QR code
 */
export async function generateUserQRCode(qrCodeToken: string): Promise<string> {
  return QRCode.toDataURL(qrCodeToken, {
    errorCorrectionLevel: "M",
    margin: 2,
    color: {
      dark: "#1a1a2e",
      light: "#ffffff",
    },
    width: 300,
  });
}

/**
 * Gera um QR code como string SVG
 * Útil para renderização no frontend sem conversão base64
 *
 * @param content - Conteúdo a ser codificado
 * @returns String SVG do QR code
 */
export async function generateQRCodeSVG(content: string): Promise<string> {
  return QRCode.toString(content, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
  });
}
