
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log('Mahmoud Badr  1 >>>')
    // request = request.clone({
    //   setHeaders: {
    //     'X-API-KEY': '1b41924f23b544e8dc9dd2cbe2328ba0'
    //   }
    // });
    let headers_ = new HttpHeaders({ 'X-API-KEY': '1b41924f23b544e8dc9dd2cbe2328ba0' });
    const copiedReq  = request.clone({ headers:headers_});
    // console.log(copiedReq)
    return next.handle(copiedReq);
  }
}