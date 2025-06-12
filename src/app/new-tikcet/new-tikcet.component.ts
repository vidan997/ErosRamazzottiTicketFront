import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZoneService } from '../zone.service';
import { ReservationService } from '../reservation.service';
import { Zone } from '../zone.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-new-tikcet',
  imports: [FormsModule, CommonModule],
  templateUrl: './new-tikcet.component.html',
  styleUrls: ['./new-tikcet.component.css']
})
export class NewTikcetComponent {
  selectedZone: string = ''; 
  ticketCount: number = 1; 
  discount: string = '0%'; 
  price: number = 0; 
  bookingMessage: string = ''; 
  isBookingMessageValid: boolean = true; 
  promoCode: string = ''; 
  generatedToken: string = ''; 
  promoCodeUsed: string = '';
  zoneDetails: Zone[] = []; 
  promoCodeStatus: 'valid' | 'invalid' | null = null; 

  name: string = '';
  surname: string = '';
  company: string = '';
  address: string = '';
  zipCode: string = '';
  city: string = '';
  country: string = '';
  email: string = '';
  confirmEmail: string = '';
  zoneTypes: string[] = [];
  SumPrice = 0;

  ngOnInit(): void {
    this.zoneService.getZones();
    this.zoneService._zones.subscribe(zones => {
      console.log('Updated zones:', zones); 
      this.zoneTypes = this.zoneService.getZoneTypes(); 
    });
  }

  constructor(private zoneService: ZoneService, private reservationService: ReservationService, private userService: UserService) {
    this.zoneTypes = this.zoneService.getZoneTypes();
    console.log(this.zoneTypes);
  }

  updateZoneDetails() {
    const zone = this.zoneService.getZoneDetails(this.selectedZone);
    if (zone) {
      this.zoneDetails = [zone];
    } else {
      this.zoneDetails = [];
    }
    this.ticketCount = 1;
    this.updatePriceAndDiscount();
  }

  updatePriceAndDiscount() {
    const zone = this.zoneService.getZoneDetails(this.selectedZone);

    let totalDiscount = 0;

    if (this.ticketCount > 5) {
      totalDiscount = 50; 
    }

    if (this.promoCodeStatus === 'valid') {
      totalDiscount += 5; 
    }

    this.discount = `${totalDiscount}%`;

    let totalPrice = this.ticketCount * (zone?.price || 0);
    if (totalDiscount > 0) {
      totalPrice *= (1 - totalDiscount / 100); 
    }

    this.SumPrice = totalPrice;
    this.price = totalPrice;
  }

  bookTicket() {
    if (!this.isFormValid()) {
      this.bookingMessage = 'Please fill out all required fields correctly.';
      this.isBookingMessageValid = false; 
      return;
    }

    this.userService.saveUser(
      0,
      this.name,
      this.surname,
      this.address,
      this.company,
      this.zipCode,
      this.city,
      this.country,
      this.email,
      this.confirmEmail
    ).subscribe(response => {
      const newUserId = response.userid;
      console.log('User saved successfully!', response);

      this.reservationService.saveReservation(
        0,
        newUserId,
        this.selectedZone,
        this.ticketCount,
        this.generatedToken,
        this.promoCode,
        this.SumPrice,
        this.promoCodeUsed
      ).subscribe(response => {
        if (response && response.token) {
          this.generatedToken = response.token;
        } else {
          this.generatedToken = `TICKET-${Date.now()}`;
        }

        this.bookingMessage = `Your ticket has been booked! Token: ${this.generatedToken}`;

        if (response && response.promo) {
          this.promoCode = response.promo;
          this.bookingMessage += ` Promo Code: ${this.promoCode}`;
        }

        console.log(this.bookingMessage);
        this.isBookingMessageValid = true;

      }, error => {
        console.error('Error saving reservation:', error);
        this.isBookingMessageValid = false;
        this.bookingMessage = 'Reservation failed. Please try again.';
      });

    }, error => {
      console.error('Error saving user!', error);
    });
  }

  checkPromoCode() {
    this.reservationService.promoCheck(this.promoCodeUsed.toUpperCase()).subscribe(
      (isValid) => {
        if (isValid) {
          this.promoCodeStatus = 'valid';
          console.log('Promo code is valid!');
        } else {
          this.promoCodeStatus = 'invalid';
          console.log('Promo code is invalid.');
        }

        this.updatePriceAndDiscount();
      },
      (error) => {
        console.error('Error validating promo code', error);
        this.promoCodeStatus = 'invalid';
        this.updatePriceAndDiscount();
      }
    );
  }

  onTicketCountChange() {
    const maxTickets = this.zoneDetails[0]?.numberofchairs || 0;

    if (this.ticketCount > maxTickets) {
      this.ticketCount = maxTickets;
    } else if (this.ticketCount < 1) {
      this.ticketCount = 1;
    }

    this.updatePriceAndDiscount();
  }

  isFormValid(): boolean {
    return !!this.name &&
      !!this.surname &&
      !!this.company &&
      !!this.address &&
      !!this.zipCode &&
      !!this.city &&
      !!this.country &&
      !!this.email &&
      !!this.confirmEmail &&
      this.ticketCount >= 1 &&
      !!this.selectedZone;
  }
}
