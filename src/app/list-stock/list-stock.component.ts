import {Component, HostListener, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StockBySymbole} from "../model/stock-by-symbole.model";

@Component({
  selector: 'app-list-stock',
  templateUrl: './list-stock.component.html',
  styleUrls: ['./list-stock.component.css']
})
export class ListStockComponent implements OnInit {

  private startUrlDaily = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=';
  private endUrlDaily = '&outputsize=full&apikey=demo';

  private startUrlWeekly = 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=';
  private endUrlWeekly = '&apikey=demo';

  private listSymbole = ['IBM', 'TSCO.LON', 'IBM', 'TSCO.LON', 'IBM', 'TSCO.LON', 'IBM', 'TSCO.LON', 'IBM', 'TSCO.LON'];

  date$: any;
  nameSubject: any;
  public isDesktop = true;

  stockBySymbole: StockBySymbole[] = [];

  public finStock = false;
  public grayOut = false;
  public offStock = false;


  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getListStock();
  }

  @HostListener('window:resize', ['$event'])
  detectDevice(event: any) {
    let widthScreen = event.target.innerWidth;
    if (widthScreen <= 767) {
      this.isDesktop = false;
    } else {
      this.isDesktop = true;
    }

  }

  getListStock() {
    this.listSymbole.forEach(el => {
      // call First API
      this.http.get<any>(this.startUrlDaily + el + this.endUrlDaily).subscribe(res => {
        const tmp = {
          currentPrice: '',
          dailyHighPrice: '',
          dailylowPrice: '',
          name: '',
          weeklyHighprice: '',
          weeklylowprice: ''
        };

        this.nameSubject = Object.keys(res["Meta Data"]).map(e => res["Meta Data"][e])[1].slice(0, 4);
        this.date$ = Object.keys(res["Time Series (Daily)"]);
        let dailyData = Object.keys(res["Time Series (Daily)"]).map(e => res["Time Series (Daily)"][e]);

        tmp.name = this.nameSubject;
        tmp.currentPrice = Object.keys(dailyData[dailyData.length - 1]).map(e => dailyData[dailyData.length - 1][e])[0];
        tmp.dailyHighPrice = Object.keys(dailyData[dailyData.length - 1]).map(e => dailyData[dailyData.length - 1][e])[1];
        tmp.dailylowPrice = Object.keys(dailyData[dailyData.length - 1]).map(e => dailyData[dailyData.length - 1][e])[2];

        // call second API
        this.http.get<any>(this.startUrlWeekly + el + this.endUrlWeekly).subscribe(res1 => {
          let weeklyData = Object.keys(res1["Weekly Time Series"]).map(e => res1["Weekly Time Series"][e]).slice(0, 52);
          tmp.weeklyHighprice = Object.keys(weeklyData[weeklyData.length - 1]).map(e =>
            weeklyData[weeklyData.length - 1][e]
          )[0];
          tmp.weeklylowprice = Object.keys(weeklyData[weeklyData.length - 1]).map(e =>
            weeklyData[weeklyData.length - 1][e]
          )[1];
          this.stockBySymbole.push(tmp);
        });
      });
    });


  }

  /**
   * Check
   * @param event
   * @param item
   */
  onToggle(event : any, item: any) {
    let test = document.getElementById('ToggleswitchId') as HTMLInputElement;
    if (test.checked) {
      this.grayOut = true;
    } else {
      this.offStock = true;
    }
  }

}
