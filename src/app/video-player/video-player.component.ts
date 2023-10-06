import {Component, Input, OnInit} from '@angular/core';
import {VgApiService} from "@videogular/ngx-videogular/core";

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit {

  @Input()
  videoUrl!: string | '';

  constructor() {
  }
  ngOnInit(): void {
  }

  onPlayerReady(event: VgApiService) {

  }
}
