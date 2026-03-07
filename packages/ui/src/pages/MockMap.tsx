import './MockMap.styles.css';

interface MockMapProps {
  label?: string;
}

/**
 * Placeholder for the 3D game map in Storybook.
 * Simulates terrain with a gradient background.
 */
export function MockMap({ label = 'Map' }: MockMapProps) {
  return <div className="roc-mock-map">{label}</div>;
}
