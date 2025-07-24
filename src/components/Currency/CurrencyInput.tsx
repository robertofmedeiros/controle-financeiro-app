import React from 'react';
import { TextField } from '@mui/material';
import { CurrencyUtil } from '../Utils/CurrencyUtil';

interface CurrencyInputProps {
  id: string;
  label?: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  id,
  label = 'Valor',
  value,
  onChange,
  disabled = false,
}) => {

  const parseCurrency = (input: string): number => {
    const numeric = input.replace(/[^\d]/g, '');
    return parseFloat(numeric) / 100;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const parsed = parseCurrency(rawValue);
    onChange(parsed);
  };

  return (
    <TextField
      id={id}
      name={id}
      label={label}
      value={CurrencyUtil.formatCurrency(value)}
      onChange={handleChange}
      fullWidth
      disabled={disabled}
    />
  );
};

export default CurrencyInput;
