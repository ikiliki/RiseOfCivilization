import './CurrencyDisplay.styles.css';

interface CurrencyDisplayProps {
  amount: number;
}

export function CurrencyDisplay({ amount }: CurrencyDisplayProps) {
  return <div className="roc-currency-display">Credits: {amount}</div>;
}
