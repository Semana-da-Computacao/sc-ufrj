/**
 * Serviço de Certificados
 * Renderiza templates HTML com as variáveis do participante
 */

interface CertificateVariables {
  name: string;
  event: string;
  hours: string;
  date: string;
  dates: string;
  code: string;
  [key: string]: string;
}

/**
 * Substitui as variáveis no template HTML do certificado
 * Variáveis suportadas: {{name}}, {{event}}, {{hours}}, {{date}}, {{dates}}, {{code}}
 *
 * @param template - Template HTML com placeholders entre {{}}
 * @param variables - Mapa de variáveis para substituir
 * @returns HTML renderizado do certificado
 */
export function renderCertificate(
  template: string,
  variables: CertificateVariables
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return variables[key] ?? `{{${key}}}`;
  });
}
