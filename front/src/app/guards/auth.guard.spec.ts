import {AuthGuard} from "./auth.guard";
import {Router} from "@angular/router";
import {SessionService} from "../services/session.service";
import {TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {expect} from '@jest/globals';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;
  let sessionService: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard, SessionService],
    });

    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should canActivate return true if user is logged in', () => {
    Object.defineProperty(sessionService, 'isLogged', {
      get: jest.fn().mockReturnValue(true),
    });

    const canActivate = guard.canActivate();

    expect(canActivate).toBeTruthy();
  });

});
