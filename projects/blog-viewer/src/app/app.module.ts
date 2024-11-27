import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SharedLibModule } from 'shared-lib';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedLibModule,
    RouterModule.forRoot([
      { path: '', component: AppComponent }
    ])
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
