import { useState } from 'react';
import GenderSelection from '../GenderSelection';

export default function GenderSelectionExample() {
  const [gender, setGender] = useState('male');

  return (
    <div className="p-6 max-w-md">
      <GenderSelection value={gender} onChange={setGender} />
    </div>
  );
}