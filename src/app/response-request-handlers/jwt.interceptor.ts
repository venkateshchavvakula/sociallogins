import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor,HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor() {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            setHeaders: {   // set headers if required
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
            }
        });
        // add authorization header with jwt token if available
        let token = JSON.parse(localStorage.getItem('usertoken'));
        if (token) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${token}`,
                }
            });
        }
     
        
        return next
            .handle(request)
            .pipe(
                tap((ev: HttpEvent<any>) => {
                    if (ev instanceof HttpResponse) {
                        // request response Logic here
                        console.log('processing response', ev);
                    }
                })
            )
    }
}
