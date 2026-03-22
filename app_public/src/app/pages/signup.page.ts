import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="auth-container">
        <div class="auth-benefits">
          <h3>Start Debating Today</h3>
          <ul>
            <li>🚀 Create debates on topics you care about</li>
            <li>🎭 Participate anonymously to focus on ideas</li>
            <li>🧠 Develop critical thinking skills</li>
            <li>🌍 Connect with a global community</li>
            <li>📈 Track your debate participation</li>
          </ul>
        </div>

        <div class="auth-card">
          <div class="auth-header">
            <h1>Create Account</h1>
            <p>Join Anonymous Group Debate and start meaningful discussions</p>
          </div>

          <form (ngSubmit)="signup()" #signupForm="ngForm" class="auth-form">
            <div class="form-group">
              <label for="email" class="form-label">Email Address *</label>
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
              <label for="password" class="form-label">Password *</label>
              <input 
                type="password" 
                id="password"
                class="form-input"
                [(ngModel)]="password" 
                name="password" 
                placeholder="Create a secure password"
                required 
                minlength="6"
                #passwordInput="ngModel"
              />
              <div class="form-hint">
                Password must be at least 6 characters long
              </div>
              <div *ngIf="passwordInput.invalid && passwordInput.touched" class="form-error">
                <span *ngIf="passwordInput.errors?.['required']">Password is required</span>
                <span *ngIf="passwordInput.errors?.['minlength']">Password must be at least 6 characters</span>
              </div>
            </div>

            <div class="form-group">
              <label for="displayName" class="form-label">Display Name</label>
              <input 
                type="text" 
                id="displayName"
                class="form-input"
                [(ngModel)]="displayName" 
                name="displayName" 
                placeholder="Choose a display name (optional)"
              />
              <div class="form-hint">
                This will be shown in your profile (you can change it later)
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="agreeToTerms" 
                  name="agreeToTerms" 
                  required
                  #termsInput="ngModel"
                />
                <span class="checkmark"></span>
                I agree to the <a href="#" class="auth-link">Terms of Service</a> and 
                <a href="#" class="auth-link">Privacy Policy</a>
              </label>
              <div *ngIf="termsInput.invalid && termsInput.touched" class="form-error">
                You must agree to the terms to continue
              </div>
            </div>

            <button 
              type="submit" 
              class="btn btn-primary btn-full"
              [disabled]="signupForm.invalid || isSubmitting"
            >
              <span *ngIf="isSubmitting">Creating Account...</span>
              <span *ngIf="!isSubmitting">Create Account</span>
            </button>

            <div *ngIf="notice" class="alert alert-error">
              {{ notice }}
            </div>
          </form>

          <div class="auth-footer">
            <p>
              Already have an account? 
              <a routerLink="/login" class="auth-link">Sign in here</a>
            </p>
          </div>
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

    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      cursor: pointer;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .checkbox-label input[type="checkbox"] {
      width: auto;
      margin: 0;
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
      background: linear-gradient(135deg, var(--badge-open-text) 0%, var(--badge-open-bg) 100%);
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
        padding: 2rem;
      }
    }
  `]
})
export class SignupPage {
  email = '';
  password = '';
  displayName = '';
  agreeToTerms = false;
  notice = '';
  isSubmitting = false;

  constructor(private auth: AuthService, private router: Router) {}

  signup() {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.notice = '';

    this.auth.signup(this.email, this.password, this.displayName).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/']);
      },
      error: (e) => {
        this.isSubmitting = false;
        this.notice = e?.error?.message || 'Signup failed. Please try again.';
      },
    });
  }
}
