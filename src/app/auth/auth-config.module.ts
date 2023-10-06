import { NgModule } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';


@NgModule({
    imports: [AuthModule.forRoot({
        config: {
            authority: 'https://eddie71677.us.auth0.com',
            redirectUrl: window.location.origin,
            clientId: 'vobZUkiIaVpbl1fRxQDf1MWkW4JqCCyl',
            scope: 'openid profile offline_access',
            responseType: 'code',
            silentRenew: true,
            useRefreshToken: true,
            secureRoutes: ['http://localhost:8080'],
            customParamsAuthRequest: {
              audience: 'http://localhost:8080'
            }
        }
      })],
    exports: [AuthModule],
})
export class AuthConfigModule {}
