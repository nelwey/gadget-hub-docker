import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { SlideComponent } from '../shared/components/slide/slide.component';

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    SlideComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  public email: string = "gadget@hub.ru";
  public hitItems: any[] = [
    { status: "Хит", src: "/assets/images/image1.png", price: 49990, description: "Шлем виртуальной реальности 128...", rating: "4,8" },
    { status: "Хит", src: "/assets/images/image2.png", price: 10590, description: "Аппаратный ключ аутентификации...", rating: "5" },
    { status: "Хит", src: "/assets/images/image10.png", price: 4990, description: "Беспроводная акустика, бежевый", rating: "5" },
    { status: "Хит", src: "/assets/images/image1.png", price: 49990, description: "Шлем виртуальной реальности 128...", rating: "4,8" },
    { status: "Хит", src: "/assets/images/image2.png", price: 10590, description: "Аппаратный ключ аутентификации...", rating: "5" },
    { status: "Хит", src: "/assets/images/image10.png", price: 4990, description: "Беспроводная акустика, бежевый", rating: "5" },
  ]
  public newItems: any[] = [
    { status: "Новинка", src: "/assets/images/image5.png", price: 27990, description: "Умный робот-друг", rating: "" },
    { status: "Новинка", src: "/assets/images/image6.png", price: 2000, description: "Часы с GPS трекером, розовый", rating: "" },
    { status: "Новинка", src: "/assets/images/image4.png", price: 15199, description: "Смарт-часы, черный", rating: "4" },
    { status: "Новинка", src: "/assets/images/image5.png", price: 2000, description: "Часы с GPS трекером, розовый", rating: "5" },
    { status: "Новинка", src: "/assets/images/image6.png", price: 15199, description: "Смарт-часы, черный", rating: "5" },
    { status: "Новинка", src: "/assets/images/image4.png", price: 27990, description: "Умный робот-друг", rating: "5" },
  ]




}
