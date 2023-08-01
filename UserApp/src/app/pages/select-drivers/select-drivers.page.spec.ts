import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectDriversPage } from './select-drivers.page';

describe('SelectDriversPage', () => {
  let component: SelectDriversPage;
  let fixture: ComponentFixture<SelectDriversPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectDriversPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectDriversPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
