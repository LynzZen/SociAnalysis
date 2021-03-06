import {Component} from '@angular/core';
import {FBServiceService} from '../fb-service.service';
import {Router} from '@angular/router';
import {NavigationService} from '../navigation.service';
import {DirectoryService} from '../directory.service';
import {MatDialog} from '@angular/material';

@Component({
    selector: 'app-login-view',
    templateUrl: './login-view.component.html',
    styleUrls: ['./login-view.component.css']
})

export class LoginViewComponent {
    loading: boolean;
    failed: boolean;
    showButton: boolean;

    constructor(
        private fbService: FBServiceService,
        private router: Router,
        private navigationservice: NavigationService,
        private directoryservice: DirectoryService,
        public dialog: MatDialog
    ) {
        this.loading = false;
        this.failed = false;
        this.showButton = true;
        navigationservice.setNavi = false;
    }

    loginToFacebook() {
        this.loading = true;
        this.showButton = false;
        this.failed = false;
        this.fbService
            .login()
            .then((id: any) => {
                this.directoryservice.userExists(id.userID).subscribe((response) => {
                    if (!response) {
                        this.directoryservice.createUserDirectory(id.userID).subscribe((created) => {
                            this.navigationservice.setNavi = true;
                            this.navigationservice.backButtonIsActive = false;
                            this.router.navigate(['/home']);
                            console.log('Created user path/ ', id.userID);
                        });
                    } else {
                        this.navigationservice.setNavi = true;
                        this.navigationservice.backButtonIsActive = false;
                        this.router.navigate(['/home']);
                        console.log('User already exists/ ', id.userID);
                        this.fbService.getAndSetUserName();
                    }
                });
            })
            .catch(error => {
                console.log('Error: not logged in');
                this.showButton = true;
                this.loading = false;
                this.failed = true;
            });
    }
}
