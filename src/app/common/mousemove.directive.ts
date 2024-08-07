import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appMousemove]'
})
export class MousemoveDirective {
  @Input() callBack:any;

  constructor() { }


  @HostListener('mousemove', ['$event']) onMouseMove(event:any) {
    this.callBack({
      x: event.clientX, 
      y: event.clientY
    });
  }
}
