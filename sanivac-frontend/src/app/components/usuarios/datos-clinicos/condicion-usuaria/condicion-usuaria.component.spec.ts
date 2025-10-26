import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CondicionUsuariaComponent } from './condicion-usuaria.component';

describe('CondicionUsuariaComponent', () => {
  let component: CondicionUsuariaComponent;
  let fixture: ComponentFixture<CondicionUsuariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CondicionUsuariaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CondicionUsuariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
