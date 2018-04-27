import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DicesTimerComponent } from './dices-timer.component';

describe('DicesTimerComponent', () => {
  let component: DicesTimerComponent;
  let fixture: ComponentFixture<DicesTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DicesTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DicesTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should print', () => {
    component.printTime(0);
    expect(component.timer).toBe('00m 00s 0d');

    component.printTime(1000);
    expect(component.timer).toBe('00m 01s 0d');

    component.printTime(61200);
    expect(component.timer).toBe('01m 01s 2d');
  })
});
