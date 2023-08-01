import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VariationsPage } from './variations.page';

describe('VariationsPage', () => {
  let component: VariationsPage;
  let fixture: ComponentFixture<VariationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariationsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VariationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
