import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacunasListComponent } from './vacunas-list.component';

describe('VacunasListComponent', () => {
  let component: VacunasListComponent;
  let fixture: ComponentFixture<VacunasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacunasListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacunasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
