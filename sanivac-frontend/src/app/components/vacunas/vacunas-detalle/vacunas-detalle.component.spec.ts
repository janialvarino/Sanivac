import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacunasDetalleComponent } from './vacunas-detalle.component';

describe('VacunasDetalleComponent', () => {
  let component: VacunasDetalleComponent;
  let fixture: ComponentFixture<VacunasDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacunasDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacunasDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
