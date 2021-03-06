import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FBServiceService} from '../fb-service.service';
import {NavigationService} from '../navigation.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {NewProjectService} from '../new-project.service';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
    public name = '';

    constructor(private fbservice: FBServiceService,
                private navigationservice: NavigationService,
                private router: Router,
                private location: Location,
                private newprojectservice: NewProjectService) {
    }

    ngOnInit() {
        this.fbservice.userName.subscribe((name) => {
            this.name = name;
        });
    }

    goBack() {
        if (this.newprojectservice.ViewingNewProject === true) {
            if (this.newprojectservice.NewProject === true) {
                if (this.newprojectservice.Toggle !== 0) {
                    this.newprojectservice.Toggle = this.newprojectservice.Toggle - 1;
                } else {
                    this.newprojectservice.ViewingNewProject = false;
                    this.navigationservice.backButtonIsActive = false;
                    this.router.navigate(['/home']);
                }
            } else {
                this.newprojectservice.ViewingNewProject = false;
                this.navigationservice.backButtonIsActive = true;
                this.navigationservice.GoBackRoute = ['/home'];
                this.router.navigate(['/projekt']);

            }
        } else {
            this.navigationservice.backButtonIsActive = false;
            this.router.navigate(this.navigationservice.GoBackRoute);
        }
    }

    routeToHome() {
        this.navigationservice.backButtonIsActive = false;
        this.router.navigate(['/home']);
    }

    logoutOfFacebook() {
        this.fbservice.logout();
        this.navigationservice.setNavi = false;
        this.navigationservice.backButtonIsActive = false;
        this.router.navigate(['']);
    }


}
