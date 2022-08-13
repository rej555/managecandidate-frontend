import {Component, OnInit} from '@angular/core';
import {Candidat} from './Candidateur';
import {HttpErrorResponse} from '@angular/common/http';
import {CandidatService} from './Candidat.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public candidats?:Candidat[];
  public delineates?:Candidat;
   name:string ="";
   prenom:string="";
   email:string="";
   phone:string="";
   nivetude:string="";
   nmbrexp: number=0;
   derempleure:string="";
  info: any = true;
  CV: any = false;
  file: any;
  // @ts-ignore
  public selectedFile: File;
  step: number = 1;
  piece: any = false;
  constructor(private candidatService:CandidatService) {

  }
    ngOnInit() {
    this.getCandidat();};

  public getCandidat(): void {
    this.candidatService.getCandidat().subscribe((response: Candidat[])=>{
        this.candidats = response;
        },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
   public onDeletcandidat(candidatID:number,candidatname:string):void{
      this.candidatService.deletCandidats(candidatID).subscribe(response=>{
          this.getCandidat();
          alert(` voulez-vous effacer la candidature de ${candidatname} ? `)
        },
        (error: HttpErrorResponse) => {
                 alert(error.message);
        }
      );
   }

   public onOpenModal(candidat: Candidat , mode:string):void{
     this.getCandidat();
    this.step = 1;
    const container=document.getElementById('main-container');
    const button =document.createElement('button');
    button.type='button';
    button.style.display='none';
    button.setAttribute('data-toggle','modal');
    if (mode==='add'){
      this.name ="";
      this.prenom="";
      this.email="";
      this.phone="";
      this.nivetude="";
      this.nmbrexp=0;
      this.derempleure="";
      this.getCandidat()
      button.setAttribute('data-target','#addCandidatModal');
    }
    container?.appendChild(button);
     button.click();
   }

 onFileChanged(event: any): any {
   // tslint:disable-next-line:no-console
   console.log( event.target.files)
    if (event.target.files.length > 0) {
      this.file = undefined;
      this.selectedFile = event.target.files[0];
        // tslint:disable-next-line:no-console
      console.log( this.selectedFile)
    }
  }
  suivant() {
     this.step = 2;

  }
  suivant2() {
    this.step = 3;

     // tslint:disable-next-line:no-console

  }
  precedent() {
    this.step = 1;
  }
  public onAddCandidat(addForm:NgForm):void{
    addForm.value.name = this.name;
    addForm.value.prenom = this.prenom;
    addForm.value.email = this.email;
    addForm.value.phone = this.phone;
    addForm.value.nivetude = this.nivetude;
    addForm.value.nmbrexp = this.nmbrexp;
    addForm.value.derempleure = this.derempleure;
    this.candidatService.addCandidat(addForm.value).subscribe((response: Candidat)=>{
          this.getCandidat();
        if (this.selectedFile){
          this.candidatService.postCV(this.selectedFile, response.id)
            // tslint:disable-next-line:no-shadowed-variable
            .subscribe(response => {
              // tslint:disable-next-line:no-console
              // @ts-ignore
              this.selectedFile = undefined;
              // @ts-ignore
              if (response === 1) {
                alert('Image uploaded successfully');
              } else {
                alert('Image not uploaded successfully');
              }       });}
 },
      (error:HttpErrorResponse)=>{alert(error.message)
      ;}
    )

  }
  public getImage(id: any){
    // tslint:disable-next-line:no-console
    console.log(id);
    this.piece = true;
    this.candidatService.getCandidatImage(id)
      .subscribe(
        res => {
          if(res.length > 0){
            this.file = res;
          }
          else{
            this.file = undefined;
          }
        }
      );
  }
}

