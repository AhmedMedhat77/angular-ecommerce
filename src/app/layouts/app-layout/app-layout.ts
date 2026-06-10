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
        height: 100vh;
        overflow: hidden;
      }

      main {
        height: 100%;
        overflow: hidden;
      }

      .content-container {
        overflow-y: auto;
      }
    }
  `,
})
export class AppLayout {}
