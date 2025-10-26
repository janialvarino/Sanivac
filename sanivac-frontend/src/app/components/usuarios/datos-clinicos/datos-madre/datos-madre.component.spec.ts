import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosMadreComponent } from './datos-madre.component';

describe('DatosMadreComponent', () => {
  let component: DatosMadreComponent;
  let fixture: ComponentFixture<DatosMadreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosMadreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosMadreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
