
import React from "react";
import { Input } from "./input";
import { Label } from "./label";

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  "data-testid"?: string;
  autoComplete?: string;
}

// Función para validar los criterios de contraseña
const validatePassword = (password: string) => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  return hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSymbol;
};

export function PasswordField({
  value,
  onChange,
  error,
  label = "Contraseña",
  placeholder = "Ingrese su contraseña",
  className = "",
  "data-testid": testId,
  autoComplete = "new-password"
}: PasswordFieldProps) {
  const isPasswordValid = validatePassword(value);
  const showValidationError = value.length > 0 && !isPasswordValid;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="password-field">{label}</Label>
      
      {/* Mensaje informativo siempre visible */}
      <p className="text-sm text-gray-500">
        La contraseña debe tener al menos 8 caracteres, incluyendo letra mayúscula, minúscula, número y símbolo.
      </p>
      
      <Input
        id="password-field"
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        data-testid={testId}
        autoComplete={autoComplete}
        className={showValidationError ? "border-red-500" : ""}
      />
      
      {/* Mensaje de error de validación */}
      {showValidationError && (
        <p className="text-red-500 text-sm mt-1">
          La contraseña no cumple con los criterios requeridos.
        </p>
      )}
      
      {/* Mensaje de error externo (por ejemplo, del formulario) */}
      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
