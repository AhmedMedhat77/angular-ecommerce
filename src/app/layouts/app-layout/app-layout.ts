import { Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { Navbar } from '../../components/navbar/navbar';

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

    main {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .content-container {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    @media (min-width: 1024px) {
      :host {
        min-height: 100vh;
      }

      main {
        height: 100%;
      }

      .content-container {
      }
    }
  `,
})
export class AppLayout {}
