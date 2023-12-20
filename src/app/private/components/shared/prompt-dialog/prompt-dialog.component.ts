import { Component, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.scss']
})
export class PromptDialogComponent implements OnInit {
  @Input()
  title!: string;

  @Input()
  text!: string;

  @Output()
  afterSave: Subject<any> = new Subject<any>();

  returnValue: any = '';

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<PromptDialogComponent>
  ) {

  }

  ngOnInit(): void {
    this.dialogRef.afterClosed().subscribe(result => {
      this.afterSave.next(null);
      return true;
    });
  }


  save() {
    this.afterSave.next(this.returnValue);
    this.dialogRef.close();
  }

  cancel() {
    this.afterSave.next(null);
    this.dialogRef.close();
  }
}
