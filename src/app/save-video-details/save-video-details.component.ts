import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {map, Observable, startWith} from "rxjs";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {ActivatedRoute} from "@angular/router";
import {VideoService} from "../video.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {VideoDto} from "../video-dto";

@Component({
  selector: 'app-save-video-details',
  templateUrl: './save-video-details.component.html',
  styleUrls: ['./save-video-details.component.css']
})
export class SaveVideoDetailsComponent implements OnInit{

  saveVideoDetailsForm: FormGroup;
  title: FormControl = new FormControl('');
  description: FormControl = new FormControl('');
  videoStatus: FormControl = new FormControl('');

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  allTags: string[] = [];

  @ViewChild('tagInput')
  tagInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);
  selectedFile!: File;
  selectedFileName = '';
  videoId = '';
  fileSelected = false;
  videoUrl!: string;
  thumbnailUrl!: string;

  constructor(private activatedRoute: ActivatedRoute, private videoService: VideoService,
              private matSnackBar: MatSnackBar) {
    this.videoId = this.activatedRoute.snapshot.params['videoId'];
    this.videoService.getVideo(this.videoId).subscribe(data => {
      this.videoUrl = data.videoUrl;
      this.thumbnailUrl = data.thumbnailUrl
    })
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
    );
    this.saveVideoDetailsForm = new FormGroup({
      title: this.title,
      description: this.description,
      videoStatus: this.videoStatus,
    });
  }

  ngOnInit() {
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our tag
    if (value) {
      this.tags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.tagCtrl.setValue(null);
  }

  remove(value: string): void {
    const index = this.tags.indexOf(value);

    if (index >= 0) {
      this.tags.splice(index, 1);

      this.announcer.announce(`Removed ${value}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(v => v.toLowerCase().includes(filterValue));
  }

  onFileSelected(event: Event) {
    // @ts-ignore
    this.selectedFile = event.target.files[0];
    this.selectedFileName = this.selectedFile.name;
    this.fileSelected = true;
  }

  onUpload() {
    this.videoService.uploadThumbnail(this.selectedFile, this.videoId)
      .subscribe(data => {
        console.log(data);
        // show an upload success notification
        this.matSnackBar.open("Thumbnail Upload Successful", "OK");
      })
  }

  saveVideo() {
    // Make a call to videoService to make a http call to backend
    const videoMetaData: VideoDto = {
      "id": this.videoId,
      "title": this.saveVideoDetailsForm.get('title')?.value,
      "description": this.saveVideoDetailsForm.get('description')?.value,
      "tags": this.tags,
      "videoStatus": this.saveVideoDetailsForm.get('videoStatus')?.value,
      "videoUrl": this.videoUrl,
      "thumbnailUrl": this.thumbnailUrl
    }
    this.videoService.saveVideo(videoMetaData).subscribe(data => {
      this.matSnackBar.open("Video Metadata Updated Successfully", "OK");
    })
  }
}
