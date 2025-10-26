import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmasListComponent } from './alarmas-list.component';

describe('AlarmasListComponent', () => {
  let component: AlarmasListComponent;
  let fixture: ComponentFixture<AlarmasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlarmasListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlarmasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
