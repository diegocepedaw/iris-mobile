import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { IrisProvider, OncallUser} from '../../providers/iris/iris';
import { OncallTeamPage } from '../oncall-team/oncall-team';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'page-oncall-user',
  templateUrl: 'oncall-user.html',
})

export class OncallUserPage {

  user: OncallUser;
  loading: boolean;
  loadingError: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public iris: IrisProvider, private toastCtrl: ToastController, private sanitizer: DomSanitizer) {
  }

  ionViewWillEnter() {
    this.getUser();  
  }

  getUser(){
    this.loading = true;
    this.loadingError = false;
    this.iris.getOncallUser(this.navParams.get('username')).subscribe(
      (data) => {
        // populate user with data from api call
        this.user = data;
        this.loading = false;
      },
      (err) => {
        this.loadingError = true;
        this.loading = false;
        this.createToast('loadingError: failed to fetch oncall user.')
      }
    );
  }

  teamTapped(tapped_team) {
    this.navCtrl.push(OncallTeamPage, {
      team_name: tapped_team
    });
  }

  getSmsUrl(smsNumber) {
    var smslink = smsNumber.replace(/ /, '');
    smslink = smslink.replace(/-/g, '');
    smslink.replace(/\+/, '');
    smslink = 'sms:' + smslink;
    return this.sanitizer.bypassSecurityTrustUrl(smslink);
  }

  createToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'OK'
    });
    toast.present();
  }

}
