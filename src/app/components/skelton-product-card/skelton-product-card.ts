import { Component } from '@angular/core';

@Component({
  selector: 'app-skelton-product-card',
  imports: [],
  template: `
    <div class="rounded-2xl overflow-hidden border border-gray-100">
      <div class="h-56 bg-gray-200 animate-pulse"></div>
      <div class="p-5 pb-6 flex flex-col gap-2.5">
        <div class="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
        <div class="flex gap-1 mt-1">
          @for (s of starsSkeleton; track s) {
            <div class="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
          }
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class SkeltonProductCard {
  readonly starsSkeleton = Array.from({ length: 5 });
}
