import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceBookListModalComponent } from './service-book-list-modal.component';

describe('ServiceBookListModalComponent', () => {
  let component: ServiceBookListModalComponent;
  let fixture: ComponentFixture<ServiceBookListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceBookListModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceBookListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
