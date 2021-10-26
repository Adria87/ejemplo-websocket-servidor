import { Component, OnInit } from "@angular/core";
import { MessageService } from 'primeng/api';
import { TradePanel } from "src/app/models/trade-panel.model";
import { BinanceApiService } from "src/app/services/binance-api.service";
import { TradePanelService } from "src/app/services/trade-panel.service";
import { Symbol } from "src/app/models/binance/exchange-info"
import { mapTo } from 'rxjs/operators';
import { merge, Observable, forkJoin, Subscription } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
@Component({
  selector: 'app-trade-panel',
  templateUrl: './trade-panel.component.html',
  styleUrls: ['./trade-panel.component.css']
})
export class TradePanelComponent implements OnInit {

  tradePanel: TradePanel = {
  };

  totalAssets!: Symbol[];

  filterAssets!: string[];
  selectedFilterAssets!: string[];

  filteredSymbols: Symbol[] = [];
  filteredSelectedSymbols: Symbol[] = [];

  tickerPriceMap = new Map<String, String>();
  webSocketMap = new Map<String, Subscription>();
  // submitted = false;

  constructor(
    private tradePanelService: TradePanelService,
    private binanceApiService: BinanceApiService,
    private messageService: MessageService) { }

  APIKEY = "QxkBt5sEihEvfu7hC8r5K7oE5ZA6Q4tTCwRSa6Ow8NmLnY22DUVSg4se0fYpC1R9";
  APISECRET = "3NVdO2elR7PS4EyWpLo62oFBck2g03Wn4Gg7hXPInmngPTGokINAFGQzgbkWTvVq";

  onlyUnique(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
  }
  ngOnInit(): void {


    // first.pipe(merge(second));
    const peticion = forkJoin({
      peticionBinance: this.binanceApiService.getExchangeInfo(),
      peticionBackend: this.tradePanelService.get()
    }).subscribe(p => {
      this.totalAssets = p.peticionBinance.symbols?.sort() as Symbol[];
      const assets = p.peticionBinance.symbols?.map(s => s.baseAsset).filter(this.onlyUnique).sort();
      this.filterAssets = assets as string[];
      this.tradePanel.binanceApiKey = p.peticionBackend.binanceApiKey;
      this.selectedFilterAssets = p.peticionBackend.selectedFilterAssets as string[];
      this.refrescarFilteredSymbolsArray(this.selectedFilterAssets);
      this.filteredSelectedSymbols = p.peticionBackend.filteredSelectedSymbols as Symbol[];
      this.filteredSelectedSymbols.forEach(fss => {
        this.tickerPriceMap.set(fss.symbol!, '');
        const socket = webSocket(`wss://stream.binance.com:9443/ws/${fss.symbol?.toLowerCase()}@ticker`).subscribe(
          (msg: any) => {
            // console.log('message received: ' + JSON.stringify(msg.c))
            this.tickerPriceMap.set(fss.symbol!, msg.c);
          }, // Called whenever there is a message from the server.
          err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
          () => console.log('complete') // Called when connection is closed (for whatever reason).
        );
        this.webSocketMap.set(fss.symbol!, socket);
      });
    });

  }

  getTickerPrice(symbol: any) {
    return this.tickerPriceMap!.get(symbol) != undefined ? this.tickerPriceMap!.get(symbol)! : '';
  }

  refrescarFilteredSymbols(event: any) {
    const seleccionados = event.value as string[];
    this.refrescarFilteredSymbolsArray(seleccionados);
  }

  refrescarFilteredSymbolsArray(seleccionados : string[]){
    this.filteredSelectedSymbols.forEach(s => {
      this.webSocketMap.get(s.symbol!)?.unsubscribe();
    });
    this.filteredSymbols = this.totalAssets.filter(e => seleccionados.includes(e.baseAsset as string) || seleccionados.includes(e.quoteAsset as string));
    this.filteredSelectedSymbols = [];
    this.webSocketMap.clear();
    this.tickerPriceMap.clear();
  }

  refrescarWebSockets(event: any) {
    if (event.value.length == 0){
      this.webSocketMap.forEach(e => {
        e.unsubscribe();
      })
      this.webSocketMap.clear();
      this.tickerPriceMap.clear();
    }
    
    (event.value as Symbol[]).forEach((v: any) => {
      if (!this.webSocketMap.has(v.symbol)){
        const socket = webSocket(`wss://stream.binance.com:9443/ws/${v.symbol?.toLowerCase()}@ticker`).subscribe(
          (msg: any) => {
            // console.log('message received: ' + JSON.stringify(msg.c))
            this.tickerPriceMap.set(v.symbol!, msg.c);
          }, // Called whenever there is a message from the server.
          err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
          () => console.log('complete') // Called when connection is closed (for whatever reason).
        );
        this.webSocketMap.set(v.symbol!, socket);
      }
    });

    this.webSocketMap.forEach((element, key) => {
      if (!event.value.map((e:Symbol) => e.symbol).includes(key)){
        this.webSocketMap.get(key)?.unsubscribe();
        this.webSocketMap.delete(key);
      }
    });
  }

  saveTradePanel(): void {
    const data = {
      binanceApiKey: this.tradePanel.binanceApiKey,
      selectedFilterAssets: this.selectedFilterAssets,
      filteredSelectedSymbols: this.filteredSelectedSymbols
    };

    this.tradePanelService.update(data)
      .subscribe(
        response => {
          console.log(response);
          this.showSuccess();
          // this.submitted = true;
        },
        error => {
          console.log(error);
        });
  }


  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved correctly' });
  }

}