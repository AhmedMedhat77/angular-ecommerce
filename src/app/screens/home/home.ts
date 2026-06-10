import { Component } from '@angular/core';
import { CategiesList } from '../../components/categies-list/categies-list';
import { ProductsList } from '../../components/products-list/products-list';

@Component({
  selector: 'app-home',
  imports: [CategiesList, ProductsList],
  templateUrl: './home.html',
  styles: ``,
})
export class Home {}
