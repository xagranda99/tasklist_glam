import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    setHeaders: {
      'x-access-token': '3GBWKoIHxXrI43r3hF0aVRC80IP1Q44rVr0w0O5Ikm0wUQdJcTbX60X1QBXorIjs'
    }
  });

  return next(authReq);
};
