import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoriaDetailsComponent } from './storia-details.component';

describe('StoriaDetailsComponent', () => {
  let component: StoriaDetailsComponent;
  let fixture: ComponentFixture<StoriaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoriaDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoriaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
