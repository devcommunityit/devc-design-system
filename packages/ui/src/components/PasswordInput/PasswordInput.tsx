import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useState, type ReactNode } from 'react';
import { Button as RACButton, Group, TextField as RACTextField, composeRenderProps, type TextFieldProps as RACTextFieldProps } from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { FieldParts, type FieldBaseProps } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import { Input, type InputProps } from '../TextField/TextField';

export interface PasswordInputProps extends Omit<RACTextFieldProps, 'children' | 'type'>, FieldBaseProps {
  placeholder?: string;
  /** Decorative element before the input. */
  startAdornment?: ReactNode;
  /** Initial visibility of the password. @default false */
  defaultRevealed?: boolean;
  inputProps?: Omit<InputProps, 'ref' | 'type'>;
}

/**
 * Password field with a show/hide button. Defaults to `autoComplete="current-password"`;
 * use `"new-password"` on registration forms. Strength rules belong to the consumer.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  {
    label,
    description,
    errorMessage,
    necessityIndicator,
    placeholder,
    startAdornment,
    defaultRevealed = false,
    inputProps,
    className,
    isRequired,
    autoComplete = 'current-password',
    ...rest
  },
  ref,
) {
  const t = useMessages();
  const [revealed, setRevealed] = useState(defaultRevealed);
  return (
    <RACTextField
      {...rest}
      type={revealed ? 'text' : 'password'}
      autoComplete={autoComplete}
      isRequired={isRequired}
      className={composeRenderProps(className, (cn) => cx(fieldStyles.field, cn))}
    >
      {({ isDisabled }) => (
        <FieldParts label={label} description={description} errorMessage={errorMessage} isRequired={isRequired} necessityIndicator={necessityIndicator}>
          <Group className={fieldStyles.control}>
            {startAdornment ? (
              <span className={fieldStyles.adornment} aria-hidden="true">
                {startAdornment}
              </span>
            ) : null}
            <Input ref={ref} placeholder={placeholder} spellCheck={false} autoCapitalize="off" {...inputProps} />
            <RACButton
              slot={null}
              className={fieldStyles.inlineButton}
              aria-label={revealed ? t.hidePassword : t.showPassword}
              isDisabled={isDisabled}
              onPress={() => setRevealed((v) => !v)}
            >
              {revealed ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
            </RACButton>
          </Group>
        </FieldParts>
      )}
    </RACTextField>
  );
});