import { Component, HostListener, OnInit } from "@angular/core";
import { MessageService } from 'primeng/api';
import { Observable, of, pipe, Subject } from "rxjs";
import { webSocket } from "rxjs/webSocket";

export class Posicion {
  x: number = 0;
  y: number = 0;
  class: string = 'empty';
}

@Component({
  selector: 'app-websocket',
  templateUrl: './websocket.component.html',
  styleUrls: ['./websocket.component.css']
})
export class WebSocketComponent implements OnInit {


  // submitted = false;

  bnbPrice: string = "0";
  public posicionamiento = new Subject<string>();
  clase;
  size = 40;
  public matrix: Posicion[][] = [];
  constructor(
    private messageService: MessageService) {
    this.clase = MyClass;
  }

  // public getPosicion(): Observable<Posicion> {
  //   Observable.create(observer => {
  //     observer.next(this._heroes);
  //     observer.complete();
  // });
  // }

  ngOnInit(): void {

    this.posicionWS.onmessage = function (str) {
      socket_onmessage_callback(str.data);
    };

    this.matrix = MyClass.repintarMatriz(this.size);

    of(MyClass.posicion).subscribe(p => console.debug(p));
  }

  // subject = webSocket("wss://stream.binance.com:9443/ws/bnbusdt@aggTrade");
  // subject = webSocket("wss://stream.binance.com:9443/ws/bnbusdt@kline_15m");
  // subject = webSocket("wss://stream.binance.com:9443/aws/bnbusdt@ticker");

  posicionWS = new WebSocket("ws://localhost:8999/posicion");
  subject = webSocket("ws://localhost:8999/posicion");

  connectToWebSocket(): void {
    this.subject.subscribe(
      (msg: any) => {
        console.log('message received: ' + JSON.stringify(msg))
        // this.posicionJugador = msg;
      }, // Called whenever there is a message from the server.
      err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      () => console.log('complete') // Called when connection is closed (for whatever reason).
    )
    // this.subject.subscribe(
    //   (msg: any) => {
    //     // console.log('message received: ' + JSON.stringify(msg.c))
    //     this.bnbPrice = msg.c;
    //   }, // Called whenever there is a message from the server.
    //   err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
    //   () => console.log('complete') // Called when connection is closed (for whatever reason).
    // );
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'a' || event.key === '4') {
      this.posicionWS.send('x:-1');
    }
    if (event.key === 'd' || event.key === '6') {
      this.posicionWS.send('x:1');
    }
    if (event.key === 's' || event.key === '5') {
      this.posicionWS.send('y:-1');
    }
    if (event.key === 'w' || event.key === '8') {
      this.posicionWS.send('y:1');
    }
    this.matrix = MyClass.repintarMatriz(this.size);
  }

  close(): void {
    console.debug('desconectado');
    // this.subject.unsubscribe();
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved correctly' });
  }


}

export function socket_onmessage_callback(arg0: any) {
  window.localStorage.setItem('posicion', arg0);
  MyClass.posicion = JSON.parse(arg0);
}

export abstract class MyClass {
  // public static posicion = { x: 0, y: 0 };
  // public static posicion = { x: 0, y: 0 };
  static _posicion: Posicion;
  static matriz: Posicion[][];
  static size = 10;
  public static set posicion(v: Posicion) {
    this._posicion = v;
    MyClass.repintarMatriz(this.size);
  }

  public static get posicion(): Posicion {
    return this._posicion;
  }

  constructor() {
  }

  public static repintarMatriz(size: number): Posicion[][] {
    var matriz = []
    for (let i = 1; i <= size; i++) {
      var row: Posicion[] = [];
      for (let j = 1; j <= size; j++) {
        const clase = this.posicion && this.posicion.x === i && this.posicion.y === j ? 'selected' : 'empty';
        row.push(
          {
            x: i, y: j, class: clase
          });
      }
      matriz.push(row)
    }
    this.matriz = matriz;
    return matriz;
  }
}


