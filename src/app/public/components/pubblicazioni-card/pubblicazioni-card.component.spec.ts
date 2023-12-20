import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PubblicazioniCardComponent } from './pubblicazioni-card.component';

describe('PubblicazioniCardComponent', () => {
  let component: PubblicazioniCardComponent;
  let fixture: ComponentFixture<PubblicazioniCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PubblicazioniCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PubblicazioniCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
