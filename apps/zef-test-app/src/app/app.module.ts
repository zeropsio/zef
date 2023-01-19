import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ZefAvatarModule } from '@zerops/zef'
import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [BrowserModule, ZefAvatarModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
