import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EnrollmentComponent } from './enrollment.component';
import { LongPressDirective } from '../../directives/long-press.directive';

@NgModule({
  declarations: [
    EnrollmentComponent,
    LongPressDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [
    EnrollmentComponent
  ]
})
export class EnrollmentModule { }
