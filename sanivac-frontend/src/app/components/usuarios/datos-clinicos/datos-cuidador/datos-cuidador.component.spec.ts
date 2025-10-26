import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosCuidadorComponent } from './datos-cuidador.component';

describe('DatosCuidadorComponent', () => {
  let component: DatosCuidadorComponent;
  let fixture: ComponentFixture<DatosCuidadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosCuidadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosCuidadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
