import ResultDisplay from '../ResultDisplay';

export default function ResultDisplayExample() {
  return (
    <div className="p-6 max-w-md">
      <ResultDisplay
        bodyFatPercentage={18.5}
        category="Fitness"
        categoryColor="success"
      />
    </div>
  );
}