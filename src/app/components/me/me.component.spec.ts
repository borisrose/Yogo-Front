import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MeComponent } from './me.component';
import { UserService } from '../../services/user.service';
import { SessionService } from '../../services/session.service';
import { User } from '../../interfaces/user.interface';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userService: jest.Mocked<UserService>;
  let sessionService: jest.Mocked<SessionService>;
  let snackBar: jest.Mocked<MatSnackBar>;
  let router: jest.Mocked<Router>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    lastName: 'Doe',
    firstName: 'John',
    admin: false,
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    userService = {
      getById: jest.fn(),
      delete: jest.fn()
    } as any;

    sessionService = {
      $isLogged: jest.fn(),
      logOut: jest.fn(),
      sessionInformation: { id: 1, token: 'token', type: 'Bearer', username: 'testuser', firstName: 'John', lastName: 'Doe', admin: false }
    } as any;

    snackBar = {
      open: jest.fn()
    } as any;

    router = {
      navigate: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      declarations: [MeComponent],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: SessionService, useValue: sessionService },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: Router, useValue: router }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;

    userService.getById.mockReturnValue(of(mockUser));
    userService.delete.mockReturnValue(of({}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user data on init', () => {
    fixture.detectChanges();
    expect(userService.getById).toHaveBeenCalledWith('1');
    expect(component.user).toEqual(mockUser);
  });

  it('should call back method', () => {
    jest.spyOn(window.history, 'back');
    component.back();
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should delete user and redirect', () => {
    component.delete();
    expect(userService.delete).toHaveBeenCalledWith('1');
    expect(snackBar.open).toHaveBeenCalledWith('Your account has been deleted !', 'Close', { duration: 3000 });
    expect(sessionService.logOut).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle error on delete', () => {
    userService.delete.mockReturnValue(throwError(() => new Error('Deletion failed')));
    component.delete();
    expect(snackBar.open).toHaveBeenCalledWith('Your account has been deleted !', 'Close', { duration: 3000 });
    expect(sessionService.logOut).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
