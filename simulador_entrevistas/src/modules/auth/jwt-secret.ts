import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const LONGITUD_RECOMENDADA = 32;
const VALORES_INSEGUROS = ['supersecret', 'secret', 'changeme', 'test'];

const logger = new Logger('JwtSecret');

export function obtenerJwtSecret(config: ConfigService): string {
  const secret = config.get<string>('JWT_SECRET')?.trim();

  if (!secret) {
    throw new Error(
      'JWT_SECRET no está definida. Configúrala en el archivo .env antes de iniciar la aplicación.',
    );
  }

  if (VALORES_INSEGUROS.includes(secret.toLowerCase())) {
    throw new Error(
      `JWT_SECRET tiene un valor inseguro conocido ("${secret}"). Genera uno nuevo con: openssl rand -base64 48`,
    );
  }

  if (secret.length < LONGITUD_RECOMENDADA) {
    logger.warn(
      `JWT_SECRET tiene ${secret.length} caracteres; se recomiendan al menos ${LONGITUD_RECOMENDADA}. Genera uno nuevo con: openssl rand -base64 48`,
    );
  }

  return secret;
}
