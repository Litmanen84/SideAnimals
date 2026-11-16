import { Component } from '@angular/core';
import dayjs from 'dayjs';

@Component({
  imports: [],
  selector: 'app-footer',
  styleUrl: './footer.css',
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly year: number = dayjs().year();
}
