import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialVacunasComponent } from './historial-vacunas.component';

describe('HistorialVacunasComponent', () => {
  let component: HistorialVacunasComponent;
  let fixture: ComponentFixture<HistorialVacunasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialVacunasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialVacunasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
