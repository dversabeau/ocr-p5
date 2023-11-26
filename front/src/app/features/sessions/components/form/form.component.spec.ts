import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import {ActivatedRoute, Router} from "@angular/router";
import {TeacherService} from "../../../../services/teacher.service";
import {SessionInformation} from "../../../../interfaces/sessionInformation.interface";
import {NgZone} from "@angular/core";
import {of} from "rxjs";
import {Session} from "../../interfaces/session.interface";

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let routeMock: ActivatedRoute;
  let fbMock: FormBuilder;
  let matSnackBarMock: MatSnackBar;
  let sessionApiServiceMock: SessionApiService;
  let sessionServiceMock: SessionService;
  let teacherServiceMock: TeacherService;
  let routerMock: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        SessionApiService
      ],
      declarations: [FormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    routeMock = TestBed.inject(ActivatedRoute);
    fbMock = TestBed.inject(FormBuilder)
    matSnackBarMock = TestBed.inject(MatSnackBar)
    sessionApiServiceMock = TestBed.inject(SessionApiService)
    sessionServiceMock = TestBed.inject(SessionService)
    teacherServiceMock = TestBed.inject(TeacherService)
    routerMock = TestBed.inject(Router)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", ()=>{
    it("should redirect to /session if the session is not admin", ()=>{
      let routerNavigateSpy = jest.spyOn(routerMock, 'navigate');

      let sessionInformationMock: SessionInformation = {
        token: 'token1234',
        type: 'user',
        id: 1,
        username: 'username',
        firstName: 'Dan',
        lastName: 'Versabeau',
        admin: false,
      }

      sessionServiceMock.sessionInformation = sessionInformationMock;

      const ngZone = TestBed.inject(NgZone);

      ngZone.run(() => {
        component.ngOnInit();
      });

      expect(routerNavigateSpy).toHaveBeenCalledWith(['/sessions'])
    })

    it("should call this initForm() and initialise the form", ()=>{
      const routerSpy = jest.spyOn(routerMock, 'url', 'get');

      routerSpy.mockReturnValue("mock/url/");

      const ngZone = TestBed.inject(NgZone);

      ngZone.run(() => {
        component.ngOnInit();
      });

      expect(routerSpy).toHaveBeenCalled();
      expect(routerSpy.mock.results[0].value).not.toContain('update');

      // @ts-ignore
      expect(component.sessionForm.get('name')?.value).toEqual('');
      // @ts-ignore
      expect(component.sessionForm.get('date')?.value).toEqual('');
      // @ts-ignore
      expect(component.sessionForm.get('teacher_id')?.value).toEqual('');
      // @ts-ignore
      expect(component.sessionForm.get('description')?.value).toEqual('');
    })

  })

  it("should call sessionApiService", ()=>{
    const routerSpy = jest.spyOn(routerMock, 'url', 'get');

    const sessionDataMock: Session = {
      name: 'username',
      description: 'Lorem ipsum',
      date: new Date(),
      teacher_id: 1,
      users: [],
    };

    routerSpy.mockReturnValue("mock/url/update");

    const detailSpy = jest.spyOn(sessionApiServiceMock, 'detail');
    detailSpy.mockReturnValue(of(sessionDataMock));


    const ngZone = TestBed.inject(NgZone);

    ngZone.run(() => {
      component.ngOnInit();
    });

    expect(routerSpy).toHaveBeenCalled();
    expect(routerSpy.mock.results[0].value).toContain('update');
    expect(component.onUpdate).toBe(true);

    // @ts-ignore
    expect(component.sessionForm.value).toEqual({
      name: sessionDataMock.name,
      description: sessionDataMock.description,
      date: sessionDataMock.date.toISOString().split('T')[0],
      teacher_id: sessionDataMock.teacher_id,
    });

  })

});
