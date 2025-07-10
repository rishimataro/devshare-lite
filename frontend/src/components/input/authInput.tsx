import React from 'react';
import { Input, Tooltip } from 'antd';
import { InputProps } from 'antd/es/input';

interface AuthInputProps extends Omit<InputProps, 'prefix' | 'suffix'> {
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  tooltipTitle?: string;
}

const AuthInput: React.FC<AuthInputProps> = ({
  prefixIcon,
  suffixIcon,
  tooltipTitle,
  ...props
}) => {
  return (
    <Input
      {...props}
      prefix={prefixIcon && <span style={{ color: 'rgba(0,0,0,.25)' }}>{prefixIcon}</span>}
      suffix={
        suffixIcon && tooltipTitle ? (
          <Tooltip title={tooltipTitle}>
            <span style={{ color: 'rgba(0,0,0,.45)' }}>{suffixIcon}</span>
          </Tooltip>
        ) : (
          suffixIcon && <span style={{ color: 'rgba(0,0,0,.45)' }}>{suffixIcon}</span>
        )
      }
    />
  );
};

export default AuthInput;