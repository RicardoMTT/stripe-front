import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  constructor(private http: HttpClient) {}

  charge(cantidad, token) {
    this.http
      .post('http://localhost:3000/stripe_checkout', {
        stripeToken: token,
        cantidad,
      })
      .toPromise();
  }
}
