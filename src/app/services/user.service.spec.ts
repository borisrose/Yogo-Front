import { HttpClientModule } from '@angular/common/http';
import { expect } from '@jest/globals';
import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { User } from '../interfaces/user.interface';
import { TestBed } from '@angular/core/testing';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;


  const mockUser: User = {
    id: 1,
    email: 'john.doe@example.com',
    lastName: 'Doe',
    firstName: 'John',
    admin: false,
    password: 'password123',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Assure que toutes les requêtes ont été interceptées
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getById', () => {
    it('should return a user by id', () => {
      const userId = '1';

      service.getById(userId).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      // Configure la requête HTTP simulée
      const req = httpMock.expectOne(`api/user/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);  // Fournit les données simulées
    });
  });

  describe('delete', () => {
    it('should delete a user by id', () => {
      const userId = '1';

      service.delete(userId).subscribe(response => {
        expect(response).toBeNull();
      });

      // Configure la requête HTTP simulée
      const req = httpMock.expectOne(`api/user/${userId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);  // Répond avec null pour simuler une suppression réussie
    });
  });
});
