import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Zone } from './zone.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';


export interface Reservation {
    id: number;
    userid: number;
    type: string;
    numberOfCards: number;
    token: string;
    promo: string;
    price: number;
    promoused: string;
}

@Injectable({
    providedIn: 'root',
})
export class ReservationService {


    promoCheck(promoCode: string): Observable<boolean> {
        const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
        return this.http.post<boolean>('http://localhost:8080/reservation/promo', promoCode, { headers });
    }

    constructor(private http: HttpClient) { }

    saveReservation(
        id: number,
        userid: number,
        type: string,
        numberOfCards: number,
        token: string,
        promo: string,
        price: number,
        promoused: string
    ): Observable<any> {
        const reservation = { id, userid, type, numberOfCards, token, promo, price, promoused };
        return this.http.post<Reservation>('http://localhost:8080/reservation/save', reservation);
    }
}