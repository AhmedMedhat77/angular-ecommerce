import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICategory } from '../../../interfaces/categories/categories.interface';
import { Categories } from '../../services/categories';

@Component({
  selector: 'app-categies-list',
  imports: [FormsModule],
  templateUrl: './categies-list.html',
  styleUrl: './categies-list.css',
})
export class CategiesList implements OnInit {
  private categoriesService = inject(Categories);

  categories = signal<ICategory[]>([]);
  selectedCategories = signal<string[]>([]);
  loading = this.categoriesService.isLoading;
  skeletonItems = Array.from({ length: 8 }, () => ({}));

  categoriesChanged = output<string[]>();

  ngOnInit() {
    this.getCategories();
  }

  async getCategories() {
    const data = await this.categoriesService.getAll();
    if (data) {
      this.categories.set(data);
    }
  }

  isSelected(name: string): boolean {
    return this.selectedCategories().includes(name);
  }

  toggleCategory(name: string) {
    if (this.isSelected(name)) {
      this.selectedCategories.set(this.selectedCategories().filter((c) => c !== name));
    } else {
      this.selectedCategories.set([...this.selectedCategories(), name]);
    }
    this.categoriesChanged.emit(this.selectedCategories());
  }
}
