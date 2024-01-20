import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import { SessionService } from '../services/session.service';
import {expect} from '@jest/globals';


describe('JwtInterceptor', () => {
  let interceptor: JwtInterceptor;
  let sessionService: SessionService;
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        JwtInterceptor,
        SessionService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true,
        },
      ],
    });

    interceptor = TestBed.inject(JwtInterceptor);
    sessionService = TestBed.inject(SessionService);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should not add Authorization header when user is not logged in', () => {
    Object.defineProperty(sessionService, 'isLogged', {
      get: jest.fn().mockReturnValue(false),
    });

    httpClient.get('/api/data').subscribe();

    const req = httpTestingController.expectOne('/api/data');

    expect(req.request.headers.has('Authorization')).toBeFalsy();

    httpTestingController.verify();
  });
});
