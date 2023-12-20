import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PubblicazioniComponent } from './pubblicazioni.component';

describe('PubblicazioniComponent', () => {
  let component: PubblicazioniComponent;
  let fixture: ComponentFixture<PubblicazioniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PubblicazioniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PubblicazioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
