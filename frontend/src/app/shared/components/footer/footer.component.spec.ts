import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { By } from '@angular/platform-browser';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct company name and description', () => {
    const companyName = fixture.debugElement.query(By.css('p.font-inter'));
    expect(companyName.nativeElement.textContent.trim()).toBe('Gadget Hub');

    const description = fixture.debugElement.queryAll(By.css('p.font-rubik'))[0];
    expect(description.nativeElement.textContent.trim()).toBe('Магазин надежных гаджетов');
  });

  it('should display the copyright text', () => {
    const copyright = fixture.debugElement.queryAll(By.css('p.font-rubik'))[1];
    // Using toContain with trimmed text and ignoring quote differences
    expect(copyright.nativeElement.textContent.trim()).toContain('© 2024 ООО');
    expect(copyright.nativeElement.textContent.trim()).toContain('Гаджет Хаб');
    expect(copyright.nativeElement.textContent.trim()).toContain('Все права защищены');
  });

  it('should display the phone number correctly', () => {
    // Find the phone number by looking for the span that contains the phone number text
    const spans = fixture.debugElement.queryAll(By.css('span'));
    const phoneNumberSpan = spans.find((span) =>
      span.nativeElement.textContent.includes('8 (800) 678-34-24')
    );
    expect(phoneNumberSpan).toBeTruthy();
  });

  it('should have social media icons', () => {
    const socialIcons = fixture.debugElement.queryAll(By.css('img'));
    const logoIcons = socialIcons.filter((img) =>
      ['vk_logo', 'telegram_logo', 'wpp_logo'].includes(img.nativeElement.alt)
    );
    expect(logoIcons.length).toBe(3);
  });

  it('should have a smartphone icon', () => {
    const smartphoneIcon = fixture.debugElement.query(By.css('img[alt="smartphone_icon"]'));
    expect(smartphoneIcon).toBeTruthy();
    expect(smartphoneIcon.nativeElement.classList.contains('size-8')).toBeTrue();
  });

  it('should have the correct layout structure', () => {
    const navElement = fixture.debugElement.query(By.css('nav'));
    expect(navElement).toBeTruthy();
    expect(navElement.nativeElement.classList.contains('flex')).toBeTrue();

    const divs = fixture.debugElement.queryAll(By.css('nav > div'));
    expect(divs.length).toBe(2);
    expect(divs[0].nativeElement.classList.contains('w-1/2')).toBeTrue();
    expect(divs[1].nativeElement.classList.contains('w-1/2')).toBeTrue();
  });
});
