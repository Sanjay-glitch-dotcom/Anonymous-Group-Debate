import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-debate-timer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timer-container" [ngClass]="{'timer-expired': isExpired, 'timer-warning': timeLeft <= 60}">
      <div class="timer-header">
        <h3>⏰ Debate Timer</h3>
        <span class="timer-status" [ngClass]="statusClass">{{ statusText }}</span>
      </div>
      
      <div class="timer-display">
        <div class="time-remaining">
          <span class="time-value">{{ formatTime(timeLeft) }}</span>
          <span class="time-label">remaining</span>
        </div>
        
        <div class="timer-progress">
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="progressPercentage"></div>
          </div>
        </div>
      </div>
      
      <div class="timer-info">
        <p *ngIf="!isExpired && timeLeft > 0" class="timer-message">
          <span *ngIf="timeLeft > 60">🟢 Debate is active</span>
          <span *ngIf="timeLeft <= 60 && timeLeft > 30">🟡 Debate closing soon</span>
          <span *ngIf="timeLeft <= 30">🔴 Final moments!</span>
        </p>
        <p *ngIf="isExpired" class="timer-message expired">
          ⏰ Time's up! This debate has been automatically closed.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .timer-container {
      background: linear-gradient(135deg, var(--bg-color) 0%, var(--border-color) 100%);
      border: 2px solid var(--border-color);
      border-radius: 0.75rem;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      transition: all 0.3s ease;
    }

    .timer-container.timer-warning {
      background: linear-gradient(135deg, var(--badge-closed-bg) 0%, var(--badge-closed-bg) 100%);
      border-color: var(--badge-closed-text);
      animation: pulse-warning 2s infinite;
    }

    .timer-container.timer-expired {
      background: linear-gradient(135deg, var(--danger-color) 0%, var(--badge-closed-text) 100%);
      border-color: var(--danger-color);
    }

    @keyframes pulse-warning {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }

    .timer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .timer-header h3 {
      margin: 0;
      color: var(--heading-color);
      font-size: 1.25rem;
      font-weight: 600;
    }

    .timer-status {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .timer-status.active {
      background: var(--badge-open-bg);
      color: var(--badge-open-text);
    }

    .timer-status.warning {
      background: var(--badge-closed-bg);
      color: var(--badge-closed-text);
    }

    .timer-status.expired {
      background: var(--danger-color);
      color: var(--danger-hover);
    }

    .timer-display {
      text-align: center;
      margin-bottom: 1rem;
    }

    .time-remaining {
      margin-bottom: 1rem;
    }

    .time-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--heading-color);
      font-family: 'Courier New', monospace;
    }

    .timer-warning .time-value {
      color: var(--badge-closed-text);
    }

    .timer-expired .time-value {
      color: var(--danger-hover);
    }

    .time-label {
      display: block;
      font-size: 0.875rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    .timer-progress {
      width: 100%;
      margin-bottom: 1rem;
    }

    .progress-bar {
      width: 100%;
      height: 0.5rem;
      background: var(--border-color);
      border-radius: 0.25rem;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--badge-open-text) 0%, var(--badge-open-bg) 100%);
      transition: width 1s ease;
      border-radius: 0.25rem;
    }

    .timer-warning .progress-fill {
      background: linear-gradient(90deg, var(--badge-closed-text) 0%, var(--badge-closed-text) 100%);
    }

    .timer-expired .progress-fill {
      background: linear-gradient(90deg, var(--danger-color) 0%, var(--danger-hover) 100%);
      width: 0% !important;
    }

    .timer-info {
      text-align: center;
    }

    .timer-message {
      margin: 0;
      font-weight: 500;
      color: var(--heading-h3);
    }

    .timer-message.expired {
      color: var(--danger-hover);
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .timer-container {
        padding: 1rem;
      }
      
      .time-value {
        font-size: 2rem;
      }
      
      .timer-header {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
      }
    }
  `]
})
export class DebateTimerComponent implements OnInit, OnDestroy {
  @Input() autoCloseAt!: Date;
  @Input() status!: string;
  @Output() timerExpired = new EventEmitter<void>();

  timeLeft = 0;
  isExpired = false;
  private interval: any;
  private readonly TOTAL_TIME = 15 * 60;

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private startTimer() {
    this.updateTimeLeft();

    this.interval = setInterval(() => {
      this.updateTimeLeft();

      if (this.timeLeft <= 0 && !this.isExpired) {
        this.isExpired = true;
        this.timerExpired.emit();
        clearInterval(this.interval);
      }
    }, 1000);
  }

  private updateTimeLeft() {
    if (this.status === 'closed') {
      this.timeLeft = 0;
      this.isExpired = true;
      return;
    }

    const now = new Date().getTime();
    const endTime = new Date(this.autoCloseAt).getTime();
    const difference = endTime - now;

    this.timeLeft = Math.max(0, Math.floor(difference / 1000));
    this.isExpired = this.timeLeft <= 0;
  }

  formatTime(seconds: number): string {
    if (seconds <= 0) return '0:00';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  get progressPercentage(): number {
    if (this.isExpired) return 0;
    return Math.max(0, (this.timeLeft / this.TOTAL_TIME) * 100);
  }

  get statusText(): string {
    if (this.status === 'closed') return 'Closed';
    if (this.isExpired) return 'Expired';
    if (this.timeLeft <= 30) return 'Final Moments';
    if (this.timeLeft <= 60) return 'Closing Soon';
    return 'Active';
  }

  get statusClass(): string {
    if (this.status === 'closed' || this.isExpired) return 'expired';
    if (this.timeLeft <= 60) return 'warning';
    return 'active';
  }
}
