import { Component, OnInit } from "@angular/core";
import { MessageService } from 'primeng/api';
import { TradePanel } from "src/app/models/trade-panel.model";
import { BinanceApiService } from "src/app/services/binance-api.service";
import { TradePanelService } from "src/app/services/trade-panel.service";
import { Symbol } from "src/app/models/binance/exchange-info"
import { mapTo } from 'rxjs/operators';
import { merge, Observable, forkJoin } from "rxjs";
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
    });

  }

  refrescarFilteredSymbols(event: any) {
    const seleccionados = event.value as string[];
    this.refrescarFilteredSymbolsArray(seleccionados);
  }

  refrescarFilteredSymbolsArray(seleccionados : string[]){
    this.filteredSymbols = this.totalAssets.filter(e => seleccionados.includes(e.baseAsset as string) || seleccionados.includes(e.quoteAsset as string));
    this.filteredSelectedSymbols = [];
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