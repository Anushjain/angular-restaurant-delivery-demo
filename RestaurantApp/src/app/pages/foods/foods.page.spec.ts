import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FoodsPage } from './foods.page';

describe('FoodsPage', () => {
  let component: FoodsPage;
  let fixture: ComponentFixture<FoodsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FoodsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
