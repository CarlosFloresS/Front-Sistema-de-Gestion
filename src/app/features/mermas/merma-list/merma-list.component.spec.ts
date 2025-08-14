import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MermaListComponent } from './merma-list.component';

describe('MermaListComponent', () => {
  let component: MermaListComponent;
  let fixture: ComponentFixture<MermaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MermaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MermaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
