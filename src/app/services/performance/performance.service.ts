import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

interface PerformanceMetric {
  notificationName: string;
  notificationMessage: string;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  ctr: number;
  cvr: number;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private apiUrl = 'http://localhost:8080/api/performance';

  constructor(private http: HttpClient) {
  }

  generatePerformanceMetrics(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/generate`, {});
  }

  getPerformanceMetrics(startDate: string, endDate: string): Observable<PerformanceMetric[]> {
    return this.http.get<PerformanceMetric[]>(`${this.apiUrl}?startDate=${startDate}&endDate=${endDate}`);
  }
}
