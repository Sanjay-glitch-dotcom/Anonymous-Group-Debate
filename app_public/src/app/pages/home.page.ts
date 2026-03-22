import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DebatesService } from '../services/debates.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">Welcome to Anonymous Group Debate</h1>
          <p class="hero-subtitle">
            Join anonymous group debates on topics that matter. Share your thoughts, 
            engage with diverse perspectives, and help shape meaningful discussions.
          </p>
          <div class="hero-actions">
            <a routerLink="/create" class="btn btn-primary">Start a Debate</a>
            <a routerLink="/signup" class="btn btn-primary">Join Community</a>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ totalDebates }}</div>
            <div class="stat-label">Total Debates</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ activeDebates }}</div>
            <div class="stat-label">Active Debates</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ totalReplies }}</div>
            <div class="stat-label">Total Replies</div>
          </div>
        </div>
      </section>

      <!-- Ongoing Debates Section -->
      <section class="debates-section">
        <div class="section-header">
          <h2>Ongoing Debates</h2>
          <p>Join the conversation on these active debates</p>
        </div>
        
        <div class="debates-grid" *ngIf="debates.length > 0; else noDebates">
          <div class="debate-card" *ngFor="let debate of debates">
            <div class="debate-header">
              <span class="badge" [ngClass]="getBadgeClass(debate.status)">
                {{ debate.status }}
              </span>
              <span class="debate-date">{{ formatDate(debate.createdAt) }}</span>
            </div>
            <h3 class="debate-title">
              <a [routerLink]="['/debates', debate._id]">{{ debate.title }}</a>
            </h3>
            <p class="debate-description">{{ debate.description }}</p>
            <div class="debate-stats">
              <span class="stat">
                <strong>{{ debate.replyCount || 0 }}</strong> replies
              </span>
              <span class="stat">
                <strong>{{ debate.voteCount || 0 }}</strong> votes
              </span>
            </div>
            <div class="debate-actions">
              <a [routerLink]="['/debates', debate._id]" class="btn btn-primary">
                View Debate
              </a>
            </div>
          </div>
        </div>

        <ng-template #noDebates>
          <div class="empty-state">
            <h3>No debates yet</h3>
            <p>Be the first to start a meaningful discussion!</p>
            <a routerLink="/create" class="btn btn-primary">Create First Debate</a>
          </div>
        </ng-template>
      </section>
    </div>
  `,
  styles: [`
    .hero {
      text-align: center;
      padding: 4rem 0;
      background: linear-gradient(-45deg, #ee7752, #e73c7e, #ff4b2b, #f5af19);
      background-size: 400% 400%;
      animation: gradientBG 15s ease infinite;
      color: white; /* Ensure text remains white against the vibrant background */
      border-radius: 1rem;
      margin-bottom: 3rem;
    }

    @keyframes gradientBG {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    .hero-title {
      font-size: 3rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.9;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .stats-section {
      margin-bottom: 3rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: var(--surface-color);
      padding: 2rem;
      border-radius: 0.75rem;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border-color);
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: var(--text-muted);
      font-weight: 500;
    }

    .debates-section {
      margin-bottom: 3rem;
    }

    .section-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .section-header h2 {
      margin-bottom: 0.5rem;
    }

    .section-header p {
      color: var(--text-muted);
      font-size: 1.125rem;
    }

    .debates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .debate-card {
      background: var(--surface-color);
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border-color);
      transition: all 0.2s;
    }

    .debate-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    .debate-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .debate-date {
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    .debate-title {
      margin-bottom: 0.75rem;
    }

    .debate-title a {
      color: var(--heading-color);
      text-decoration: none;
      font-weight: 600;
    }

    .debate-title a:hover {
      color: var(--primary-color);
    }

    .debate-description {
      color: var(--text-muted);
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .debate-stats {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .debate-actions {
      display: flex;
      justify-content: flex-end;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-muted);
    }

    .empty-state h3 {
      margin-bottom: 0.5rem;
      color: var(--text-gray-700);
    }

    .empty-state p {
      margin-bottom: 1.5rem;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-subtitle {
        font-size: 1rem;
      }
      
      .debates-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomePage {
  debates: any[] = [];
  totalDebates = 0;
  activeDebates = 0;
  totalReplies = 0;

  constructor(private debatesSvc: DebatesService) {
    this.loadDebates();
  }

  loadDebates() {
    this.debatesSvc.list().subscribe((data: any[]) => {
      this.debates = data;
      this.calculateStats();
    });
  }

  calculateStats() {
    this.totalDebates = this.debates.length;
    this.activeDebates = this.debates.filter(d => d.status === 'open').length;
    this.totalReplies = this.debates.reduce((sum, d) => sum + (d.replyCount || 0), 0);
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
}
