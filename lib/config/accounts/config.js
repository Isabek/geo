AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');

AccountsTemplates.configure({
  showForgotPasswordLink: false,
  overrideLoginErrors: true,
  enablePasswordChange: false,
  sendVerificationEmail: false,
  negativeValidation: true,
  positiveValidation: true,
  negativeFeedback: false,
  positiveFeedback: true
});

AccountsTemplates.removeField('email');
var password = AccountsTemplates.removeField('password');

AccountsTemplates.addFields([{
  _id: 'username',
  type: 'text',
  displayName: "Username",
  errStr: 'Please insert username!',
  required: true
}, password]);
