import { Component } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {

  message:string = "";
  show:boolean = false;

  showMessage(msg:string)
  {
    this.message = msg;
    this.show = true;
  }

  hideMessage()
  {
    this.message = "";
    this.show = false;
  }

}
