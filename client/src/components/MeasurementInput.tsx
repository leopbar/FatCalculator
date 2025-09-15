import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface MeasurementInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  unit: string;
  error?: string;
  id: string;
}

export default function MeasurementInput({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  unit, 
  error, 
  id 
}: MeasurementInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="number"
          step="0.1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "pr-12 transition-all duration-200",
            error && "border-destructive focus:ring-destructive"
          )}
          data-testid={`input-${id}`}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          {unit}
        </span>
      </div>
      {error && (
        <p className="text-sm text-destructive" data-testid={`error-${id}`}>
          {error}
        </p>
      )}
    </div>
  );
}