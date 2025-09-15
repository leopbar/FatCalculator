# Design Guidelines: US Navy Body Fat Calculator

## Design Approach
**Reference-Based Approach**: Drawing inspiration from medical calculators like MyFitnessPal and health apps known for clean, functional interfaces. This utility-focused application prioritizes clarity, efficiency, and trust through minimalist design.

## Core Design Elements

### A. Color Palette
**Light Mode:**
- Primary: 142 71% 50% (verde suave #2ECC71)
- Primary Dark: 145 63% 42% (verde escuro #27AE60)
- Background: 0 0% 100% (branco puro)
- Text Primary: 210 29% 24% (cinza escuro #2C3E50)
- Success/Accent: 142 76% 73% (verde claro #A8E6CF)
- Border/Input: 210 14% 83% (cinza claro #BDC3C7)
- Error: 0 74% 42% (vermelho para validação)

### B. Typography
- **Primary Font**: Inter via Google Fonts CDN
- **Fallback**: Roboto, system fonts
- **Hierarchy**: 
  - H1: 2xl font-bold (títulos principais)
  - H2: xl font-semibold (seções)
  - Body: base font-normal (texto geral)
  - Small: sm font-medium (labels, hints)

### C. Layout System
**Spacing Units**: Consistent use of Tailwind units 4, 6, and 8
- Padding: p-4, p-6, p-8
- Margins: m-4, m-6, m-8
- Gaps: gap-4, gap-6, gap-8
- **Container**: max-w-md mx-auto (centered, mobile-first)

### D. Component Library

**Primary Components:**
- **Gender Selection**: Radio buttons com ícones e labels claros
- **Input Fields**: Rounded inputs com labels flutuantes, border verde no focus
- **Calculate Button**: bg-primary com rounded-lg, full width, destaque visual
- **Result Card**: Background verde claro, tipografia destacada para percentual
- **Validation Alerts**: Border vermelho e texto de erro abaixo dos campos

**Navigation**: Não aplicável (single-page app)

**Forms**: 
- Labels acima dos inputs
- Placeholders descritivos
- Validação em tempo real
- Agrupamento lógico por seção

**Data Display**:
- Card principal centrado
- Resultado em destaque com grande tipografia
- Mensagem explicativa em texto menor
- Separação visual clara entre entrada e resultado

### E. Animations
**Minimal Approach**: 
- Smooth transitions nos estados de hover/focus (transition-all duration-200)
- Fade-in sutil para exibição de resultados
- Micro-interações apenas para feedback de validação

## Key Design Principles
1. **Clareza Médica**: Interface confiável que transmite precisão
2. **Simplicidade Funcional**: Foco na tarefa sem distrações
3. **Responsividade**: Mobile-first com adaptação desktop
4. **Acessibilidade**: Contraste adequado e navegação por teclado
5. **Validação Preventiva**: Feedback imediato para entrada de dados

## Layout Structure
- **Header**: Título centrado e descrição breve
- **Form Section**: Card principal com campos agrupados
- **Result Section**: Exibição destacada do percentual calculado
- **Footer**: Informações sobre o método (opcional)

Esta abordagem garante uma experiência profissional e confiável, priorizando a funcionalidade sobre elementos decorativos, adequada para o contexto médico/saúde.