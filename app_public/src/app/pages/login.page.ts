import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your Anonymous Group Debate account</p>
          </div>

          <form (ngSubmit)="login()" #loginForm="ngForm" class="auth-form">
            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <input 
                type="email" 
                id="email"
                class="form-input"
                [(ngModel)]="email" 
                name="email" 
                placeholder="Enter your email"
                required 
                #emailInput="ngModel"
              />
              <div *ngIf="emailInput.invalid && emailInput.touched" class="form-error">
                Please enter a valid email address
              </div>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input 
                type="password" 
                id="password"
                class="form-input"
                [(ngModel)]="password" 
                name="password" 
                placeholder="Enter your password"
                required 
                #passwordInput="ngModel"
              />
              <div *ngIf="passwordInput.invalid && passwordInput.touched" class="form-error">
                Password is required
              </div>
            </div>

            <button 
              type="submit" 
              class="btn btn-primary btn-full"
              [disabled]="loginForm.invalid || isSubmitting"
            >
              <span *ngIf="isSubmitting">Signing In...</span>
              <span *ngIf="!isSubmitting">Sign In</span>
            </button>

            <div *ngIf="notice" class="alert alert-error">
              {{ notice }}
            </div>
          </form>

          <div class="auth-footer">
            <p>
              Don't have an account? 
              <a routerLink="/signup" class="auth-link">Sign up here</a>
            </p>
          </div>
        </div>

        <div class="auth-benefits">
          <h3>Join the Discussion</h3>
          <ul>
            <li>🎯 Participate in meaningful debates</li>
            <li>🔒 Anonymous participation protects your privacy</li>
            <li>💡 Share your perspectives on important topics</li>
            <li>🤝 Engage with diverse viewpoints</li>
            <li>📊 Vote on debates and see community consensus</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      max-width: 1000px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: center;
      min-height: 70vh;
    }

    .auth-card {
      background: var(--surface-color);
      border-radius: 0.75rem;
      padding: 2.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border: 1px solid var(--border-color);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-header h1 {
      margin-bottom: 0.5rem;
      color: var(--heading-color);
    }

    .auth-header p {
      color: var(--text-muted);
      font-size: 1.125rem;
    }

    .auth-form {
      margin-bottom: 1.5rem;
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

    .form-input {
      width: 100%;
      padding: 0.875rem;
      border: 2px solid var(--border-color);
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
      background-color: var(--surface-color);
    }

    .form-input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-error {
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: var(--danger-color);
    }

    .btn-full {
      width: 100%;
      margin-top: 1rem;
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

    .auth-footer {
      text-align: center;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
    }

    .auth-footer p {
      color: var(--text-muted);
      margin: 0;
    }

    .auth-link {
      color: var(--primary-color);
      font-weight: 500;
      text-decoration: none;
    }

    .auth-link:hover {
      color: var(--primary-hover);
      text-decoration: underline;
    }

    .auth-benefits {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
      color: var(--surface-color);
      border-radius: 0.75rem;
      padding: 2.5rem;
    }

    .auth-benefits h3 {
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
    }

    .auth-benefits ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .auth-benefits li {
      padding: 0.75rem 0;
      font-size: 1.125rem;
      opacity: 0.95;
    }

    @media (max-width: 768px) {
      .auth-container {
        grid-template-columns: 1fr;
        gap: 2rem;
        padding: 1rem;
      }

      .auth-card {
        padding: 2rem;
      }

      .auth-benefits {
        order: -1;
        padding: 2rem;
      }
    }
  `]
})
export class LoginPage {
  email = '';
  password = '';
  notice = '';
  isSubmitting = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.notice = '';

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/']);
      },
      error: (e) => {
        this.isSubmitting = false;
        this.notice = e?.error?.message || 'Login failed. Please check your credentials.';
      },
    });
  }
}
