import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DebatesService } from '../services/debates.service';
import { AuthService } from '../services/auth.service';
import { DebateTimerComponent } from '../components/debate-timer.component';

@Component({
  standalone: true,
  selector: 'app-debate-detail',
  imports: [CommonModule, FormsModule, RouterLink, DebateTimerComponent],
  template: `
    <div class="container">
      <div class="debate-detail" *ngIf="debate; else loading">
        <!-- Header -->
        <div class="debate-header">
          <div class="breadcrumb">
            <a routerLink="/">Home</a>
            <span class="separator">›</span>
            <span>Debate Details</span>
          </div>
          
          <div class="debate-meta">
            <h1 class="debate-title">{{ debate.title }}</h1>
            <div class="meta-info">
              <span class="badge" [ngClass]="getBadgeClass(debate.status)">
                {{ debate.status }}
              </span>
              <span class="meta-item">
                Created {{ formatDate(debate.createdAt) }}
              </span>
              <span class="meta-item" *ngIf="debate.closedAt">
                Closed {{ formatDate(debate.closedAt) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Timer and Controls -->
        <div *ngIf="debate.status === 'open' && debate.autoCloseAt">
          <app-debate-timer 
            [autoCloseAt]="debate.autoCloseAt" 
            [status]="debate.status"
            (timerExpired)="onTimerExpired()">
          </app-debate-timer>
          
          <!-- End Debate Button (only for creator) -->
          <div class="debate-controls" *ngIf="isDebateCreator()">
            <button 
              (click)="endDebate()" 
              class="btn btn-danger"
              [disabled]="isClosingDebate">
              <span *ngIf="!isClosingDebate">🔚 End Debate Now</span>
              <span *ngIf="isClosingDebate">Closing...</span>
            </button>
            <p class="control-hint">As the creator, you can end this debate early</p>
          </div>
        </div>

        <!-- Closed Status -->
        <div *ngIf="debate.status === 'closed'" class="debate-closed-notice">
          <div class="closed-banner">
            <h3>🔒 Debate Closed</h3>
            <p *ngIf="debate.closedBy === 'timer'">This debate was automatically closed after 3 minutes.</p>
            <p *ngIf="debate.closedBy === 'manual'">This debate was manually closed by the creator.</p>
            <p *ngIf="!debate.closedBy">This debate has been closed.</p>
            <span class="closed-date">Closed on {{ formatDate(debate.closedAt) }}</span>
          </div>
        </div>

        <!-- Description -->
        <div class="debate-description card">
          <h3>About This Debate</h3>
          <p>{{ debate.description }}</p>
        </div>

        <!-- Stats -->
        <div class="debate-stats">
          <div class="stat-item">
            <div class="stat-number">{{ replies.length }}</div>
            <div class="stat-label">Replies</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ getTotalVotes() }}</div>
            <div class="stat-label">Votes</div>
          </div>
          <div class="stat-item" *ngIf="tally">
            <div class="stat-number">{{ getVotePercentage() }}%</div>
            <div class="stat-label">Approval</div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="content-grid">
          <!-- Replies Section -->
          <section class="replies-section">
            <div class="section-header">
              <h3>Discussion ({{ replies.length }})</h3>
            </div>
            
            <div class="replies-container">
              <div class="reply-item" *ngFor="let reply of replies; trackBy: trackByReply">
                <div class="reply-avatar">
                  <div class="avatar-circle">{{ getInitials(reply.author) }}</div>
                </div>
                <div class="reply-content">
                  <div class="reply-header">
                    <span class="reply-author">{{ reply.author || 'Anonymous' }}</span>
                    <button *ngIf="reply.canDelete" class="btn btn-sm" (click)="editReply(reply)">Edit</button>
<button *ngIf="reply.canDelete" class="btn btn-sm" (click)="deleteReply(reply._id)">Delete</button>
                    <span class="reply-date">{{ formatDate(reply.createdAt) }}</span>
                  </div>
                  <div class="reply-text">{{ reply.content }}</div>
                </div>
              </div>

              <div class="empty-state" *ngIf="replies.length === 0">
                <h4>No replies yet</h4>
                <p>Be the first to share your thoughts on this debate!</p>
              </div>
            </div>

            <!-- Reply Form -->
            <div class="reply-form-container" *ngIf="debate.status === 'open'">
              <form (ngSubmit)="addReply()" #replyForm="ngForm" class="reply-form">
                <div class="form-group">
                  <label for="reply" class="form-label">Add Your Reply</label>
                  <textarea 
                    id="reply"
                    class="form-textarea"
                    [(ngModel)]="reply" 
                    name="reply" 
                    rows="4"
                    placeholder="Share your thoughts on this debate..."
                    required
                    #replyInput="ngModel"
                  ></textarea>
                  <div *ngIf="replyInput.invalid && replyInput.touched" class="form-error">
                    Reply content is required
                  </div>
                </div>
                <div class="form-actions">
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    [disabled]="replyForm.invalid || isSubmittingReply"
                  >
                    <span *ngIf="isSubmittingReply">Posting...</span>
                    <span *ngIf="!isSubmittingReply">Post Reply</span>
                  </button>
                </div>
                <div *ngIf="replyNotice" class="alert alert-error">
                  {{ replyNotice }}
                </div>
              </form>
            </div>

            <div class="debate-closed-notice" *ngIf="debate.status !== 'open'">
              <p>This debate is closed. No new replies can be added.</p>
            </div>
          </section>

          <!-- Sidebar -->
          <aside class="sidebar">
            <!-- Voting Section -->
            <div class="voting-section card">
              <h3>Community Vote</h3>
              <div *ngIf="debate.status === 'closed'">
                <div class="voting-buttons">
                  <button 
                    class="vote-btn vote-up" 
                    (click)="vote('up')"
                    [class.voted]="userVote === 'up'"
                  >
                    👍 Support
                  </button>
                  <button 
                    class="vote-btn vote-down" 
                    (click)="vote('down')"
                    [class.voted]="userVote === 'down'"
                  >
                    👎 Oppose
                  </button>
                </div>
                <div class="vote-results" *ngIf="tally">
                  <div class="vote-bar">
                    <div class="vote-bar-fill" [style.width.%]="getVotePercentage()"></div>
                  </div>
                  <div class="vote-counts">
                    <span>{{ tally.up }} Support</span>
                    <span>{{ tally.down }} Oppose</span>
                  </div>
                </div>
              </div>
              <div class="voting-disabled" *ngIf="debate.status !== 'closed'">
                <p>Voting will be available once this debate is closed.</p>
              </div>
            </div>

            <!-- Summary Section -->
            <div class="summary-section card">
              <h3>AI Summary</h3>
              <div *ngIf="debate.status === 'closed'">
                <button 
                  class="btn btn-primary btn-full" 
                  (click)="generateSummary()"
                  [disabled]="isGeneratingSummary"
                  *ngIf="!summary"
                >
                  <span *ngIf="isGeneratingSummary">Generating...</span>
                  <span *ngIf="!isGeneratingSummary">Generate Summary</span>
                </button>
                <div class="summary-content" *ngIf="summary">
                  <p>{{ summary }}</p>
                  <button 
                    class="btn btn-primary btn-sm" 
                    (click)="regenerateSummary()"
                    [disabled]="isGeneratingSummary"
                  >
                    <span *ngIf="isGeneratingSummary">Regenerating...</span>
                    <span *ngIf="!isGeneratingSummary">Regenerate</span>
                  </button>
                </div>
              </div>
              <div class="summary-disabled" *ngIf="debate.status !== 'closed'">
                <p>AI summary will be available once this debate is closed.</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="actions-section card" *ngIf="canManageDebate()">
              <h3>Manage Debate</h3>
              <button 
                class="btn btn-danger btn-full" 
                (click)="closeDebate()"
                *ngIf="debate.status === 'open'"
              >
                Close Debate
              </button>
              <button 
                class="btn btn-danger btn-full" 
                (click)="deleteDebate()"
                *ngIf="debate.status === 'closed'"
              >
                Delete Debate
              </button>
            </div>
          </aside>
        </div>
      </div>

      <ng-template #loading>
        <div class="loading-state">
          <h2>Loading debate...</h2>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .debate-detail {
      max-width: 1200px;
      margin: 0 auto;
    }

    .breadcrumb {
      margin-bottom: 1rem;
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .breadcrumb a {
      color: var(--primary-color);
      text-decoration: none;
    }

    .separator {
      margin: 0 0.5rem;
    }

    .debate-header {
      margin-bottom: 2rem;
    }

    .debate-title {
      margin-bottom: 1rem;
      font-size: 2.5rem;
      line-height: 1.2;
    }

    .meta-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .meta-item {
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    .debate-description {
      margin-bottom: 2rem;
    }

    .debate-description h3 {
      margin-bottom: 1rem;
      color: var(--heading-color);
    }

    .debate-description p {
      color: var(--text-muted);
      line-height: 1.6;
      font-size: 1.125rem;
    }

    .debate-stats {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
      justify-content: center;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 0.25rem;
    }

    .stat-label {
      color: var(--text-muted);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }

    .section-header {
      margin-bottom: 1.5rem;
    }

    .section-header h3 {
      margin: 0;
      color: var(--heading-color);
    }

    .replies-container {
      margin-bottom: 2rem;
    }

    .reply-item {
      display: flex;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--surface-color);
      border-radius: 0.75rem;
      margin-bottom: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border-color);
    }

    .reply-avatar {
      flex-shrink: 0;
    }

    .avatar-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
      color: var(--surface-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .reply-content {
      flex: 1;
    }

    .reply-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .reply-author {
      font-weight: 600;
      color: var(--heading-color);
    }

    .reply-date {
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    .reply-text {
      color: var(--text-gray-700);
      line-height: 1.5;
    }

    .reply-form-container {
      background: var(--surface-color);
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border-color);
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: var(--text-gray-700);
    }

    .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid var(--border-color);
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
      background-color: var(--surface-color);
      resize: vertical;
    }

    .form-textarea:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .voting-section,
    .summary-section,
    .actions-section {
      padding: 1.5rem;
    }

    .voting-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .vote-btn {
      padding: 0.75rem 1rem;
      border: 2px solid var(--border-color);
      border-radius: 0.5rem;
      background: var(--surface-color);
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .vote-btn:hover {
      border-color: var(--primary-color);
      background: var(--bg-color);
    }

    .vote-btn.voted {
      border-color: var(--primary-color);
      background: var(--badge-completed-bg);
      color: var(--badge-completed-text);
    }

    .vote-bar {
      height: 8px;
      background: var(--border-color);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .vote-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--badge-open-text), var(--badge-open-bg));
      transition: width 0.3s ease;
    }

    .vote-counts {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .summary-content {
      background: var(--bg-color);
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .summary-content p {
      margin: 0;
      line-height: 1.5;
      color: var(--text-gray-700);
    }

    .btn-full {
      width: 100%;
    }

    .btn-sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--text-muted);
    }

    .empty-state h4 {
      margin-bottom: 0.5rem;
      color: var(--text-gray-700);
    }

    .debate-closed-notice {
      background: var(--badge-closed-bg);
      color: var(--badge-closed-text);
      padding: 1rem;
      border-radius: 0.5rem;
      text-align: center;
      border: 1px solid var(--badge-closed-bg);
    }

    .voting-disabled,
    .summary-disabled {
      text-align: center;
      color: var(--text-muted);
      font-style: italic;
    }

    .loading-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-muted);
    }

    .alert {
      padding: 1rem;
      border-radius: 0.5rem;
      margin-top: 1rem;
    }

    .alert-error {
      background-color: var(--badge-closed-bg);
      color: var(--danger-hover);
      border: 1px solid var(--badge-closed-text);
    }

    .form-error {
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: var(--danger-color);
    }

    @media (max-width: 768px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
      
      .debate-title {
        font-size: 2rem;
      }
      
      .debate-stats {
        gap: 1rem;
      }
      
      .reply-item {
        padding: 1rem;
      }
    }

    /* Timer and Controls Styles */
    .debate-controls {
      text-align: center;
      margin-top: 1rem;
      padding: 1.5rem;
      background: var(--bg-color);
      border-radius: 0.5rem;
      border: 1px solid var(--border-color);
    }

    .btn-danger {
      background: linear-gradient(135deg, var(--danger-color) 0%, var(--danger-hover) 100%);
      color: var(--surface-color);
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 1rem;
    }

    .btn-danger:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--danger-hover) 0%, var(--danger-color) 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    .btn-danger:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .btn-close {
      background: linear-gradient(135deg, var(--danger-hover) 0%, var(--danger-color) 100%);
      color: var(--surface-color);
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }

    .btn-close:hover {
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
      transform: translateY(-1px);
    }

    .btn-close:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .topic-card.closed {
      border: 2px solid var(--danger-hover);
    }

    .topic-meta {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border-color);
    }

    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .meta-label {
      font-size: 0.875rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .meta-value {
      font-weight: 600;
      color: var(--heading-color);
    }

    .meta-value.closed-text {
      color: var(--danger-hover);
    }

    .control-hint {
      margin: 0.5rem 0 0;
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .debate-closed-notice {
      margin-bottom: 1.5rem;
    }

    .closed-banner {
      background: linear-gradient(135deg, var(--danger-color) 0%, var(--badge-closed-text) 100%);
      border: 2px solid var(--danger-hover);
      border-radius: 0.75rem;
      padding: 1.5rem;
      text-align: center;
    }

    .closed-banner h3 {
      margin: 0 0 0.5rem;
      color: var(--danger-hover);
      font-size: 1.25rem;
    }

    .closed-banner p {
      margin: 0.5rem 0;
      color: #7f1d1d;
    }

    .closed-date {
      display: block;
      margin-top: 1rem;
      font-size: 0.875rem;
      color: var(--danger-hover);
      font-weight: 500;
    }

    .user-greeting {
      margin-right: 1rem;
      color: var(--text-muted);
      font-weight: 500;
    }
  `]
})
export class DebateDetailPage {
  id = '';
  debate: any;
  replies: any[] = [];
  tally: any;
  summary = '';
  reply = '';
  replyNotice = '';
  userVote: string | null = null;
  isSubmittingReply = false;
  isGeneratingSummary = false;

