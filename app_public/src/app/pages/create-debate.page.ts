import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DebatesService } from '../services/debates.service';

@Component({
  standalone: true,
  selector: 'app-create-debate',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="create-debate-container">
        <div class="page-header">
          <h1>Create New Debate</h1>
          <p>Start a meaningful discussion on a topic that matters to you</p>
        </div>

        <div class="form-card">
          <form (ngSubmit)="create()" #debateForm="ngForm">
            <div class="form-group">
              <label for="title" class="form-label">Debate Title *</label>
              <input 
                type="text" 
                id="title"
                class="form-input"
                [(ngModel)]="title" 
                name="title" 
                placeholder="Enter a compelling debate title..."
                required 
                #titleInput="ngModel"
              />
              <div class="form-hint">
                Make it clear and engaging to attract participants
              </div>
              <div *ngIf="titleInput.invalid && titleInput.touched" class="form-error">
                Title is required
              </div>
            </div>

            <div class="form-group">
              <label for="description" class="form-label">Description *</label>
              <textarea 
                id="description"
                class="form-textarea"
                [(ngModel)]="description" 
                name="description" 
                rows="6"
                placeholder="Provide context and background for your debate. What are the key points to consider?"
                required
                #descriptionInput="ngModel"
              ></textarea>
              <div class="form-hint">
                Provide enough context to help participants understand the topic
              </div>
              <div *ngIf="descriptionInput.invalid && descriptionInput.touched" class="form-error">
                Description is required
              </div>
            </div>

            <div class="form-actions">
              <button 
                type="button" 
                class="btn btn-secondary"
                (click)="goBack()"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="debateForm.invalid || isSubmitting"
              >
                <span *ngIf="isSubmitting">Creating...</span>
                <span *ngIf="!isSubmitting">Create Debate</span>
              </button>
            </div>

            <div *ngIf="notice" class="alert alert-error">
              {{ notice }}
            </div>
          </form>
        </div>

        <div class="guidelines-card">
          <h3>Community Guidelines</h3>
          <ul>
            <li>Keep discussions respectful and constructive</li>
            <li>Focus on the topic and avoid personal attacks</li>
            <li>Provide evidence to support your arguments</li>
            <li>Be open to different perspectives</li>
            <li>Anonymous participation helps focus on ideas, not personalities</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .create-debate-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .page-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .page-header h1 {
      margin-bottom: 0.5rem;
    }

    .page-header p {
      color: var(--text-muted);
      font-size: 1.125rem;
    }

    .form-card {
      background: var(--surface-color);
      border-radius: 0.75rem;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border-color);
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: var(--text-gray-700);
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid var(--border-color);
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
      background-color: var(--surface-color);
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 120px;
    }

    .form-hint {
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .form-error {
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: var(--danger-color);
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
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

    .guidelines-card {
      background: var(--surface-color);
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border-color);
    }

    .guidelines-card h3 {
      margin-bottom: 1rem;
      color: var(--heading-color);
    }

    .guidelines-card ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .guidelines-card li {
      padding: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;
      color: var(--text-muted);
    }

    .guidelines-card li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--badge-open-text);
      font-weight: bold;
    }

    @media (max-width: 768px) {
      .form-actions {
        flex-direction: column;
      }
      
      .form-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class CreateDebatePage {
  title = '';
  description = '';
  notice = '';
  isSubmitting = false;

  constructor(private debatesSvc: DebatesService, private router: Router) {}

  create() {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.notice = '';

    this.debatesSvc.create({ title: this.title, description: this.description }).subscribe({
      next: (d: any) => {
        this.isSubmitting = false;
        this.router.navigate(['/debates', d._id]);
      },
      error: (e) => {
        this.isSubmitting = false;
        this.notice = e?.error?.message || 'Could not create debate. Please try again.';
      },
    });
  }

  goBack() {
    window.history.back();
  }
}
