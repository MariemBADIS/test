import {Component, OnInit} from '@angular/core';
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

  private listSymbole = ['IBM', 'TSCO.LON', 'SHOP.TRT', 'GPV.TRV'];


  date$: any;
  date1$: any;
  dateDaily$: any;
  nameSubject: any;
  nameSubject1: any;

  public isDesktop = true;


  arr = [];

  stockBySymbole: StockBySymbole[] = [];

/*  objectifStock: {
    currentPrice: string;
    dailyHighPrice: string
  }[] = [];*/

  listValueDaily = {
    currentPrice: '',
    dailyHighPrice: '',
    dailylowprice: ''
  };


  public test = {};


  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getListStock();
    this.detectDevice();
  }

  detectDevice() {
    // Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
    if (window.innerWidth <= 767) {
      this.isDesktop = false;
    } else {
      this.isDesktop = true;
    }

  }

  getListStock() {
    this.listSymbole.forEach(el => {
      this.http.get<any>(this.startUrlDaily + el + this.endUrlDaily).subscribe(res => {
        // console.log('res ', res);

        this.nameSubject = Object.keys(res["Meta Data"]).map(e => res["Meta Data"][e])[1].slice(0, 4);
        // console.log('nameSubject ', this.nameSubject);

        this.date$ = Object.keys(res["Time Series (Daily)"]);
        // console.log('data tt 1', this.date$);

        let dateSorted = this.date$.reverse();
        // console.log('dateSorted tt 2', dateSorted);

        let dailyData = Object.keys(res["Time Series (Daily)"]).map(e => res["Time Series (Daily)"][e]);
        // console.log('t3 ', dailyData);

        this.listValueDaily.currentPrice = Object.keys(dailyData[dailyData.length - 1]).map(e => dailyData[dailyData.length - 1][e])[0];
        this.listValueDaily.dailyHighPrice = Object.keys(dailyData[dailyData.length - 1]).map(e => dailyData[dailyData.length - 1][e])[1];
        console.log('listt ', this.listValueDaily);




      });
      this.stockBySymbole.push(this.listValueDaily);
      console.log('this.arr ', this.stockBySymbole);

/*
      this.http.get<any>(this.startUrlWeekly + el + this.endUrlWeekly).subscribe(res => {
              console.log('res ', res);

              this.nameSubject1 = Object.keys(res["Meta Data"]).map(e => res["Meta Data"][e])[1].slice(0, 4);
              // console.log('nameSubject ', this.nameSubject);

              this.date1$ = Object.keys(res["Weekly Time Series"]);
              // console.log('data tt 1', this.date$);

            });*/
    });



  }

}
