import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DebatesService } from '../services/debates.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Manage and monitor your debates and community activity</p>
      </div>

      <!-- Quick Stats -->
      <section class="stats-overview">
        <div class="stats-grid">
          <div class="stat-card primary">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <div class="stat-number">{{ totalDebates }}</div>
              <div class="stat-label">Total Debates</div>
            </div>
          </div>
          <div class="stat-card success">
            <div class="stat-icon">🟢</div>
            <div class="stat-content">
              <div class="stat-number">{{ activeDebates }}</div>
              <div class="stat-label">Active Debates</div>
            </div>
          </div>
          <div class="stat-card warning">
            <div class="stat-icon">🔒</div>
            <div class="stat-content">
              <div class="stat-number">{{ closedDebates }}</div>
              <div class="stat-label">Closed Debates</div>
            </div>
          </div>
          <div class="stat-card info">
            <div class="stat-icon">💬</div>
            <div class="stat-content">
              <div class="stat-number">{{ totalReplies }}</div>
              <div class="stat-label">Total Replies</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Activity -->
      <section class="recent-activity">
        <div class="section-header">
          <h2>Recent Activity</h2>
          <a routerLink="/create" class="btn btn-primary">Create New Debate</a>
        </div>
        
        <div class="activity-grid">
          <!-- Active Debates -->
          <div class="activity-card">
            <h3>Active Debates</h3>
            <div class="debate-list" *ngIf="activeDebatesList.length > 0; else noActiveDebates">
              <div class="debate-item" *ngFor="let debate of activeDebatesList">
                <div class="debate-info">
                  <h4>
                    <a [routerLink]="['/debates', debate._id]">{{ debate.title }}</a>
                  </h4>
                  <p class="debate-meta">
                    {{ debate.replyCount || 0 }} replies • 
                    Created {{ formatDate(debate.createdAt) }}
                  </p>
                </div>
                <span class="badge badge-open">Active</span>
              </div>
            </div>
            <ng-template #noActiveDebates>
              <div class="empty-state-small">
                <p>No active debates</p>
                <a routerLink="/create" class="btn btn-primary">Start One</a>
              </div>
            </ng-template>
          </div>

          <!-- Recent Debates -->
          <div class="activity-card">
            <h3>Recent Debates</h3>
            <div class="debate-list" *ngIf="recentDebates.length > 0; else noRecentDebates">
              <div class="debate-item" *ngFor="let debate of recentDebates">
                <div class="debate-info">
                  <h4>
                    <a [routerLink]="['/debates', debate._id]">{{ debate.title }}</a>
                  </h4>
                  <p class="debate-meta">
                    {{ debate.replyCount || 0 }} replies • 
                    {{ formatDate(debate.createdAt) }}
                  </p>
                </div>
                <span class="badge" [ngClass]="getBadgeClass(debate.status)">
                  {{ debate.status }}
                </span>
              </div>
            </div>
            <ng-template #noRecentDebates>
              <div class="empty-state-small">
                <p>No recent debates</p>
              </div>
            </ng-template>
          </div>
        </div>
      </section>

      <!-- Debate Management -->
      <section class="debate-management">
        <div class="section-header">
          <h2>All Debates</h2>
          <div class="filter-tabs">
            <button 
              class="filter-tab" 
              [class.active]="currentFilter === 'all'"
              (click)="setFilter('all')">
              All ({{ totalDebates }})
            </button>
            <button 
              class="filter-tab" 
              [class.active]="currentFilter === 'open'"
              (click)="setFilter('open')">
              Active ({{ activeDebates }})
            </button>
            <button 
              class="filter-tab" 
              [class.active]="currentFilter === 'closed'"
              (click)="setFilter('closed')">
              Closed ({{ closedDebates }})
            </button>
          </div>
        </div>

        <div class="debates-table">
          <div class="table-header">
            <div class="col-title">Title</div>
            <div class="col-status">Status</div>
            <div class="col-replies">Replies</div>
            <div class="col-votes">Votes</div>
            <div class="col-date">Created</div>
            <div class="col-actions">Actions</div>
          </div>
          
          <div class="table-body" *ngIf="filteredDebates.length > 0; else noFilteredDebates">
            <div class="table-row" *ngFor="let debate of filteredDebates">
              <div class="col-title">
                <a [routerLink]="['/debates', debate._id]" class="debate-link">
                  {{ debate.title }}
                </a>
              </div>
              <div class="col-status">
                <span class="badge" [ngClass]="getBadgeClass(debate.status)">
                  {{ debate.status }}
                </span>
              </div>
              <div class="col-replies">{{ debate.replyCount || 0 }}</div>
              <div class="col-votes">{{ debate.voteCount || 0 }}</div>
              <div class="col-date">{{ formatDate(debate.createdAt) }}</div>
              <div class="col-actions">
                <a [routerLink]="['/debates', debate._id]" class="btn btn-primary btn-sm">
                  View
                </a>
              </div>
            </div>
          </div>

          <ng-template #noFilteredDebates>
            <div class="empty-state">
              <h3>No debates found</h3>
              <p>No debates match the current filter.</p>
            </div>
          </ng-template>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .dashboard-header h1 {
      margin-bottom: 0.5rem;
    }

    .dashboard-header p {
      color: var(--text-muted);
      font-size: 1.125rem;
    }

    .stats-overview {
      margin-bottom: 3rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: var(--surface-color);
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-card.primary {
      border-left: 4px solid var(--primary-color);
    }

    .stat-card.success {
      border-left: 4px solid var(--badge-open-text);
    }

    .stat-card.warning {
      border-left: 4px solid var(--badge-closed-text);
    }

    .stat-card.info {
      border-left: 4px solid var(--primary-hover);
    }

    .stat-icon {
      font-size: 2rem;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: var(--heading-color);
      margin-bottom: 0.25rem;
    }

    .stat-label {
      color: var(--text-muted);
      font-weight: 500;
    }

    .recent-activity {
      margin-bottom: 3rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header h2 {
      margin: 0;
    }

    .activity-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .activity-card {
      background: var(--surface-color);
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border-color);
    }

    .activity-card h3 {
      margin-bottom: 1rem;
      color: var(--heading-color);
    }

    .debate-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .debate-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 0.75rem;
      background: var(--bg-color);
      border-radius: 0.5rem;
      border: 1px solid var(--border-color);
    }

    .debate-info h4 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
    }

    .debate-info a {
      color: var(--heading-color);
      text-decoration: none;
      font-weight: 500;
    }

    .debate-info a:hover {
      color: var(--primary-color);
    }

    .debate-meta {
      margin: 0;
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .empty-state-small {
      text-align: center;
      padding: 2rem;
      color: var(--text-muted);
    }

    .empty-state-small p {
      margin-bottom: 1rem;
    }

    .debate-management {
      margin-bottom: 3rem;
    }

    .filter-tabs {
      display: flex;
      gap: 0.5rem;
    }

    .filter-tab {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color);
      background: var(--surface-color);
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .filter-tab:hover {
      background: var(--bg-color);
    }

    .filter-tab.active {
      background: var(--primary-color);
      color: var(--surface-color);
      border-color: var(--primary-color);
    }

    .debates-table {
      background: var(--surface-color);
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border-color);
      overflow: hidden;
    }

    .table-header {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: var(--bg-color);
      border-bottom: 1px solid var(--border-color);
      font-weight: 600;
      color: var(--text-gray-700);
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .table-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
      gap: 1rem;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
      align-items: center;
      transition: background-color 0.2s;
    }

    .table-row:hover {
      background: var(--bg-color);
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .debate-link {
      color: var(--heading-color);
      text-decoration: none;
      font-weight: 500;
    }

    .debate-link:hover {
      color: var(--primary-color);
    }

    .btn-sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
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

    @media (max-width: 768px) {
      .section-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .activity-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .filter-tabs {
        flex-wrap: wrap;
      }

      .table-header,
      .table-row {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      .table-header > div,
      .table-row > div {
        padding: 0.25rem 0;
      }

      .table-header > div:before,
      .table-row > div:before {
        content: attr(data-label) ': ';
        font-weight: 600;
        display: inline-block;
        width: 80px;
      }
    }
  `]
})
export class DashboardPage {
  debates: any[] = [];
  totalDebates = 0;
  activeDebates = 0;
  closedDebates = 0;
  totalReplies = 0;
  activeDebatesList: any[] = [];
  recentDebates: any[] = [];
  filteredDebates: any[] = [];
  currentFilter = 'all';

  constructor(private debatesSvc: DebatesService) {
    this.loadDebates();
  }

  loadDebates() {
    this.debatesSvc.list().subscribe((data: any[]) => {
      this.debates = data;
      this.calculateStats();
      this.updateLists();
      this.applyFilter();
    });
  }

  calculateStats() {
    this.totalDebates = this.debates.length;
    this.activeDebates = this.debates.filter(d => d.status === 'open').length;
    this.closedDebates = this.debates.filter(d => d.status === 'closed').length;
    this.totalReplies = this.debates.reduce((sum, d) => sum + (d.replyCount || 0), 0);
  }

  updateLists() {
    this.activeDebatesList = this.debates
      .filter(d => d.status === 'open')
      .slice(0, 5);
    
    this.recentDebates = this.debates
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }

  setFilter(filter: string) {
    this.currentFilter = filter;
    this.applyFilter();
  }

  applyFilter() {
    if (this.currentFilter === 'all') {
      this.filteredDebates = [...this.debates];
    } else {
      this.filteredDebates = this.debates.filter(d => d.status === this.currentFilter);
    }
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
