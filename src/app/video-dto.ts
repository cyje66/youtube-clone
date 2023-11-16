import {VideoService} from "./video.service";

export interface VideoDto {
  id: string;
  title: string;
  description: string;
  tags: Array<string>;
  videoUrl: string;
  videoStatus: VideoService;
  thumbnailUrl: string;
  likeCount: number;
  dislikeCount: number;
  viewCount: number;
}
