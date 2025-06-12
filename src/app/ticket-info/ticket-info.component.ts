import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../ticket.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ticket-info',
  templateUrl: './ticket-info.component.html',
  styleUrls: ['./ticket-info.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class TicketInfoComponent {
  ticketCode: string = '';
  ticketDetails: any = null;
  userDetails: any = null;
  promoUsedValid: boolean | null = null;
  errorMessage: string = '';
  isChangeTicketVisible: boolean = false;
  newNumberOfTickets: number = 0;

  constructor(
    private ticketService: TicketService,
    private httpClient: HttpClient
  ) {}

  getTicketDetails() {
    if (!this.ticketCode.trim()) {
      this.errorMessage = 'Please enter a valid ticket code.';
      return;
    }

    this.errorMessage = '';
    this.ticketService.getReservationByToken(this.ticketCode).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.ticketDetails = data[0]; 
          this.newNumberOfTickets = this.ticketDetails.numberOfCards; 

          this.userDetails = this.ticketDetails.user || null;

          this.updateDiscount();

          this.checkPromoUsedValidity();
        } else {
          this.errorMessage = 'Ticket not found.';
          this.ticketDetails = null;
          this.userDetails = null;
        }
      },
      () => {
        this.errorMessage = 'An error occurred. Please try again.';
        this.ticketDetails = null;
        this.userDetails = null;
      }
    );
  }

  updateDiscount() {
    let totalDiscount = 0;

    if (this.ticketDetails.numberOfCards > 5) {
      totalDiscount = 50;
    }
    if (this.ticketDetails.promoused && this.ticketDetails.promoused.trim() !== '') {
      if (this.promoUsedValid) {
        totalDiscount += 5;
      }
    }

    this.ticketDetails.discount = totalDiscount;
  }

  checkPromoUsedValidity() {
    if (this.ticketDetails.promoused && this.ticketDetails.promoused.trim() !== '') {
      this.ticketService.checkPromoCode(this.ticketDetails.promoused).subscribe(
        (valid) => {
          this.promoUsedValid = valid;
          this.updateDiscount(); 
        },
        () => {
          this.promoUsedValid = false;
          this.updateDiscount(); 
        }
      );
    } else {
      this.promoUsedValid = null;
      this.updateDiscount(); 
    }
  }

  onChangeTicket() {
    if (this.newNumberOfTickets > 0) {
      this.ticketDetails.numberOfCards = this.newNumberOfTickets;

      this.updateDiscount();

      this.ticketService.updateReservation(this.ticketDetails).subscribe(
        () => {
          this.isChangeTicketVisible = false;
        },
        () => {
          this.errorMessage = 'Failed to update ticket.';
        }
      );
    } else {
      this.errorMessage = 'Please provide a valid number of tickets.';
    }
  }

  showChangeTicketForm() {
    this.isChangeTicketVisible = true;
  }

  onDeactivateTicket() {
    if (this.ticketDetails && this.ticketDetails.id) {
      this.ticketService.deleteReservation(this.ticketDetails.id).subscribe(
        () => {
          alert('Ticket has been deactivated.');
          this.ticketDetails = null;
          this.userDetails = null;
        },
        (error) => {
          this.errorMessage = 'Failed to deactivate and delete the ticket.';
        }
      );
    }
  }

  getTotalPrice(): number {
    if (this.ticketDetails) {
      const totalPrice =  this.ticketDetails.price;
      const discount = this.ticketDetails.discount / 100;
      return totalPrice - totalPrice * discount;
    }
    return 0;
  }
}
