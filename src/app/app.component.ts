import { Component } from '@angular/core';
import { RecipientApi, RecipientList, Company } from './services/recipient-api.service';
import { Domains } from './domains';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'recipient-list';
  recipientList: RecipientList[];
  companiesList: Company[];
  currentRecipientList: RecipientList;
  domains: Domains;
  myControl: FormControl;
  autoList: Company[];
  form: FormGroup;

  constructor(private RecipientApi: RecipientApi, private FormBuilder: FormBuilder) {
    this.form = FormBuilder.group({
      newEmail: ['', [Validators.required, this.emailValid()]]
    });
  }

  ngOnInit() {
    // Invoking the service to get recipient lists and comapnies lists on initialization
    this.RecipientApi.getRecipientLists().subscribe(
      response => {
        this.recipientList = response;
        this.currentRecipientList = response[0];
      },
      error => {
        alert('Error:' + error.statusText);
      }
    );
    this.RecipientApi.getCompanies().subscribe(
      response => {
        this.companiesList = response;
      },
      error => {
        alert('Error:' + error.statusText);
      }
    );
    // Calling the setDomains function to convert email into domain and email name
    this.setDomains();

    // Creating a seperate companies list to use for the auto complete feature
    this.autoList = this.companiesList.map(a => Object.assign({}, a));
  }

  // Function to select the current recipient list displayed in the mat drawer content
  selectRecipientList(list: RecipientList) {
    this.currentRecipientList = list;
    this.setDomains();
  }

  // Function to delete the selected company from a recipient list
  deleteCompany(num: number, name: string) {
    // First the index is found using for loop and then it is spliced
    for (let i = 0; i < this.currentRecipientList.companyRecipients.length; i++) {
      if (this.currentRecipientList.companyRecipients[i] === num) {
        this.currentRecipientList.companyRecipients.splice(i, 1);
      }
    }
  }

  // Function to convert the emails from the current recipient list to domains and sub domains
  setDomains() {
    this.domains = {};
    this.currentRecipientList.emailRecipients.forEach(element => {
      if (!this.domains[element.split('@')[1]]) {
        this.domains[element.split('@')[1]] = [element.split('@')[0]];
      } else {
        this.domains[element.split('@')[1]].push(element.split('@')[0]);
      }
    });
  }

  // Function to delete the entire email domain
  deleteDomain(dom: string, values: string[]) {
    for (let i = 0; i < values.length; i++) {
      let str: string = values[i] + '@' + dom;
      for (let i = 0; i < this.currentRecipientList.emailRecipients.length; i++) {
        if (this.currentRecipientList.emailRecipients[i] === str) {
          this.currentRecipientList.emailRecipients.splice(i, 1);
        }
      }
      this.setDomains();
    }
  }

  // Function to delete a specific email address from a partiuclar domain
  deleteEmail(dom: string, sub: string) {
    let str: string = sub + '@' + dom;
    for (let i = 0; i < this.currentRecipientList.emailRecipients.length; i++) {
      if (this.currentRecipientList.emailRecipients[i] === str) {
        this.currentRecipientList.emailRecipients.splice(i, 1);
      }
    }
    this.setDomains();
  }

  // Function to add company from the autocomplete
  addCompany(company: Company, i: number) {
    this.form.reset();
    if (this.currentRecipientList.companyRecipients.indexOf(company.id) === -1) {
      this.currentRecipientList.companyRecipients.push(company.id);
      this.autoList.splice(i, 1);
    }
  }

  // Custom Email Validator
  emailValid() {
    return control => {
      let regex = /(([a-z]([a-z]|[0-9]|(\.)|(\-)|(\_)))*)\@([a-z]([a-z]|(\-))([a-z]|(\-))*)\.([a-z]+)$/;
      return regex.test(control.value) ? null : { invalidEmail: true };
    };
  }

  // Adding a new email
  addEmail() {
    if (this.form.valid) {
      this.currentRecipientList.emailRecipients.push(this.form.value.newEmail);
      this.setDomains();
      this.form.reset();
    }
  }
}
