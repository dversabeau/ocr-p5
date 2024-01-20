import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { UnauthGuard } from './unauth.guard';
import { SessionService } from '../services/session.service';
import {expect} from '@jest/globals';

describe('UnauthGuard', () => {
  let guard: UnauthGuard;
  let router: Router;
  let sessionService: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [UnauthGuard, SessionService],
    });

    guard = TestBed.inject(UnauthGuard);
    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation when not logged in', () => {
    Object.defineProperty(sessionService, 'isLogged', {
      get: jest.fn().mockReturnValue(false),
    });
    const canActivate = guard.canActivate();

    expect(canActivate).toBe(true);
  });

});
