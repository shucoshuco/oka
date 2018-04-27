import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDiceComponent } from './image-dice.component';

describe('ImageDiceComponent', () => {
  let component: ImageDiceComponent;
  let fixture: ComponentFixture<ImageDiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageDiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageDiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
