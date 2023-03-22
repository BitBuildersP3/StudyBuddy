import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'jhi-cloudinary-button',
  templateUrl: './cloudinary-button.component.html',
  styleUrls: ['./cloudinary-button.component.scss'],
})
export class CloudinaryButtonComponent implements OnInit {
  @Input() text: string | undefined;
  cloudName = 'dwxpyowvn'; // replace with your own cloud name
  uploadPreset = 'ml_default'; // replace with your own upload preset
  myWidget: any;

  constructor() {}

  ngOnInit(): void {
    // @ts-ignore
    this.myWidget = cloudinary.createUploadWidget(
      {
        cloudName: this.cloudName,
        uploadPreset: this.uploadPreset,
        // cropping: true, //add a cropping step
        // showAdvancedOptions: true,  //add advanced options (public_id and tag)
        // sources: [ "local", "url"], // restrict the upload sources to URL and local files
        // multiple: false,  //restrict upload to a single file
        // folder: "user_images", //upload files to the specified folder
        // tags: ["users", "profile"], //add the given tags to the uploaded files
        // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
        // clientAllowedFormats: ["images"], //restrict uploading to image files only
        // maxImageFileSize: 2000000,  //restrict file size to less than 2MB
        // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
        // theme: "purple", //change to a purple theme
      },
      (error: any, result: { event: string; info: { secure_url: string } }) => {
        if (!error && result && result.event === 'success') {
          console.log('Done! Here is the image info: ', result.info);
          // @ts-ignore
          window.localStorage.setItem('UploadFile', result.info.secure_url);
        }
      }
    );
  }
  openWidget() {
    this.myWidget.open();
  }
}
