import { Component, computed, forwardRef, input, output, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date';
export type InputSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-input',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './input.html',
  styleUrl: './input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true,
    },
  ],
})
export class Input implements ControlValueAccessor {
  readonly label = input<string>();
  readonly placeholder = input<string>('');
  readonly type = input<InputType>('text');
  readonly size = input<InputSize>('md');
  readonly disabled = input(false);
  readonly required = input(false);
  readonly readonly = input(false);
  readonly autocomplete = input<string>();
  readonly maxlength = input<number>();
  readonly minlength = input<number>();
  readonly min = input<number | string>();
  readonly max = input<number | string>();
  readonly step = input<number | string>();
  readonly pattern = input<string>();
  readonly name = input<string>();
  readonly hint = input<string>();
  readonly error = input<string>();
  readonly autofocus = input(false);

  readonly valueChange = output<string>();
  readonly blur = output<FocusEvent>();
  readonly focus = output<FocusEvent>();

  protected value = signal<string>('');
  protected isDisabled = signal(false);
  protected isFocused = signal(false);
  protected isTouched = signal(false);

  protected hasError = computed(() => !!this.error());

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(obj: unknown): void {
    this.value.set(obj != null ? String(obj) : '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  protected onInput(event: Event): void {
    const newValue = (event.target as HTMLInputElement).value;
    this.value.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue);
  }

  protected onFocus(event: FocusEvent): void {
    this.isFocused.set(true);
    this.focus.emit(event);
  }

  protected onBlur(event: FocusEvent): void {
    this.isFocused.set(false);
    if (!this.isTouched()) {
      this.isTouched.set(true);
      this.onTouched();
    }
    this.blur.emit(event);
  }
}
