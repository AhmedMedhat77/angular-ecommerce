import { Component, viewChild } from '@angular/core';
import { CategiesList } from '../../components/categies-list/categies-list';
import { ProductsList } from '../../components/products-list/products-list';

@Component({
  selector: 'app-home',
  imports: [CategiesList, ProductsList],
  templateUrl: './home.html',
  styles: `
    .dashboard-layout {
      display: flex;
      height: calc(100svh - 56px);
      overflow: hidden;
    }

    .dashboard-sidebar {
      width: 260px;
      min-width: 260px;
      border-right: 1px solid #e5e7eb;
      background: #fff;
      overflow-y: auto;
      padding: 1rem;
    }

    .dashboard-sidebar::-webkit-scrollbar {
      width: 4px;
    }

    .dashboard-sidebar::-webkit-scrollbar-thumb {
      background: #e5e7eb;
      border-radius: 2px;
    }

    .dashboard-main {
      flex: 1;
      overflow: hidden;
      background: #f8fafc;
    }

    @media (max-width: 1023px) {
      .dashboard-layout {
        flex-direction: column;
        height: auto;
        overflow: auto;
        background: #f8fafc;
      }

      .dashboard-main {
        overflow: auto;
      }
    }
  `,
})
export class Home {
  productsList = viewChild.required(ProductsList);

  onCategoriesChanged(categories: string[]) {
    this.productsList().filterByCategories(categories);
  }
}
