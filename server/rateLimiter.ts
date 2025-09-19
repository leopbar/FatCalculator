import rateLimit from "express-rate-limit";

/**
 * Rate limiter para login - máximo 5 tentativas por IP a cada 15 minutos
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas
  message: {
    error: "Muitas tentativas de login. Tente novamente em alguns minutos.",
  },
  standardHeaders: true, // Retorna informações do rate limit nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita headers `X-RateLimit-*`
  // Removendo keyGenerator customizado para usar o padrão que suporta IPv6
  // Aplica apenas em falhas de autenticação
  skipSuccessfulRequests: true,
});

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Muitas requisições. Tente novamente em alguns minutos.",
});

/**
 * Rate limiter para registro - máximo 3 tentativas por IP a cada hora
 */
export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 tentativas
  message: {
    error: "Muitas tentativas de registro. Tente novamente em uma hora.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Removendo keyGenerator customizado para usar o padrão que suporta IPv6
  // Aplica apenas em falhas de registro
  skipSuccessfulRequests: true,
});
