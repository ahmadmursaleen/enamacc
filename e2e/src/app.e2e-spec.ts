import { browser, element, by } from 'protractor';

describe('workspace-project App', () => {
  beforeEach(() => {
    browser.get('/');
  });

  // Following are some integration test i.e. to check the flow of the application

  it('should have a list of recipants', () => {
    let list = by.id('recList');
    let listElement = element(list).isPresent();
    expect(listElement).toBeTruthy();
  });

  it('should have a email/company input field', () => {
    let list = by.id('autoInput');
    let listElement = element(list).isPresent();
    expect(listElement).toBeTruthy();
  });

  it('should have a company list', () => {
    let list = by.id('companyList');
    let listElement = element(list).isPresent();
    expect(listElement).toBeTruthy();
  });

  it('should have an email expansion panel', () => {
    let list = by.id('emailPanel');
    let listElement = element(list).isPresent();
    expect(listElement).toBeTruthy();
  });

  it('should have two recipient lists by default', () => {
    let list = by.id('recipientsList');
    let recipients = element.all(list);
    expect(recipients.count()).toBe(2);
  });
});
