import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-app-cart',
  imports: [MatIconModule],
  templateUrl: './app-cart.html',
  styles: `
    :host {
      display: block;
    }
  `,
})
export class AppCart {
  counter = signal<number>(0);
}
