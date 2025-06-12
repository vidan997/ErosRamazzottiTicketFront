import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
    userid: number;
    name: string;
    surname: string;
    adress: string;
    company: string;
    postcode: string;
    city: string;
    country: string;
    email: string;
    confirmemail: string;
}


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:8080/user/save';

    constructor(private http: HttpClient) { }

    saveUser(
        userid: number,
        name: string,
        surname: string,
        adress: string,
        company: string,
        postcode: string,
        city: string,
        country: string,
        email: string,
        confirmemail: string
    ): Observable<any> {
        const user = {
            userid,
            name,
            surname,
            adress,
            company,
            postcode,
            city,
            country,
            email,
            confirmemail
        };

        return this.http.post<User>(this.apiUrl, user);
    }
}
