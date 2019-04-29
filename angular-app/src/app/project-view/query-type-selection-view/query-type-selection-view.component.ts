import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FBServiceService} from "../../fb-service.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {NewQuery} from "../../NewQuery";
import {DirectoryService} from "../../directory.service";
import {Project} from "../../Project";
import {Group} from "../../Group";

export interface name {
    name: string;
}


@Component({
    selector: 'app-query-type-selection-view',
    templateUrl: './query-type-selection-view.component.html',
    styleUrls: ['./query-type-selection-view.component.css']
})
export class QueryTypeSelectionViewComponent implements OnInit {

    private listOfGroups: Group[] = [];
    private name = '';
    private  isLoading = false;


    constructor(private fbService: FBServiceService, private dialog: MatDialog, private directoryService: DirectoryService) {
    }

    @Output()
    exportView: EventEmitter<string> = new EventEmitter();


    ngOnInit() {
        this.directoryService.getProject(this.directoryService.selectedUser, this.directoryService.selectedProject)
            .subscribe((projects: string) => {
                const tempProject: Project = JSON.parse(projects);
                this.listOfGroups = tempProject.group;
            });
    }

    openDialog() {
        const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
            width: '250px',
            data: {name: this.name}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.name = result;

            if (result) {
                const exportQuery: NewQuery = new NewQuery(
                    this.name,
                    ['message', 'comments', 'likes', 'reactions', 'picture', 'link'],
                    {from: '', till: ''},
                    this.listOfGroups,
                    {max: 100, tags: []}
                );


                this.fbService.DoSearchForPosts(exportQuery);
                this.isLoading = true;
            } else {

            }

        });
    }

    changeView(input: string) {
        if (input === 'brugerdefineret') {
            this.exportView.emit('1');


        } else if (input === 'standard') {
            this.fbService.retrievePosts();
            this.exportView.emit('2');

        }
    }

}

@Component({
    selector: 'app-dialog-overview-example-dialog',
    templateUrl: 'dialog.html',
})
export class DialogOverviewExampleDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<DialogOverviewExampleDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: name) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
