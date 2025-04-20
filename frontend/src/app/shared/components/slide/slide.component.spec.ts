import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SlideComponent } from './slide.component';
import { CommonModule } from '@angular/common';

describe('SlideComponent', () => {
  let component: SlideComponent;
  let fixture: ComponentFixture<SlideComponent>;

  const testSlides = [
    { id: 1, title: 'Slide 1', image: 'image1.jpg' },
    { id: 2, title: 'Slide 2', image: 'image2.jpg' },
    { id: 3, title: 'Slide 3', image: 'image3.jpg' },
    { id: 4, title: 'Slide 4', image: 'image4.jpg' },
    { id: 5, title: 'Slide 5', image: 'image5.jpg' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, SlideComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SlideComponent);
    component = fixture.componentInstance;
    component.slide = [...testSlides];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.currentIndex).toBe(0);
    expect(component.itemsToShow).toBe(3);
    expect(component.slide).toEqual(testSlides);
  });

  it('should show correct visible slides on initialization', () => {
    const visible = component.visibleSlide;
    expect(visible.length).toBe(3);
    expect(visible[0].id).toBe(1);
    expect(visible[1].id).toBe(2);
    expect(visible[2].id).toBe(3);
  });

  it('should move to next slide correctly', () => {
    component.next();
    expect(component.currentIndex).toBe(1);

    let visible = component.visibleSlide;
    expect(visible[0].id).toBe(2);
    expect(visible[1].id).toBe(3);
    expect(visible[2].id).toBe(4);

    // Test boundary condition
    component.currentIndex = 2; // Set to third slide
    component.next();
    expect(component.currentIndex).toBe(3);

    visible = component.visibleSlide;
    expect(visible.length).toBe(2); // Only 2 slides left
    expect(visible[0].id).toBe(4);
    expect(visible[1].id).toBe(5);

    // Should not go beyond last slide
    component.next();
    expect(component.currentIndex).toBe(3);
  });

  it('should move to previous slide correctly', () => {
    component.currentIndex = 2; // Start from third slide
    component.previous();
    expect(component.currentIndex).toBe(1);

    let visible = component.visibleSlide;
    expect(visible[0].id).toBe(2);
    expect(visible[1].id).toBe(3);
    expect(visible[2].id).toBe(4);

    // Test boundary condition
    component.previous();
    component.previous();
    expect(component.currentIndex).toBe(0); // Should not go below 0

    visible = component.visibleSlide;
    expect(visible.length).toBe(3);
    expect(visible[0].id).toBe(1);
  });

  it('should handle empty slide array', () => {
    component.slide = [];
    fixture.detectChanges();

    expect(component.visibleSlide).toEqual([]);
    expect(() => component.next()).not.toThrow();
    expect(() => component.previous()).not.toThrow();
  });

  it('should handle slides less than itemsToShow', () => {
    component.slide = testSlides.slice(0, 2); // Only 2 slides
    fixture.detectChanges();

    expect(component.visibleSlide.length).toBe(2);
    expect(component.visibleSlide[0].id).toBe(1);
    expect(component.visibleSlide[1].id).toBe(2);

    component.next();
    expect(component.currentIndex).toBe(1);
    expect(component.visibleSlide.length).toBe(1);
  });

  it('should update visible slides when input changes', () => {
    const newSlides = [
      { id: 10, title: 'New Slide 1', image: 'new1.jpg' },
      { id: 11, title: 'New Slide 2', image: 'new2.jpg' },
    ];
    component.slide = newSlides;
    fixture.detectChanges();

    expect(component.visibleSlide).toEqual(newSlides);
    expect(component.currentIndex).toBe(0);
  });
});
