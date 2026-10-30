import { forwardRef, useState, type ReactNode } from 'react';
import {
  Group,
  Input as RACInput,
  TextArea as RACTextArea,
  TextField as RACTextField,
  composeRenderProps,
  type InputProps as RACInputProps,
  type TextAreaProps as RACTextAreaProps,
  type TextFieldProps as RACTextFieldProps,
} from 'react-aria-components';
import { cx } from '../../utils';
import { FieldParts, type FieldBaseProps } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';

export type InputProps = RACInputProps;

/** Bare styled input. Use inside react-aria fields or `Field`; prefer `TextField` for normal forms. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, ...rest }, ref) {
  return <RACInput ref={ref} className={composeRenderProps(className, (cn) => cx(fieldStyles.input, cn))} {...rest} />;
});

export interface TextFieldProps extends Omit<RACTextFieldProps, 'children'>, FieldBaseProps {
  placeholder?: string;
  /** Decorative element before the input (e.g. icon). */
  startAdornment?: ReactNode;
  /** Element after the input (e.g. unit, icon or a small button). */
  endAdornment?: ReactNode;
  /** Props for the native `<input>` (e.g. `inputMode`, `list`, `size`). */
  inputProps?: Omit<InputProps, 'ref'>;
}

/**
 * Single-line text input with label, description and validation message.
 * Supports `value`/`defaultValue`, `isRequired`, `isInvalid`, `isDisabled`, `isReadOnly`,
 * native constraints (`type`, `minLength`, `pattern`…) and custom `validate`.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, description, errorMessage, necessityIndicator, placeholder, startAdornment, endAdornment, inputProps, className, isRequired, ...rest },
  ref,
) {
  return (
    <RACTextField
      {...rest}
      isRequired={isRequired}
      className={composeRenderProps(className, (cn) => cx(fieldStyles.field, cn))}
    >
      <FieldParts label={label} description={description} errorMessage={errorMessage} isRequired={isRequired} necessityIndicator={necessityIndicator}>
        <Group className={fieldStyles.control}>
          {startAdornment ? (
            <span className={fieldStyles.adornment} aria-hidden="true">
              {startAdornment}
            </span>
          ) : null}
          <Input ref={ref} placeholder={placeholder} {...inputProps} />
          {endAdornment ? <span className={fieldStyles.adornment}>{endAdornment}</span> : null}
        </Group>
      </FieldParts>
    </RACTextField>
  );
});

export interface TextareaProps extends Omit<RACTextFieldProps, 'children'>, FieldBaseProps {
  placeholder?: string;
  /** Visible rows. @default 4 */
  rows?: number;
  /** Shows a live character counter when `maxLength` is set. */
  showCount?: boolean;
  textareaProps?: Omit<RACTextAreaProps, 'ref'>;
}

/** Multi-line text input with the same field anatomy as TextField. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, description, errorMessage, necessityIndicator, placeholder, rows = 4, showCount, textareaProps, className, isRequired, maxLength, onChange, ...rest },
  ref,
) {
  const [uncontrolledLength, setUncontrolledLength] = useState(() => (rest.defaultValue ?? '').length);
  const length = rest.value !== undefined ? rest.value.length : uncontrolledLength;
  return (
    <RACTextField
      {...rest}
      maxLength={maxLength}
      isRequired={isRequired}
      onChange={(v) => {
        setUncontrolledLength(v.length);
        onChange?.(v);
      }}
      className={composeRenderProps(className, (cn) => cx(fieldStyles.field, cn))}
    >
      <FieldParts label={label} description={description} errorMessage={errorMessage} isRequired={isRequired} necessityIndicator={necessityIndicator}>
        <Group className={fieldStyles.control}>
          <RACTextArea ref={ref} rows={rows} placeholder={placeholder} className={fieldStyles.input} {...textareaProps} />
        </Group>
        {showCount && maxLength !== undefined ? (
          <span className={fieldStyles.description} data-counter="">
            {length}/{maxLength}
          </span>
        ) : null}
      </FieldParts>
    </RACTextField>
  );
});
