import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { User, Users } from "lucide-react";

interface GenderSelectionProps {
  value: string;
  onChange: (value: string) => void;
}

export default function GenderSelection({ value, onChange }: GenderSelectionProps) {
  return (
    <div className="space-y-4">
      <Label className="text-base font-medium text-foreground">Sexo</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-2 gap-4"
        data-testid="radio-group-gender"
      >
        <div className="flex items-center space-x-2 border rounded-lg p-4 hover-elevate transition-all duration-200">
          <RadioGroupItem value="male" id="male" data-testid="radio-male" />
          <Label htmlFor="male" className="flex items-center space-x-2 cursor-pointer flex-1">
            <User className="w-5 h-5 text-primary" />
            <span>Masculino</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2 border rounded-lg p-4 hover-elevate transition-all duration-200">
          <RadioGroupItem value="female" id="female" data-testid="radio-female" />
          <Label htmlFor="female" className="flex items-center space-x-2 cursor-pointer flex-1">
            <Users className="w-5 h-5 text-primary" />
            <span>Feminino</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}