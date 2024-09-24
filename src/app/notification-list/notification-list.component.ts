import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Subscription} from 'rxjs';
import {NotificationService} from '../services/notifications/notification.service';
import {Notification} from '../modal/Notification';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notification-list.component.html'
})
export class NotificationListComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  currentNotification: Notification = {
    id: 0,
    name: '',
    message: '',
    creationDate: '',
    lastModificationDate: ''
  };
  isEditing = false;
  private subscriptions: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Submits the current notification (create or update).
   */
  submitNotification(): void {
    const operation = this.isEditing ? this.updateNotification() : this.createNotification();
    const sub = operation.subscribe({
      next: () => {

        this.resetForm();
      },
      error: (error: any) => console.error(`Error ${this.isEditing ? 'updating' : 'creating'} notification:`, error)
    });
    this.subscriptions.add(sub);
  }

  /**
   * Updates an existing notification.
   */
  private updateNotification() {
    return this.notificationService.updateNotification(this.currentNotification.id!, this.currentNotification);
  }

  /**
   * Creates a new notification.
   */
  private createNotification() {
    return this.notificationService.createNotification(this.currentNotification);
  }

  /**
   * Sets up the form for editing an existing notification.
   * @param notification The notification to edit
   */
  editNotification(notification: Notification): void {
    this.currentNotification = {...notification};
    this.isEditing = true;
  }

  /**
   * Deletes a notification after confirmation.
   * @param notification The notification to delete
   */
  deleteNotification(notification: Notification): void {
    if (notification.id && confirm('Are you sure you want to delete this notification?')) {
      const sub = this.notificationService.deleteNotification(notification.id).subscribe({
        error: (error: any) => console.error('Error deleting notification:', error)
      });
      this.subscriptions.add(sub);
    }
  }

  /**
   * Cancels the current edit operation.
   */
  cancelEdit(): void {
    this.resetForm();
  }

  /**
   * Resets the form to its initial state.
   */
  private resetForm(): void {
    this.currentNotification = {
      id: 0,
      name: '',
      message: '',
      creationDate: '',
      lastModificationDate: ''
    };
    this.isEditing = false;
  }
}
