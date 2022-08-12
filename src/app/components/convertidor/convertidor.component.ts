import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-convertidor',
  templateUrl: './convertidor.component.html',
  styleUrls: ['./convertidor.component.css'],
})
export class ConvertidorComponent implements OnInit {
  amount: number = 0;
  have: string = 'USD';
  need: string = 'EUR';
  total: number = 0;
  currencies = {    
    ARS: 134.266499,
    AED: 3.673015,
    AUD: 1.407856,
    BRL: 5.158499,
    CAD: 1.275815,
    CHF: 0.94147,
    CLP: 883.779768,
    CNY: 6.744698,
    COP: 4233,
    CZK: 23.588,
    DKK: 7.212005,
    EUR: 0.96945,
    GBP: 0.819798,
    HKD: 7.843902,
    HUF: 382.782985,
    IDR: 14716.6,
    ILS: 3.233375,
    INR: 79.566603,
    JPY: 133.080498,
    KRW: 1305.914974,
    MXN: 19.9577,
    MYR: 4.444991,
    NOK: 9.52577,
    NZD: 1.55566,
    PHP: 55.3945,
    PLN: 4.538905,
    RON: 4.750902,
    RUB: 60.624969,
    SAR: 3.756223,
    SEK: 10.064295,
    SGD: 1.370495,
    THB: 35.197771,
    TRY: 17.948979,
    TWD: 29.990803,
    USD: 1,
    UYU: 40.05,
    ZAR: 16.23625,
  };

  data = [...Object.entries(this.currencies)];
  

  constructor() { }

  ngOnInit(): void {
    this.UpdateCurrencies()
  }
  
//Gets today date and updates the date input accordingly.
currentDate() :string {
  var currentDate = {
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString(),
    date: new Date().getDate().toString(),
  };
  if (parseInt(currentDate.month) < 10) currentDate.month = "0" + currentDate.month;
  if (parseInt(currentDate.date) < 10) currentDate.date = "0" + currentDate.date;
  return currentDate.year + "-" + currentDate.month + "-" + currentDate.date;
}

  UpdateCurrencies() {
    let cacheDate = localStorage.getItem("currenciesLastUpdated");
    
    if (cacheDate !== null && this.currentDate() === JSON.parse(cacheDate)){
      console.log("currencies are already updated for this date")

    }
    else {
      console.log("Last update was on " + cacheDate + ". Currency values are being updated, please wait")
      var myHeaders = new Headers();
      myHeaders.append("apikey", "Mc8Sw1VuJQJ2R8uFetK2ppOrYjF1tDpQ");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders
      };

      fetch("https://api.apilayer.com/exchangerates_data/latest?symbols=ARS%2CUYU%2CUSD%2C%20EUR%2C%20JPY%2C%20GBP%2C%20AUD%2C%20CAD%2C%20CHF%2C%20CNY%2C%20HKD%2C%20NZD%2C%20SEK%2C%20KRW%2C%20SGD%2C%20NOK%2C%20MXN%2C%20INR%2C%20RUB%2C%20ZAR%2C%20TRY%2C%20BRL%2C%20TWD%2C%20DKK%2C%20PLN%2C%20THB%2C%20IDR%2C%20HUF%2C%20CZK%2C%20ILS%2C%20CLP%2C%20PHP%2C%20AED%2C%20COP%2C%20SAR%2C%20MYR%2C%20RON&base=USD", requestOptions)
        .then(response => response.json())
        .then(result => {
          this.currencies = result.rates

          localStorage.setItem('currenciesLastUpdated', JSON.stringify(result.date))

        })
        .catch(error => console.log('error', error));
    }
  }

  convertir(): void {
    if (this.amount === 0 || !this.amount) {

    }
    else if (this.have === this.need) {
      
      this.total = this.amount;
    } else {
      switch (this.have) {
        case 'USD':
          
          this.total = parseFloat(
            (this.amount * this.findCurrency(this.need)).toFixed(2)
          );
          break;
        default:
          
          this.total = parseFloat((this.amount / this.findCurrency(this.have) * this.findCurrency(this.need)).toFixed(2));
          break;
      }
    }
  }

  findCurrency(selectedCurrency: string): number {
    for (let currency of this.data) {
      if (currency[0] === selectedCurrency) {
       
        return currency[1];
      }
    }
    
    return 0;
  }

  switchCurrencies() {
    
    let placeholder = this.have;
    this.have = this.need;
    this.need = placeholder;
    this.convertir();
  }
}
