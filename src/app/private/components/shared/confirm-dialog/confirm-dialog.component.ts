import { Component, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  @Input()
  text!: string;

  @Output()
  afterSave: Subject<boolean> = new Subject<boolean>();

  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) { }

  ngOnInit(): void {
    this.dialogRef.afterClosed().subscribe(result => {
      this.afterSave.next(false);
      return true;
    })
  }

  ok() {
    this.afterSave.next(true);
    this.dialogRef.close();
  }

  cancel() {
    this.afterSave.next(false);
    this.dialogRef.close();
  }

}
