import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDropZone]'
})
export class DropZoneDirective {
  @Output() droped = new EventEmitter<FileList>();
  @Output() hovered = new EventEmitter<boolean>();

  constructor() { }

  @HostListener('drop', ['$event'])
  onDrop($event) {
    $event.preventDefault();
    this.droped.emit($event.dataTransfer.files);
    this.hovered.emit(false);
  }

  @HostListener('dragover', ['$event'])
  ondragover($event) {
    $event.preventDefault();
    this.hovered.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  ondragleave($event) {
    $event.preventDefault();
    this.hovered.emit(false);
  }
}
