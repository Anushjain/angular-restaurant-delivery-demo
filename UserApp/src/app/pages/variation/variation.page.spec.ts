import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VariationPage } from './variation.page';

describe('VariationPage', () => {
  let component: VariationPage;
  let fixture: ComponentFixture<VariationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VariationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
