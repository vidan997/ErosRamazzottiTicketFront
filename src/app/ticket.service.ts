import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private apiUrl = 'http://localhost:8080/reservation';

  constructor(private http: HttpClient) {}

  getReservationByToken(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/${token}`);
  }

  updateReservation(reservation: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/upadate`, reservation);
  }

  deleteReservation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  checkPromoCode(promoCode: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
    return this.http.post<boolean>('http://localhost:8080/reservation/promoValid', promoCode, { headers });
}
}
