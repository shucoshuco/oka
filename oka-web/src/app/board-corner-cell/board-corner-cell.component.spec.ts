import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardCornerCellComponent } from './board-corner-cell.component';

describe('BoardCornerCellComponent', () => {
  let component: BoardCornerCellComponent;
  let fixture: ComponentFixture<BoardCornerCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardCornerCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardCornerCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
