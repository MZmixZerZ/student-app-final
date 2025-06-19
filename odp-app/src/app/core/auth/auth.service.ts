import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    /**
     * Setter & getter for authenticated flag
     */
    set authenticated(value: boolean) {
        this._authenticated = value;
    }

    get authenticated(): boolean {
        return this._authenticated;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     */
    signIn(credentials: { username: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError(() => new Error('User is already logged in.'));
        }

        return this._httpClient.post('api/auth/signin', credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Decode the access token and store it in the user service
                const decodedToken = AuthUtils.decodeToken(response.accessToken);
                // Store the user on the user service
                this._userService.user = {
                    ...this._userService.user,
                    ...decodedToken,
                };

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient
            .post('api/auth/sign-in-with-token', {
                accessToken: this.accessToken,
            })
            .pipe(
                catchError(() => of(false)),
                switchMap((response: any) => {
                    if (response.accessToken) {
                        this.accessToken = response.accessToken;
                    }

                    this._authenticated = true;

                    const decodedToken = AuthUtils.decodeToken(response.accessToken);
                    this._userService.user = {
                        ...this._userService.user,
                        ...decodedToken,
                    };

                    return of(true);
                })
            );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        localStorage.removeItem('accessToken');
        this._authenticated = false;
        return of(true);
    }

    /**
     * Sign up
     */
    signUp(user: {
        fullName: string;
        email: string;
        username?: string;
        password: string;
        companyName?: string;
        companyRegisterNo?: string;
        agreements?: boolean;
    }): Observable<any> {
        // Set username = email (ถ้าไม่ได้ส่งมา)
        if (!user.username) {
            user.username = user.email;
        }
        return this._httpClient.post('api/auth/signup', user).pipe(
            switchMap((response: any) => {
                // ถ้ามี accessToken ให้ set token และ authenticated
                if (response && response.accessToken) {
                    this.accessToken = response.accessToken;
                    this._authenticated = true;
                    const decodedToken = AuthUtils.decodeToken(response.accessToken);
                    this._userService.user = {
                        ...this._userService.user,
                        ...decodedToken,
                    };
                }
                return of(response);
            })
        );
    }

    /**
     * Unlock session
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        if (this._authenticated) {
            return of(true);
        }
        if (!this.accessToken) {
            return of(false);
        }
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }
        return this.signInUsingToken();
    }
}