  isClosingDebate = false;

  private es?: EventSource;

  constructor(
    private route: ActivatedRoute,
    private debatesSvc: DebatesService,
    private authService: AuthService,
    private router: Router
  ) {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.refresh();
    this.setupSSE();
  }

  refresh() {
    this.debatesSvc.get(this.id).subscribe((d) => (this.debate = d));
    this.debatesSvc.listReplies(this.id).subscribe((r) => (this.replies = r));
    this.debatesSvc.tally(this.id).subscribe((t) => (this.tally = t));
    this.debatesSvc.getSummary(this.id).subscribe({ 
      next: (s: any) => (this.summary = s.summary), 
      error: () => {} 
    });
  }

  addReply() {
    if (!this.reply.trim() || this.isSubmittingReply) return;
    
    this.isSubmittingReply = true;
    this.replyNotice = '';

    this.debatesSvc.createReply(this.id, this.reply).subscribe({
      next: () => {
        this.reply = '';
        this.replyNotice = '';
        this.isSubmittingReply = false;
        this.refresh();
      },
      error: (e) => {
        this.isSubmittingReply = false;
        this.replyNotice = e?.error?.message || 'Could not post reply';
      },
    });
  }

  vote(choice: 'up' | 'down') {
    this.userVote = choice;
    this.debatesSvc.vote(this.id, choice).subscribe({ 
      next: () => this.refresh(),
      error: () => this.userVote = null
    });
  }

