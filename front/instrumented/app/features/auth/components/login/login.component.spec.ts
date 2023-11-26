import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {expect} from '@jest/globals';
import {SessionService} from 'src/app/services/session.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {LoginComponent} from './login.component';
import {AuthService} from "../../services/auth.service";
import {By} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {LoginRequest} from "../../interfaces/loginRequest.interface";
import {Observable, of} from "rxjs";
import {SessionInformation} from "../../../../interfaces/sessionInformation.interface";
import {NgZone} from "@angular/core";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: AuthService;
  let routerMock: Router;
  let formBuilderMock: FormBuilder;
  let sessionServiceMock: SessionService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [SessionService],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authServiceMock = TestBed.inject(AuthService)
    sessionServiceMock = TestBed.inject(SessionService)
    formBuilderMock = TestBed.inject(FormBuilder)
    httpTestingController = TestBed.inject(HttpTestingController);
    routerMock = TestBed.inject(Router)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call submit method with valid credentials', () => {

    let form: LoginRequest = {
      email: "test@test.fr",
      password: "123"
    };

    component.form.controls['email'].setValue('test@test.fr');
    component.form.controls['password'].setValue('123');

    component.submit();

    expect(component.form.value).toEqual(form);

  });

  it('should call authService.login with valid credential', () => {

    component.form.controls['email'].setValue('test@test.fr');
    component.form.controls['password'].setValue('123');

    const authServiceSpy = jest.spyOn(authServiceMock, 'login');

    component.submit();

    expect(authServiceSpy).toHaveBeenCalledWith({
      email: 'test@test.fr',
      password: '123',
    });

  });

  it('should call authService.login with bad credential', fakeAsync(() => {

    component.form.controls['email'].setValue('test');
    component.form.controls['password'].setValue('');

    const authServiceSpy = jest.spyOn(authServiceMock, 'login');

    authServiceSpy.mockImplementation((loginRequest) => {
      return new Observable((observer) => {
        observer.error(new Error('Simulated login error'));
      });
    });

    component.submit();

    tick();

    expect(component.onError).toBe(true);

  }));

  it('should call sessionService.logIn and redirect session', () => {

    component.form.controls['email'].setValue('test@test.fr');
    component.form.controls['password'].setValue('123');

    const authServiceSpy = jest.spyOn(authServiceMock, 'login');

    const successResponse: SessionInformation = {
      token: 'token1234',
      type: 'user',
      id: 1,
      username: 'username',
      firstName: 'Dan',
      lastName: 'Versabeau',
      admin: false,
    };

    authServiceSpy.mockImplementation(() => {
      return new Observable((observer) => {
        observer.next(successResponse);
        observer.complete();
      });
    });

    const sessionServiceLogInSpy = jest.spyOn(sessionServiceMock, 'logIn');
    const routerNavigateSpy = jest.spyOn(routerMock, 'navigate');

    const ngZone = TestBed.inject(NgZone);

    ngZone.run(() => {
      component.submit();
    });

    expect(authServiceSpy).toHaveBeenCalledWith({
      email: 'test@test.fr',
      password: '123',
    });

    expect(sessionServiceLogInSpy).toHaveBeenCalledWith(successResponse);

    expect(routerNavigateSpy).toHaveBeenCalledWith(['/sessions']);

  });


});
