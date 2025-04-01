import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'shared-slide',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide.component.html',
  styleUrl: './slide.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideComponent {
  @Input() public slide: any[] = [];
  public currentIndex = 0;
  public itemsToShow = 3;

  public previous(): void {
    this.currentIndex = Math.max(this.currentIndex - 1, 0);
  }
  public next(): void {
    if (this.currentIndex === 3) return;
    if (this.currentIndex + 1 < this.slide.length) {
      this.currentIndex += 1;
    }
  }
  public get visibleSlide(): any[] {
    return this.slide.slice(this.currentIndex, this.currentIndex + this.itemsToShow);
  }
}
