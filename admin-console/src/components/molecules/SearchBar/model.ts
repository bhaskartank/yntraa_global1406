export interface SearchBarProps {
  label?: string;
  isStriclyRequired?: boolean;
  placeholder?: string;
  helpText?: string;
  icon?: boolean;
  clearButton?: boolean;
  onClear?: () => void;
  primaryIconOverride?: React.ReactElement;
  secondaryComponentButtonOverride?: React.ReactElement;
  disabled?: boolean;
  externalStyles?: any;
  width?: any;
  autoFocus?:boolean;
}
