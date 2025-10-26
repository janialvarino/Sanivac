import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosComplementariosComponent } from './datos-complementarios.component';

describe('DatosComplementariosComponent', () => {
  let component: DatosComplementariosComponent;
  let fixture: ComponentFixture<DatosComplementariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosComplementariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosComplementariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
