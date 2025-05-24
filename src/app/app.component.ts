import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnalyzeResponse, ErrorRes } from './response.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  url: string = '';
  response: AnalyzeResponse;
  sortHead: {};
  errorRes: ErrorRes;
  error: boolean;
  loading = false;
  linkSummary = {
    total: 0,
    accessible: 0,
    inaccessible: 0,
    internal: 0,
    external: 0,
    internalAccessible: 0,
    internalInaccessible: 0,
    externalAccessible: 0,
    externalInaccessible: 0
  };

  constructor(private http: HttpClient) {}

  getData() {
    console.log("User entered url: ", this.url)
    this.response = null;
    this.errorRes = null;
    this.loading = true;
    if (this.isValidUrl(this.url)) { 
      this.http.get<AnalyzeResponse>(`http://localhost:8888/api/v1/analyze?url=${this.url}`)
        .subscribe({
          next: (data) => {
            this.loading = false;
            this.response = data['response'];
            this.updateLinkSummary();
            this.groupByTagAlternative(this.response.headings);
          },
          error: (err) => {
            console.error('API Error:', err);
            this.loading = false;
            this.error = true;
            this.errorRes = {
              status: err.status,
              message: err.error?.response?.errorMsg || err.message || 'Unknown error occurred'
            };
          }
        });
    } else {
      this.loading = false;
      this.error = true;
      this.errorRes = {
        status: 400,
        message: "Invalid URL format. Please enter a valid HTTP/HTTPS URL."
      };
    }
  }

  clear() {
    this.url = '';
    this.response = null;
    this.errorRes = null;
    this.loading = false;
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
  }

  updateLinkSummary() {
    const urls = this.response?.urls || [];

    this.linkSummary.total = urls.length;
    this.linkSummary.accessible = urls.filter(u => u.accessible).length;
    this.linkSummary.inaccessible = urls.filter(u => !u.accessible).length;
    this.linkSummary.internal = urls.filter(u => u.type === 'INTERNAL').length;
    this.linkSummary.external = urls.filter(u => u.type === 'EXTERNAL').length;
    this.linkSummary.internalAccessible = urls.filter(u => u.type === 'INTERNAL' && u.accessible).length;
    this.linkSummary.internalInaccessible = urls.filter(u => u.type === 'INTERNAL' && !u.accessible).length;
    this.linkSummary.externalAccessible = urls.filter(u => u.type === 'EXTERNAL' && u.accessible).length;
    this.linkSummary.externalInaccessible = urls.filter(u => u.type === 'EXTERNAL' && !u.accessible).length;
  }

}
