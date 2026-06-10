import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLayout } from '../layouts/app-layout/app-layout';

@Component({
  selector: 'app-root',
  imports: [AppLayout, RouterOutlet],
  templateUrl: './app.html',
  styles: [],
  providers: [],
})
export class App {}
