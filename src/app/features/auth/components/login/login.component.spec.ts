import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../../../services/session.service';
import { SessionInformation } from '../../../../interfaces/sessionInformation.interface';
import { LoginRequest } from '../../interfaces/loginRequest.interface';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let sessionService: SessionService;
  let router: Router;

  // Données de test simulées
  const mockSessionInfo: SessionInformation = {
    token: 'fake-jwt-token',
    type: 'Bearer',
    id: 1,
    username: 'john.doe',
    firstName: 'John',
    lastName: 'Doe',
    admin: false
  };

  const mockLoginRequest: LoginRequest = {
    email: 'john.doe@example.com',
    password: 'password123'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatButtonModule,
        MatFormFieldModule,
        MatCardModule,
        MatInputModule,
        MatIconModule,
        BrowserAnimationsModule
      ],
      declarations: [LoginComponent],
      providers: [
        FormBuilder,
        AuthService,
        SessionService,
        { provide: Router, useValue: { navigate: jest.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login and navigate on success', () => {
    jest.spyOn(authService, 'login').mockReturnValue(of(mockSessionInfo));
    jest.spyOn(sessionService, 'logIn');
    jest.spyOn(router, 'navigate');

    component.form.setValue(mockLoginRequest);
    component.submit();

    expect(authService.login).toHaveBeenCalledWith(mockLoginRequest);
    expect(sessionService.logIn).toHaveBeenCalledWith(mockSessionInfo);
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should set onError to true on login failure', () => {
    jest.spyOn(authService, 'login').mockReturnValue(throwError(() => new Error('Login failed')));

    component.form.setValue(mockLoginRequest);
    component.submit();

    expect(authService.login).toHaveBeenCalledWith(mockLoginRequest);
    expect(component.onError).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.hide).toBeTruthy();
    component.hide = !component.hide;
    expect(component.hide).toBeFalsy();
  });

  it('should disable submit button if form is invalid', () => {
    component.form.setValue({ email: '', password: '' });
    fixture.detectChanges();
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should enable submit button if form is valid', () => {
    component.form.setValue(mockLoginRequest);
    fixture.detectChanges();
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeFalsy();
  });
});
