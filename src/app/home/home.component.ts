import { Component, OnInit, AfterViewInit } from '@angular/core';
import { JitsiService } from './../services/jitsi.service';

@Component({
  selector: 'app-jitsi',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {
isAudioMuted: any;
  constructor(private jitsiService: JitsiService) {}
  ngOnInit(): void {
    this.jitsiService.moveRoom(this.jitsiService.namePrincipalRoom);
  }
}
