import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('logIn', () => {
    it('should set session information and update isLogged to true', (done) => {
      const user: SessionInformation = {
        token: 'fake-jwt-token',
        type: 'Bearer',
        id: 1,
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        admin: false
      };

      service.logIn(user);

      expect(service.sessionInformation).toEqual(user);
      expect(service.isLogged).toBe(true);

      service.$isLogged().subscribe(isLogged => {
        expect(isLogged).toBe(true);
        done(); // Signale que le test est terminé
      });
    });
  });

  describe('logOut', () => {
    it('should clear session information and update isLogged to false', (done) => {
      // Première connexion pour tester la déconnexion
      const user: SessionInformation = {
        token: 'fake-jwt-token',
        type: 'Bearer',
        id: 1,
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        admin: false
      };
      service.logIn(user);

      service.logOut();

      expect(service.sessionInformation).toBeUndefined();
      expect(service.isLogged).toBe(false);

      service.$isLogged().subscribe(isLogged => {
        expect(isLogged).toBe(false);
        done(); // Signale que le test est terminé
      });
    });
  });
});
