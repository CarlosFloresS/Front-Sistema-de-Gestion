import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MermaFormComponent } from './merma-form.component';

describe('MermaFormComponent', () => {
  let component: MermaFormComponent;
  let fixture: ComponentFixture<MermaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MermaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MermaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
