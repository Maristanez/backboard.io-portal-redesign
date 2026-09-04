/**
 * Text inputs, and the label scaffolding around them.
 *
 * The same input styling was defined independently in four files. One
 * definition here means a change to focus treatment or field colour is a
 * single edit rather than a hunt.
 */
import type { ChangeEvent, CSSProperties, ReactNode } from 'react'

import { border, color, kicker } from '../../design/tokens'

/** Shared input skin. Exported for the rare case that needs a bare input. */
export const fieldStyle: CSSProperties = {
  padding: '13px 14px',
  borderRadius: 8,
  border: `1px solid ${border.strong}`,
  background: color.field,
  color: color.text,
  fontSize: 14,
  outline: 'none',
}

interface LabelledProps {
  label: string
  /** Small print under the control. */
  hint?: string | undefined
  children: ReactNode
}

/** Kicker-labelled wrapper, the form pattern the design uses throughout. */
export function Labelled({ label, hint, children }: LabelledProps) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={kicker()}>{label}</span>
      {children}
      {hint && <span style={{ fontSize: 12, color: color.textFaint }}>{hint}</span>}
    </label>
  )
}

interface FieldProps {
  label: string
  placeholder?: string
  hint?: string
  value?: string
  onChange?: (value: string) => void
  style?: CSSProperties
}

export function Field({ label, placeholder, hint, value, onChange, style }: FieldProps) {
  return (
    <Labelled label={label} hint={hint}>
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value) : undefined}
        style={{ ...fieldStyle, ...style }}
      />
    </Labelled>
  )
}

interface TextAreaProps extends Omit<FieldProps, 'style'> {
  rows?: number
}

export function TextArea({ label, placeholder, hint, value, onChange, rows = 3 }: TextAreaProps) {
  return (
    <Labelled label={label} hint={hint}>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={
          onChange ? (e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value) : undefined
        }
        rows={rows}
        style={{ ...fieldStyle, resize: 'none' }}
      />
    </Labelled>
  )
}