  generateSummary() {
    this.isGeneratingSummary = true;
    this.debatesSvc.generateSummary(this.id).subscribe({ 
      next: (s: any) => {
        this.summary = s.summary;
        this.isGeneratingSummary = false;
      },
      error: () => {
        this.isGeneratingSummary = false;
      }
    });
  }

  regenerateSummary() {
    this.summary = '';
    this.generateSummary();
  }

  closeDebate() {
    if (!this.isDebateCreator()) return;
    if (!confirm('Are you sure you want to close this debate? This action cannot be undone.')) return;
    this.endDebate();
  }

  canManageDebate(): boolean {
    return this.isDebateCreator();
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'open': return 'badge-open';
      case 'closed': return 'badge-closed';
      default: return 'badge-completed';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  getTotalVotes(): number {
    if (!this.tally) return 0;
    return (this.tally.up || 0) + (this.tally.down || 0);
  }

  getVotePercentage(): number {
    if (!this.tally || this.getTotalVotes() === 0) return 0;
    return Math.round((this.tally.up / this.getTotalVotes()) * 100);
  }

  getInitials(name: string): string {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  trackByReply(index: number, reply: any): any {
    return reply._id || index;
  }

  isDebateCreator(): boolean {
    if (!this.debate || !this.authService.isLoggedIn()) return false;
    const currentUser = this.authService.getCurrentUser();
    return currentUser && this.debate.createdBy === currentUser.sub;
  }

  onTimerExpired(): void {
    // Refresh the debate to get the updated status
    this.refresh();
  }

  endDebate(): void {
    if (this.isClosingDebate || !this.isDebateCreator()) return;
    
    this.isClosingDebate = true;
    
    this.debatesSvc.close(this.id).subscribe({
      next: (updatedDebate) => {
        this.debate = updatedDebate;
        this.isClosingDebate = false;
        // Refresh all data
        this.refresh();
      },
      error: (error) => {
        this.isClosingDebate = false;
        console.error('Failed to close debate:', error);
        // You could add a toast notification here
      }
    });
  }

  deleteReply(replyId: string) {
    this.debatesSvc.deleteReply(this.id, replyId).subscribe({
      next: () => {
        this.replies = this.replies.filter(r => r._id !== replyId);
      },
      error: () => {}
    });
  }

  editReply(reply: any) {
    const current = reply?.content || '';
    const updated = prompt('Edit your comment:', current);
    if (updated == null) return; // cancelled
    const trimmed = String(updated).trim();
    if (!trimmed || trimmed === current) return;
    this.debatesSvc.updateReply(this.id, reply._id, trimmed).subscribe({
      next: (res: any) => {
        this.replies = this.replies.map(r => r._id === reply._id ? { ...r, content: res.content, updatedAt: res.updatedAt } : r);
      },
      error: () => {}
    });
  }

  deleteDebate() {
    if (!this.isDebateCreator()) return;
    if (!confirm('Delete this closed debate? This will remove all its replies and votes.')) return;
    this.debatesSvc.deleteDebate(this.id).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {}
    });
  }

  setupSSE() {
    try {
      this.es = this.debatesSvc.stream(this.id);
      this.es.addEventListener('closed', () => this.refresh());
      this.es.addEventListener('deleted', () => this.router.navigate(['/']));
      this.es.addEventListener('reply_deleted', (evt: any) => {
        try {
          const data = JSON.parse(evt.data || '{}');
          if (data?.id) this.replies = this.replies.filter(r => r._id !== data.id);
        } catch {}
      });
      this.es.addEventListener('reply_updated', (evt: any) => {
        try {
          const data = JSON.parse(evt.data || '{}');
          if (data?.id) {
            this.replies = this.replies.map(r => r._id === data.id ? { ...r, content: data.content, updatedAt: data.updatedAt } : r);
          }
        } catch {}
      });
    } catch {}
  }

  ngOnDestroy() {
    try { this.es?.close(); } catch {}
  }
}
