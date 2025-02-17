import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'shared-slide',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './slide.component.html',
  styleUrl: './slide.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideComponent {
  @Input() slide: any[] = [];

  currentIndex = 0;
  itemsToShow = 3;

  previous() {
    this.currentIndex = Math.max(this.currentIndex - 1, 0);
  }
  next() {
    if (this.currentIndex === 3) return;
    if (this.currentIndex + 1 < this.slide.length) {
      this.currentIndex += 1;
    }
  }
  get visibleSlide() {
    return this.slide.slice(this.currentIndex, this.currentIndex + this.itemsToShow);
  }
}
