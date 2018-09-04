const homePage = {
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('home-page'))),
};
const streamPage = {
  isGone: () => protractor.ExpectedConditions.not(protractor.ExpectedConditions.titleContains('Buurt')),
};

describe('routes', () => {
  beforeAll(() => {
    browser.get('/');
    browser.wait(homePage.isLoaded(), 10000);
  });
  it('should redirect to the login page on ID for an expired token', () => {
    // Set expired token
    browser.executeScript("window.localStorage.setItem('authToken', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rpb24iOiJ0aXBwaXEtaWQubG9naW5fc2Vzc2lvbiIsImlhdCI6MTQ5MDI2NjA4MCwiZXhwIjoxNDkwMjY2MDkwLCJhdWQiOiJ0aXBwaXEtaWQubG9jYWwiLCJpc3MiOiJ0aXBwaXEtaWQubG9jYWwiLCJzdWIiOiI0MWY3NzVjYS01MzIwLTQzOTUtOTcyMS03ZjUxNmQzMzM5YjIifQ.MEUCIQCvWyVMc9RoecETD3qeZxnI9GBO9c5gkJeV8d2354rkCgIgXIG0972pEviATg5riLBn5ZvXpxaA8r4ukOuEprA8jZs');");

    // Navigate to stream
    browser.get('/mijn-buurt');

    // Expect redirect
    browser.wait(streamPage.isGone(), 10000);
  });
});
