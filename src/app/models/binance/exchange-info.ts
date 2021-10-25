export class ExchangeInfo {
    timezone?: string;
    serverTime?: number;
    symbols?: Symbol[];
}

export class Symbol {
    symbol?: string;
    baseAsset?: string;
    quoteAsset?: string;
}