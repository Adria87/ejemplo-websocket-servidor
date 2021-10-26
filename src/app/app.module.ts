import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddTutorialComponent } from './components/add-tutorial/add-tutorial.component';
import { TutorialDetailsComponent } from './components/tutorial-details/tutorial-details.component';
import { TutorialsListComponent } from './components/tutorials-list/tutorials-list.component';
import { ConfigComponent } from './components/config/config.component';
import { WebSocketComponent } from './components/websocket/websocket.component';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { ListboxModule } from 'primeng/listbox';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TradePanelComponent } from './components/binance/trade-panel/trade-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    AddTutorialComponent,
    TutorialDetailsComponent,
    TutorialsListComponent,
    ConfigComponent,
    WebSocketComponent,
    TradePanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    //Primeng
    ToastModule,
    PanelModule,
    ListboxModule,
    BrowserModule,
    CardModule,
    BrowserAnimationsModule,
  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule { }
