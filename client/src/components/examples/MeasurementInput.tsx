import { useState } from 'react';
import MeasurementInput from '../MeasurementInput';

export default function MeasurementInputExample() {
  const [height, setHeight] = useState('175');
  const [neck, setNeck] = useState('');

  return (
    <div className="p-6 max-w-md space-y-4">
      <MeasurementInput
        id="height"
        label="Altura"
        value={height}
        onChange={setHeight}
        placeholder="Ex: 175"
        unit="cm"
      />
      <MeasurementInput
        id="neck"
        label="Pescoço"
        value={neck}
        onChange={setNeck}
        placeholder="Ex: 38"
        unit="cm"
        error="Este campo é obrigatório"
      />
    </div>
  );
}