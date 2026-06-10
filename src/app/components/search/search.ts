import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged, skip, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [MatIconModule, FormsModule],
  templateUrl: './search.html',
  styles: `
    :host {
      display: block;
    }
  `,
})
export class Search {
  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  searchValue = output<string>();
  internalValue = signal('');

  constructor() {
    this.search$
      .pipe(skip(1), debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => this.searchValue.emit(value));
  }

  onChange(value: string) {
    this.internalValue.set(value);
    this.search$.next(value);
  }

  onInput(value: string) {
    this.internalValue.set(value);
    this.search$.next(value);
  }

  clear() {
    this.internalValue.set('');
    this.search$.next('');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
