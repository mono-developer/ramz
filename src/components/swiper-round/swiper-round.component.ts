import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'swiper-round',
  templateUrl: 'swiper-round.component.html'
})
export class SwiperRoundComponent implements OnInit {

  @Input('pk') pk: any;
  @Input('configURL') configURL: any;
  @Output() swiperClick = new EventEmitter<any>();
  config: Object;


  constructor() {

    this.config = {
      scrollbar: '.swiper-scrollbar',
      scrollbarHide: true,
      slidesPerView: 'auto',
      centeredSlides: true,
      observer: true,
      spaceBetween: 20,
      grabCursor: true
    };
  }

  ngOnInit() {
    console.log("pk", this.pk);
  }
  onClickImage(item) {
    this.swiperClick.emit(item);
  }
}
