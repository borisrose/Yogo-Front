import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TeacherService } from './teacher.service';
import { Teacher } from '../interfaces/teacher.interface';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  // Crée des données de test
  const mockTeachers: Teacher[] = [
    { id: 1, lastName: 'Doe', firstName: 'John', createdAt: new Date(), updatedAt: new Date() },
    { id: 2, lastName: 'Smith', firstName: 'Jane', createdAt: new Date(), updatedAt: new Date() }
  ];

  const mockTeacher: Teacher = { id: 1, lastName: 'Doe', firstName: 'John', createdAt: new Date(), updatedAt: new Date() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeacherService]
    });

    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Assure que toutes les requêtes ont été interceptées
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('all', () => {
    it('should return an array of teachers', () => {
      service.all().subscribe(teachers => {
        expect(teachers.length).toBe(2);
        expect(teachers).toEqual(mockTeachers);
      });

      // Configure la requête HTTP simulée
      const req = httpMock.expectOne('api/teacher');
      expect(req.request.method).toBe('GET');
      req.flush(mockTeachers);  // Fournit les données simulées
    });
  });

  describe('detail', () => {
    it('should return a teacher by id', () => {
      const teacherId = 1;

      service.detail(teacherId.toString()).subscribe(teacher => {
        expect(teacher).toEqual(mockTeacher);
      });


      const req = httpMock.expectOne(`api/teacher/${teacherId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTeacher);  // Fournit les données simulées
    });
  });
});
