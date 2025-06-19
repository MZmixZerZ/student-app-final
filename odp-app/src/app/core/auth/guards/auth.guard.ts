import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { of, switchMap } from 'rxjs';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
    const router: Router = inject(Router);

    // Check the authentication status
    return inject(AuthService)
        .check()
        .pipe(
            switchMap((authenticated) => {
                // If the user is not authenticated...
                if (!authenticated) {
                    // Redirect to the sign-in page with a redirectURL param
                    const redirectURL =
                        state.url && state.url !== '/sign-out'
                            ? `redirectURL=${encodeURIComponent(state.url)}`
                            : '';
                    const urlTree = router.parseUrl(
                        redirectURL ? `/sign-in?${redirectURL}` : '/sign-in'
                    );
                    return of(urlTree);
                }

                // Allow the access
                return of(true);
            })
        );
};
