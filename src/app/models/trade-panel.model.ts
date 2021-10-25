import { Symbol } from "src/app/models/binance/exchange-info"

export class TradePanel {

  //Contracts
  binanceApiKey?: string;

  selectedFilterAssets?: string[];

  filteredSelectedSymbols?: Symbol[];
}
