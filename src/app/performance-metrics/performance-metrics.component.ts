import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Subscription} from 'rxjs';
import {PerformanceService} from '../services/performance/performance.service';
import {PerformanceMetric} from '../modal/PerformanceMetric';
import {Alert} from "../modal/Alert";


@Component({
  selector: 'app-performance-metrics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './performance-metrics.component.html',
  styleUrls: ['./performance-metrics.component.scss']
})
export class PerformanceMetricsComponent implements OnInit, OnDestroy {
  startDate: string = '';
  endDate: string = '';
  metrics: PerformanceMetric[] = [];
  alert: Alert | null = null;
  private subscriptions: Subscription = new Subscription();

  constructor(private performanceService: PerformanceService) {
  }

  ngOnInit(): void {
    this.initializeDates();
    this.loadMetrics();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Initializes the start and end dates for the metrics query.
   * Sets the end date to today and the start date to 3 months ago.
   */
  private initializeDates(): void {
    const today = new Date();
    this.endDate = this.formatDate(today);
    this.startDate = this.formatDate(new Date(today.setMonth(today.getMonth() - 3)));
  }

  /**
   * Formats a Date object to YYYY-MM-DD string.
   * @param date The date to format
   * @returns Formatted date string
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Generates new performance metrics.
   */
  generateMetrics(): void {
    const sub = this.performanceService.generatePerformanceMetrics().subscribe({
      next: () => {
        this.showAlert('success', 'Performance metrics generated successfully');
        this.loadMetrics();
      },
      error: (error: any) => {
        console.error('Error generating metrics:', error);
        this.showAlert('danger', 'Error generating metrics. Please try again.');
      }
    });
    this.subscriptions.add(sub);
  }

  /**
   * Loads performance metrics for the selected date range.
   */
  loadMetrics(): void {
    if (this.startDate && this.endDate) {
      const sub = this.performanceService.getPerformanceMetrics(this.startDate, this.endDate).subscribe({
        next: (data: any) => {
          this.metrics = data;
          if (data.length === 0) {
            this.showAlert('info', 'No metrics found for the selected date range.');
          }
        },
        error: (error: any) => {
          console.error('Error loading metrics:', error);
          this.showAlert('danger', 'Error loading metrics. Please try again.');
        }
      });
      this.subscriptions.add(sub);
    } else {
      this.showAlert('warning', 'Please select both start and end dates');
    }
  }

  /**
   * Displays an alert message to the user.
   * @param type The type of alert (success, danger, info, warning)
   * @param message The message to display
   */
  private showAlert(type: string, message: string): void {
    this.alert = {type, message};
    setTimeout(() => this.closeAlert(), 5000); // Auto close after 5 seconds
  }

  /**
   * Closes the current alert.
   */
  closeAlert(): void {
    this.alert = null;
  }
}
