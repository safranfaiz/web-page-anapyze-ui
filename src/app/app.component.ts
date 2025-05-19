import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnalyzeResponse } from './response.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  url: string = '';
  response: AnalyzeResponse;
  sortHead: {}
  constructor(private http: HttpClient) {}

  getData() {
    console.log("User entered url: ", this.url)
    this.response = null
    if (this.isValidUrl(this.url)) { 
      this.http.get<AnalyzeResponse>(`http://localhost:8888/api/v1/analyze?url=${this.url}`)
        .subscribe({
          next: (data) => {
            this.response = data['response'];
            this.groupByTagAlternative(this.response.headings);
          },
          error: (err) => {
            console.error('API Error:', err);
          }
        });
    }
  }

  isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

  groupByTagAlternative(arr) {
    const result = {};
    for (const item of arr) {
      if (result[item.tag]) {
        result[item.tag].push(item);
      } else {
        result[item.tag] = [item];
      }
    }
    
    this.sortHead = result;
    console.log("sortHead >>>>> ",this.sortHead)
  }

}
