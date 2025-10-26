import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntecedentesMedicosComponent } from './antecedentes-medicos.component';

describe('AntecedentesMedicosComponent', () => {
  let component: AntecedentesMedicosComponent;
  let fixture: ComponentFixture<AntecedentesMedicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntecedentesMedicosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AntecedentesMedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
