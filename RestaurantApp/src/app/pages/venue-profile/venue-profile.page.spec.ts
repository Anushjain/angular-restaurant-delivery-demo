import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VenueProfilePage } from './venue-profile.page';

describe('VenueProfilePage', () => {
  let component: VenueProfilePage;
  let fixture: ComponentFixture<VenueProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenueProfilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VenueProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
