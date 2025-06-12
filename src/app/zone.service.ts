import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Zone } from './zone.model';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class ZoneService {

  public _zones = new BehaviorSubject<Zone[]>([]);

  constructor(private http: HttpClient) { }

  getZones() {
    this.http.get<Zone[]>('http://localhost:8080/zones/all').pipe(
      map(responseData => {
        const newZones = responseData.map(zone => ({
          numberofchairs: zone.numberofchairs,
          type: zone.type,
          price: zone.price
        }));
        console.log('Fetched zones:', newZones); 
        this._zones.next(newZones);
      })
    ).subscribe(
      () => console.log('Zones fetched successfully'),
      error => console.error('Error fetching zones:', error) 
    );
  }


  getZoneDetails(zoneName: string): Zone | undefined {
    return this._zones.getValue().find(zone => zone.type === zoneName);
  }

  getAvailableTickets(zoneName: string): number {
    let availableTickets = 0;
    this._zones.subscribe(zones => {
      const zone = zones.find(z => z.type === zoneName);
      if (zone) {
        availableTickets = zone.numberofchairs || 0;
      }
    });
    return availableTickets;
  }

  getPrice(zoneName: string): number {
    let price = 0;
    this._zones.subscribe(zones => {
      const zone = zones.find(z => z.type === zoneName);
      price = zone?.price ?? 0;
    });
    return price;
  }

  getZoneTypes(): string[] {
    return this._zones.value
      .map(zone => zone.type) 
      .filter((type): type is string => type !== undefined);
  }
}

