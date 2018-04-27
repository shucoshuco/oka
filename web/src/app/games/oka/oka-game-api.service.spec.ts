import { TestBed, inject } from '@angular/core/testing';

import { OkaGameApiService } from './oka-game-api.service';

describe('OkaGameApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OkaGameApiService]
    });
  });

  it('should be created', inject([OkaGameApiService], (service: OkaGameApiService) => {
    expect(service).toBeTruthy();
  }));
});
