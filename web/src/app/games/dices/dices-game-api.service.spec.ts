import { TestBed, inject } from '@angular/core/testing';

import { DicesGameApiService } from './dices-game-api.service';

describe('OkaGameApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DicesGameApiService]
    });
  });

  it('should be created', inject([DicesGameApiService], (service: DicesGameApiService) => {
    expect(service).toBeTruthy();
  }));
});
