import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTikcetComponent } from './new-tikcet.component';

describe('NewTikcetComponent', () => {
  let component: NewTikcetComponent;
  let fixture: ComponentFixture<NewTikcetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTikcetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTikcetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
