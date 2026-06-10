import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-app-layout',
  imports: [Navbar, Footer],
  templateUrl: './app-layout.html',
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
  `,
})
export class AppLayout {}
