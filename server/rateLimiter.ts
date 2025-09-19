
import rateLimit from 'express-rate-limit';

/**
 * Middleware de rate limiting para proteger contra ataques de força bruta
 * Aplica limite de 5 tentativas por IP a cada 15 minutos
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos em milissegundos
  max: 5, // Máximo de 5 tentativas por IP
  message: {
    error: "Muitas tentativas de login. Tente novamente em alguns minutos."
  },
  standardHeaders: true, // Retorna informações de rate limit nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita headers `X-RateLimit-*` (obsoletos)
  
  // Função para gerar chave única por IP
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
  
  // Função personalizada para tratamento quando limite é excedido
  handler: (req, res) => {
    console.log(`🚫 Rate limit excedido para IP: ${req.ip} na rota ${req.path}`);
    
    res.status(429).json({
      error: "Muitas tentativas de login. Tente novamente em alguns minutos.",
      retryAfter: Math.ceil(15 * 60) // 15 minutos em segundos
    });
  },

  // Função para pular rate limiting (útil para testes ou IPs confiáveis)
  skip: (req) => {
    // Opcional: pular rate limiting para IPs locais em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      const localIPs = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];
      return localIPs.includes(req.ip);
    }
    return false;
  }
});

/**
 * Rate limiter mais restritivo para tentativas de registro
 * 3 tentativas por IP a cada 30 minutos
 */
export const registerRateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutos
  max: 3, // Máximo de 3 tentativas de registro por IP
  message: {
    error: "Muitas tentativas de registro. Tente novamente em 30 minutos."
  },
  standardHeaders: true,
  legacyHeaders: false,
  
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
  
  handler: (req, res) => {
    console.log(`🚫 Rate limit de registro excedido para IP: ${req.ip}`);
    
    res.status(429).json({
      error: "Muitas tentativas de registro. Tente novamente em 30 minutos.",
      retryAfter: Math.ceil(30 * 60) // 30 minutos em segundos
    });
  }
});

/**
 * Rate limiter geral para todas as rotas da API
 * 100 requests por IP a cada 15 minutos
 */
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo de 100 requests por IP
  message: {
    error: "Muitas requisições. Tente novamente em alguns minutos."
  },
  standardHeaders: true,
  legacyHeaders: false,
  
  // Aplicar apenas para rotas da API
  skip: (req) => {
    return !req.path.startsWith('/api');
  }
});
