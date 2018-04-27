import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DicesGameComponent } from './dices-game.component';

describe('DicesGameComponent', () => {
  let component: DicesGameComponent;
  let fixture: ComponentFixture<DicesGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DicesGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DicesGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
