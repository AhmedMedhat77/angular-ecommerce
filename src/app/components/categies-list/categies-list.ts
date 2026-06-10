import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ICategory } from '../../../interfaces/categories/categories.interface';
import { Categories } from '../../services/categories';

@Component({
  selector: 'app-categies-list',
  imports: [FormsModule, MatIconModule],
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

  getCategoryIcon(name: string): string {
    const norm = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (norm.includes('beauty')) return 'face';
    if (norm.includes('fragrance')) return 'local_florist';
    if (norm.includes('furniture')) return 'weekend';
    if (norm.includes('grocery') || norm.includes('groceries')) return 'shopping_basket';
    if (norm.includes('homedecor') || norm.includes('decoration')) return 'home';
    if (norm.includes('kitchen')) return 'soup_kitchen';
    if (norm.includes('laptop')) return 'laptop';
    if (norm.includes('mensshirt') || norm.includes('shirt')) return 'checkroom';
    if (norm.includes('mensshoe') || norm.includes('shoe')) return 'checkroom';
    if (norm.includes('watch')) return 'watch';
    if (norm.includes('mobileaccessories') || norm.includes('accessory')) return 'phonelink';
    if (norm.includes('motorcycle') || norm.includes('bike')) return 'two_wheeler';
    if (norm.includes('skincare')) return 'spa';
    if (norm.includes('smartphone') || norm.includes('phone')) return 'smartphone';
    if (norm.includes('sports') || norm.includes('fitness')) return 'sports_soccer';
    if (norm.includes('sunglasses') || norm.includes('glass')) return 'wb_sunny';
    if (norm.includes('tablet')) return 'tablet_mac';
    if (norm.includes('vehicle') || norm.includes('car')) return 'directions_car';
    if (norm.includes('bag') || norm.includes('luggage')) return 'shopping_bag';
    if (norm.includes('dress')) return 'checkroom';
    if (norm.includes('jewelry') || norm.includes('jewel')) return 'diamond';
    return 'label';
  }

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

  clearAll() {
    this.selectedCategories.set([]);
    this.categoriesChanged.emit([]);
  }
}
