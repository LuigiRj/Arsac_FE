import { UsersService } from './../../../services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { debounceTime, Observable, switchMap } from 'rxjs';
import { Scheda } from 'src/app/models/scheda.model';
import { User } from 'src/app/models/shared/user.model';
import { ImportExportService } from 'src/app/services/import-export.service';
import { ReportService } from 'src/app/services/report.service';
import { UtilsService } from 'src/app/services/utils.service';

export class Report {
  user!: User;
  doc_count!: number

  constructor(report: any) {
    this.user = new User(report.user)
    this.doc_count = report.results
  }
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  dataSource: MatTableDataSource<Report> = new MatTableDataSource<Report>();
  displayedColumns = ['firstName', 'lastName', 'numero'];

  searchForm!: FormGroup

  usersDataSource!: Observable<User[]>;

  JSON = JSON;

  constructor(
    public utilsService: UtilsService,
    private importExportService: ImportExportService,
    private reportService: ReportService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      startDate: new FormControl(),
      endDate: new FormControl(),
      user: new FormControl()
    })
    this.initAutocomplete();
    this.search()
  }

  initAutocomplete() {
    this.usersDataSource = this.searchForm.controls.user.valueChanges.pipe(
      debounceTime(500),
      switchMap(searchQuery => {
        if (typeof searchQuery === "string" && searchQuery)
          return this.usersService.getAutocomplete(searchQuery);
        else return this.usersDataSource;
      }));
  }

  search() {
    const raw = this.searchForm.getRawValue();
    if (raw.startDate) raw.startDate = moment(raw.startDate).toDate()
    else delete raw.startDate
    if (raw.endDate) raw.endDate = moment(raw.endDate).toDate()
    else delete raw.endDate
    if (raw.user) raw.user = raw.user.id
    else delete raw.user

    this.reportService.report(raw).subscribe(res => {
      this.populateTable(res)
    })
  }

  clear() {
    this.searchForm.reset();
    this.search();
  }

  populateTable(report: Report[]) {
    this.dataSource.data = report
  }

  export() {
    this.importExportService.exportReport(this.dataSource.data).subscribe(res => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      this.utilsService.download(`REPORT_${moment().format('DD_MM_Y')}.xlsx`, url)
    })
  }

}
