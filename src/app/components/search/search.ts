import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, skip, Subject, takeUntil } from 'rxjs';
import { Products } from '../../services/products';

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
  private products = inject(Products);
  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  internalValue = signal('');

  constructor() {
    this.search$
      .pipe(
        skip(1),
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe((term) => this.products.search(term));
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
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
