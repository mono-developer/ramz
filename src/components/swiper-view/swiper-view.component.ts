import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'swiper-view',
  templateUrl: 'swiper-view.component.html'
})
export class SwiperViewComponent implements OnInit {

  @Input('comC') comC: any;
  @Input('configURL') configURL: any;
  @Output() shareClick = new EventEmitter<any>();
  @Output() locationClick = new EventEmitter<any>();
  @Output() favClick = new EventEmitter<any>();
  config: Object;


  constructor() {

    this.config = {
      scrollbar: '.swiper-scrollbar',
      scrollbarHide: true,
      slidesPerView: 'auto',
      centeredSlides: true,
      observer: true,
      spaceBetween: 40,
      grabCursor: true
    };
  }

  ngOnInit() {
  }

  openSharePage(item) {
    this.shareClick.emit(item);
  }

  openLocationPage(item) {
    this.locationClick.emit(item);
  }

  setFav(item) {
    this.favClick.emit(item);
  }

}
