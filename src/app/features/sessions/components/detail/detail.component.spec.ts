import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DetailComponent } from './detail.component';
import { SessionInformation } from '../../../../interfaces/sessionInformation.interface';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';
import { Teacher } from '../../../../interfaces/teacher.interface';
import { SessionService } from '../../../../services/session.service';
import { Session } from '../../interfaces/session.interface';
import { ReactiveFormsModule } from '@angular/forms';

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
        MatInputModule,
        ReactiveFormsModule
      ],
      declarations: [ DetailComponent ],
      providers: [
        {
          provide: SessionApiService,
          useValue: {
            detail: jest.fn().mockReturnValue(of({} as Session)),
            delete: jest.fn().mockReturnValue(of({})),
            participate: jest.fn().mockReturnValue(of(void 0)),
            unParticipate: jest.fn().mockReturnValue(of(void 0))
          }
        },
        {
          provide: TeacherService,
          useValue: {
            detail: jest.fn().mockReturnValue(of({} as Teacher))
          }
        },
        {
          provide: SessionService,
          useValue: {
            sessionInformation: {
              id: 1,
              token: "1233",
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
      fixture.detectChanges();

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
      fixture.detectChanges();

      expect(sessionApiService.delete).toHaveBeenCalledWith('123');
      expect(snackBarSpy).toHaveBeenCalledWith('Session deleted!', 'Close', { duration: 3000 });
      expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
    });
  });

  describe('participate', () => {
    it('should call participate and update session details', () => {
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

      jest.spyOn(sessionApiService, 'participate').mockReturnValue(of(void 0));
      jest.spyOn(sessionApiService, 'detail').mockReturnValue(of({
        ...mockSession,
        users: [1, 2]
      }));

      component.participate();
      fixture.detectChanges();

      expect(sessionApiService.participate).toHaveBeenCalledWith('123', '1');
      expect(sessionApiService.detail).toHaveBeenCalledWith('123');
      expect(component.session?.users).toContain(2);
    });
  });

  describe('unParticipate', () => {
    it('should call unParticipate and update session details', () => {
      jest.spyOn(sessionApiService, 'unParticipate').mockReturnValue(of(void 0));
      jest.spyOn(sessionApiService, 'detail').mockReturnValue(of({
        ...component.session!,
        users: []
      } as Session));

      component.unParticipate();
      fixture.detectChanges();

      expect(sessionApiService.unParticipate).toHaveBeenCalledWith('123', '1');
      expect(sessionApiService.detail).toHaveBeenCalledWith('123');
      expect(component.session?.users).toEqual([]);
    });
  });

  describe('back', () => {
    it('should navigate back in history', () => {
      const spy = jest.spyOn(window.history, 'back');
      component.back();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });
});
