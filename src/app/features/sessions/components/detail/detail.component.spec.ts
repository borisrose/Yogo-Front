import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DetailComponent } from './detail.component';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { Teacher } from '../../../../interfaces/teacher.interface';
import { SessionService } from 'src/app/services/session.service';
import { Session } from '../../interfaces/session.interface';


describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;
  let sessionService: SessionService;
  let matSnackBar: MatSnackBar;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule
      ],
      declarations: [ DetailComponent ],
      providers: [
        {
          provide: SessionApiService,
          useValue: {
            detail: jest.fn(),
            delete: jest.fn(),
            participate: jest.fn(),
            unParticipate: jest.fn()
          }
        },
        {
          provide: TeacherService,
          useValue: {
            detail: jest.fn()
          }
        },
        {
          provide: SessionService,
          useValue: {
            sessionInformation: {
              id: 1,
              admin: true
            } as SessionInformation
          }
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: jest.fn()
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn()
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn().mockReturnValue('123')
              }
            }
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);
    sessionService = TestBed.inject(SessionService);
    matSnackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);
    fixture.detectChanges(); // Trigger change detection
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch session and teacher details', () => {
      const mockSession: Session = {
        id: 1,
        name: 'Yoga Class',
        description: 'Yoga session for beginners',
        date: new Date(),
        teacher_id: 1,
        users: [1],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockTeacher: Teacher = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(sessionApiService, 'detail').mockReturnValue(of(mockSession));
      jest.spyOn(teacherService, 'detail').mockReturnValue(of(mockTeacher));

      component.ngOnInit();

      expect(sessionApiService.detail).toHaveBeenCalledWith('123');
      expect(teacherService.detail).toHaveBeenCalledWith('1');
      expect(component.session).toEqual(mockSession);
      expect(component.teacher).toEqual(mockTeacher);
    });
  });

  describe('delete', () => {
    it('should delete session and navigate to sessions list', () => {
      jest.spyOn(sessionApiService, 'delete').mockReturnValue(of({}));
      const navigateSpy = jest.spyOn(router, 'navigate');
      const snackBarSpy = jest.spyOn(matSnackBar, 'open');

      component.delete();

      expect(sessionApiService.delete).toHaveBeenCalledWith('123');
      expect(snackBarSpy).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
      expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
    });
  });

  describe('participate', () => {
    it('should call participate and update session details', () => {
      jest.spyOn(sessionApiService, 'participate').mockReturnValue(of({}));
      jest.spyOn(sessionApiService, 'detail').mockReturnValue(of({
        ...component.session!,
        users: [1, 2]
      } as Session));

      component.participate();

      expect(sessionApiService.participate).toHaveBeenCalledWith('123', '1');
      expect(component.isParticipate).toBe(true);
    });
  });

  describe('unParticipate', () => {
    it('should call unParticipate and update session details', () => {
      jest.spyOn(sessionApiService, 'unParticipate').mockReturnValue(of({}));
      jest.spyOn(sessionApiService, 'detail').mockReturnValue(of({
        ...component.session!,
        users: []
      } as Session));

      component.unParticipate();

      expect(sessionApiService.unParticipate).toHaveBeenCalledWith('123', '1');
      expect(component.isParticipate).toBe(false);
    });
  });

  describe('back', () => {
    it('should navigate back in history', () => {
      const spy = jest.spyOn(window.history, 'back');
      component.back();
      expect(spy).toHaveBeenCalled();
    });
  });
});
